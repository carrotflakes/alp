use super::Storage;
use async_graphql::{ComplexObject, Context, Enum, Object, Result, SimpleObject, ID};
use chrono::NaiveDateTime;

#[derive(Clone, SimpleObject)]
#[graphql(complex)]
pub struct User {
    #[graphql(skip)]
    pub id: usize,
    pub uid: String,
    pub name: String,
}

#[ComplexObject]
impl User {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }
}

impl From<crate::domain::User> for User {
    fn from(u: crate::domain::User) -> Self {
        User {
            id: u.id,
            uid: u.uid,
            name: u.name,
        }
    }
}

#[derive(Clone)]
pub struct Message {
    pub id: usize,
    pub text: String,
    pub user_id: usize,
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
        usecase
            .get_user(self.user_id)
            .map(|user| user.into())
            .map_err(|x| x.into())
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
            created_at: u.created_at,
        }
    }
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Deleted,
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
        usecase
            .get_message(self.id)
            .map(|message| message.into())
            .map_err(|x| x.into())
    }
}
