mod insert;
mod query;

use chrono::Utc;
use diesel::prelude::*;
use redis::Commands;
use std::sync::Arc;

use crate::{
    db::{
        schema::{
            messages, rooms, user_rooms, users, workspace_invitations, workspace_users, workspaces,
        },
        PgPool, PgPooled,
    },
    domain::{Role, UserStatus},
};
use insert::*;
pub use query::*;

pub struct Repository {
    conn: Arc<PgPool>,
    redis: Arc<redis::Client>,
}

#[derive(Debug)]
pub enum Error {
    NotFound,
    Other(String),
}

impl Error {
    pub fn to_string(&self) -> String {
        match self {
            Error::NotFound => "NotFound".to_owned(),
            Error::Other(s) => s.to_owned(),
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;

impl Repository {
    pub fn new(conn: Arc<PgPool>, redis: Arc<redis::Client>) -> Self {
        Self { conn, redis }
    }

    fn get_conn(&self) -> Result<PgPooled> {
        self.conn.get().map_err(|x| Error::Other(x.to_string()))
    }

    pub fn create_user(&self, uid: &str, name: &str) -> Result<User> {
        let new_user = NewUser { uid, name };

        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn add_message(&self, user_id: i32, room_id: i32, text: &str) -> Result<Message> {
        let new_message = NewMessage {
            user_id,
            room_id,
            text,
        };

        diesel::insert_into(messages::table)
            .values(&new_message)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn create_room(&self, workspace_id: i32, code: &str) -> Result<Room> {
        let new_room = NewRoom { workspace_id, code };

        diesel::insert_into(rooms::table)
            .values(&new_room)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn add_user_room(&self, user_id: i32, room_id: i32) -> Result<usize> {
        let new_user_room = NewUserRoom { user_id, room_id };

        diesel::insert_into(user_rooms::table)
            .values(&new_user_room)
            .execute(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn create_workspace(&self, code: &str) -> Result<Workspace> {
        let new_workspace = NewWorkspace { code };

        diesel::insert_into(workspaces::table)
            .values(&new_workspace)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn add_user_workspace(
        &self,
        user_id: i32,
        workspace_id: i32,
        role: Role,
        screen_name: &str,
    ) -> Result<WorkspaceUser> {
        let new_user_workspace = NewWorkspaceUser {
            user_id,
            workspace_id,
            role: match role {
                Role::Member => "member",
                Role::Admin => "admin",
            },
            screen_name,
        };

        diesel::insert_into(workspace_users::table)
            .values(&new_user_workspace)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn create_workspace_invitation(
        &self,
        workspace_id: i32,
        token: &str,
    ) -> Result<WorkspaceInvitation> {
        let new_workspace_invitation = NewWorkspaceInvitation {
            workspace_id,
            token,
        };

        diesel::insert_into(workspace_invitations::table)
            .values(&new_workspace_invitation)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn delete_workspace_invitation(&self, id: i32) -> Result<WorkspaceInvitation> {
        diesel::update(workspace_invitations::dsl::workspace_invitations.find(id))
            .set(workspace_invitations::dsl::deleted_at.eq(Utc::now().naive_utc()))
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }
    pub fn remove_user_workspace(&self, user_id: i32, workspace_id: i32) -> Result<bool> {
        diesel::delete(
            workspace_users::dsl::workspace_users.filter(
                workspace_users::dsl::user_id
                    .eq(user_id)
                    .and(workspace_users::dsl::workspace_id.eq(workspace_id)),
            ),
        )
        .execute(&mut self.get_conn()?)
        .map(|c| c == 1)
        .map_err(err)
    }

    pub fn get_user(&self, id: i32) -> Result<User> {
        users::dsl::users
            .find(id)
            .first::<User>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_user_by_uid(&self, uid: &str) -> Result<User> {
        users::dsl::users
            .filter(users::dsl::uid.eq(uid))
            .first::<User>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_all_users(&self) -> Result<Vec<User>> {
        users::dsl::users
            .load::<User>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn count_messages(&self) -> Result<i64> {
        messages::dsl::messages
            .count()
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_message(&self, id: i32) -> Result<Message> {
        messages::dsl::messages
            .find(id)
            .first::<Message>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_messages_gt_id(&self, room_id: i32, id: i32, limit: i64) -> Result<Vec<Message>> {
        messages::dsl::messages
            .filter(messages::dsl::room_id.eq(room_id))
            .filter(messages::dsl::id.gt(id))
            .limit(limit)
            .get_results(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_messages_lt_id(&self, room_id: i32, id: i32, limit: i64) -> Result<Vec<Message>> {
        messages::dsl::messages
            .filter(messages::dsl::room_id.eq(room_id))
            .filter(messages::dsl::id.lt(id))
            .order(messages::dsl::id.desc())
            .limit(limit)
            .get_results(&mut self.get_conn()?)
            .map(|mut messages| {
                messages.reverse();
                messages
            })
            .map_err(err)
    }

    pub fn get_room(&self, id: i32) -> Result<Room> {
        rooms::dsl::rooms
            .find(id)
            .first::<Room>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_rooms_by_user_id(&self, user_id: i32) -> Result<Vec<Room>> {
        user_rooms::dsl::user_rooms
            .filter(user_rooms::dsl::user_id.eq(user_id))
            .inner_join(rooms::dsl::rooms)
            .select(rooms::all_columns)
            .get_results(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn find_user_room(&self, user_id: i32, room_id: i32) -> Result<bool> {
        user_rooms::dsl::user_rooms
            .filter(
                user_rooms::dsl::user_id
                    .eq(user_id)
                    .and(user_rooms::dsl::room_id.eq(room_id)),
            )
            .count()
            .get_result(&mut self.get_conn()?)
            .map(|count: i64| count == 1)
            .map_err(err)
    }

    pub fn get_workspace(&self, id: i32) -> Result<Workspace> {
        workspaces::dsl::workspaces
            .find(id)
            .first::<Workspace>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_workspaces_by_user_id(&self, user_id: i32) -> Result<Vec<WorkspaceUser>> {
        workspace_users::dsl::workspace_users
            .filter(workspace_users::dsl::user_id.eq(user_id))
            .get_results(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_users_by_workspace_id(&self, workspace_id: i32) -> Result<Vec<WorkspaceUser>> {
        workspace_users::dsl::workspace_users
            .filter(workspace_users::dsl::workspace_id.eq(workspace_id))
            .get_results(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_rooms_by_workspace_id(&self, workspace_id: i32) -> Result<Vec<Room>> {
        rooms::dsl::rooms
            .filter(rooms::dsl::workspace_id.eq(workspace_id))
            .get_results(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_role_to_workspace_by_uid(&self, uid: &str, workspace_id: i32) -> Result<String> {
        workspace_users::dsl::workspace_users
            .inner_join(users::dsl::users)
            .filter(
                workspace_users::dsl::workspace_id
                    .eq(workspace_id)
                    .and(users::dsl::uid.eq(uid)),
            )
            .select(workspace_users::dsl::role)
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_workspace_user(&self, workspace_user_id: i32) -> Result<WorkspaceUser> {
        workspace_users::dsl::workspace_users
            .find(workspace_user_id)
            .first::<WorkspaceUser>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn get_workspace_invitation_by_token(&self, token: &str) -> Result<WorkspaceInvitation> {
        workspace_invitations::dsl::workspace_invitations
            .filter(
                workspace_invitations::dsl::token
                    .eq(token)
                    .and(workspace_invitations::dsl::deleted_at.is_null()),
            )
            .get_result(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn update_user_profile(
        &self,
        workspace_user_id: i32,
        screen_name: &str,
    ) -> Result<WorkspaceUser> {
        diesel::update(workspace_users::dsl::workspace_users)
            .filter(workspace_users::dsl::id.eq(workspace_user_id))
            .set(workspace_users::dsl::screen_name.eq(screen_name))
            .execute(&mut self.get_conn()?)
            .map(|_| ())
            .map_err(err)?;
        workspace_users::dsl::workspace_users
            .find(workspace_user_id)
            .first::<WorkspaceUser>(&mut self.get_conn()?)
            .map_err(err)
    }

    pub fn upsert_user_status(
        &self,
        workspace_user_id: usize,
        user_status: UserStatus,
    ) -> Result<()> {
        let mut redis = self
            .redis
            .get_connection()
            .map_err(|e| Error::Other(e.to_string()))?;
        redis
            .set_ex::<String, String, ()>(
                format!("userStatus:{}", workspace_user_id),
                user_status.to_string(),
                60 * 10,
            )
            .map_err(|e| Error::Other(e.to_string()))?;
        Ok(())
    }

    pub fn get_user_status(&self, workspace_user_id: usize) -> Result<UserStatus> {
        let mut redis = self
            .redis
            .get_connection()
            .map_err(|e| Error::Other(e.to_string()))?;
        redis
            .get::<String, Option<String>>(format!("userStatus:{}", workspace_user_id))
            .map_err(|e| Error::Other(e.to_string()))
            .and_then(|s| match s {
                Some(s) => s.parse().map_err(|e| Error::Other(e)),
                None => Ok(UserStatus::Offline),
            })
    }
}

pub fn err(err: diesel::result::Error) -> Error {
    match err {
        diesel::result::Error::NotFound => Error::NotFound,
        _ => Error::Other(err.to_string()),
    }
}

#[test]
fn test() {
    let connection = super::db::new_pool().unwrap();
    let redis_client = Arc::new(
        redis::Client::open("redis://redis:6379/")
            .map_err(|x| x.to_string())
            .unwrap(),
    );
    let repository = Repository::new(connection, redis_client);
    repository.create_user("uid", "hello").unwrap();
    let results = repository.get_all_users().unwrap();

    println!("Displaying {} posts", results.len());
    for user in &results {
        println!("{}", user.id);
        println!("----------\n");
        println!("{}", user.name);
    }
    dbg!(results.len());
}
