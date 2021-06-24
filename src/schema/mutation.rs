use super::objects::{Message, MessageChanged, MutationType, User};
use crate::schema::{varify_token, Storage};
use crate::simple_broker::SimpleBroker;
use async_graphql::{Context, Object, ID};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(&self, ctx: &Context<'_>, text: String) -> async_graphql::Result<Message> {
        let uid = varify_token(ctx)?;
        let slabs = &mut ctx.data_unchecked::<Storage>().lock().await;

        let user = slabs
            .users
            .iter()
            .find(|x| x.1.uid == uid.0)
            .map(|x| x.1.clone());
        if let Some(user) = user {
            let entry = slabs.messages.vacant_entry();
            let id: ID = (entry.key() + 1).into();
            let message = Message {
                id: id.clone(),
                text,
                user_id: user.id.clone(),
                created_at: chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%z").to_string(),
            };
            entry.insert(message.clone());
            SimpleBroker::publish(MessageChanged {
                mutation_type: MutationType::Created,
                id: id.clone(),
            });
            Ok(message)
        } else {
            Err(format!("user not found").into())
        }
    }

    async fn create_user(&self, ctx: &Context<'_>, name: String) -> async_graphql::Result<User> {
        let uid = varify_token(ctx)?;
        let mut slabs = ctx.data_unchecked::<Storage>().lock().await;

        if let Some(_) = slabs.users.iter().find(|x| x.1.uid == uid.0) {
            Err(format!("user already exist").into())
        } else {
            let entry = slabs.users.vacant_entry();
            let id: ID = (entry.key() + 1).into();
            let user = User {
                id: id.clone(),
                uid: uid.0.to_string(),
                name,
            };
            entry.insert(user.clone());
            Ok(user)
        }
    }
}
