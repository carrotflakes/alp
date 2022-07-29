use crate::schema::res;

use super::{room::Room, user::User, MutationType, Storage};
use async_graphql::{Context, Object, Result, ID};
use chrono::NaiveDateTime;

#[derive(Clone)]
pub struct Message {
    pub id: usize,
    pub text: String,
    pub user_id: usize,
    pub room_id: usize,
    pub created_at: NaiveDateTime,
}

#[Object]
impl Message {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn text(&self) -> &str {
        &self.text
    }

    async fn user(&self, ctx: &Context<'_>) -> Result<User> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.get_user(self.user_id))
    }

    async fn room(&self, ctx: &Context<'_>) -> Result<Room> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.get_room(self.room_id))
    }

    async fn created_at(&self) -> String {
        self.created_at.to_string()
    }
}

impl From<crate::domain::Message> for Message {
    fn from(u: crate::domain::Message) -> Self {
        Message {
            id: u.id,
            text: u.text,
            user_id: u.user_id,
            room_id: u.room_id,
            created_at: u.created_at,
        }
    }
}

#[derive(Clone)]
pub struct MessageChanged {
    pub mutation_type: MutationType,
    pub id: usize,
}

#[Object]
impl MessageChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn message(&self, ctx: &Context<'_>) -> Result<Message> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.get_message(self.id))
    }
}
