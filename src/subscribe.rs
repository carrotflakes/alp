use std::sync::Arc;

use redis::{Commands, ControlFlow, PubSubCommands};

use crate::{domain, repository::Repository, simple_broker::SimpleBroker, usecases};

pub fn incoming_subscribe(redis: Arc<redis::Client>, repository: Arc<Repository>) {
    println!("subscribe");
    let mut conn = redis.get_connection().unwrap();

    // conn.subscribe::<_, _, String>(vec!["foo", "user"], |msg| {
    //     println!("{:?}", msg);
    //     // if msg.get_channel_name() == "user" {
    //     //     let payload = msg.get_payload().unwrap();
    //     //     // SimpleBroker::<User>::publish(msg)
    //     // }
    //     ControlFlow::Continue
    // }).unwrap();

    conn.psubscribe::<_, _, String>("__keyspace@0__:userStatus:*", |msg| {
        // println!("{:?}", msg);
        let event = msg.get_payload::<String>().unwrap();
        if msg.get_pattern::<String>().unwrap() == "__keyspace@0__:userStatus:*"
            && ["del", "set"].contains(&event.as_str())
        {
            let mut conn = redis.get_connection().unwrap();
            let channel = msg.get_channel_name();
            let workspace_user_id = channel.split(":").nth(2).unwrap().parse::<i32>().unwrap();
            let user_status = conn
                .get::<_, Option<String>>(format!("userStatus:{}", workspace_user_id).as_str())
                .unwrap()
                .and_then(|s| s.parse().ok())
                .unwrap_or(domain::UserStatus::Offline);
            let workspace_user =
                usecases::workspace_user(repository.get_workspace_user(workspace_user_id).unwrap());
            let user_update = WorkspaceUserUpdate {
                workspace_user,
                status: user_status,
            };
            dbg!(&user_update);
            SimpleBroker::publish(user_update);
        }
        ControlFlow::Continue
    })
    .unwrap();
}

#[derive(Debug, Clone)]
pub struct WorkspaceUserUpdate {
    pub workspace_user: domain::WorkspaceUser,
    pub status: domain::UserStatus,
}
