use super::{paging::MyPageInfo, Storage};
use async_graphql::{Context, Enum, Object, Result, SimpleObject, ID};

#[derive(Clone, SimpleObject)]
pub struct User {
    pub id: ID,
    pub uid: String,
    pub name: String,
}

#[derive(Clone)]
pub struct Message {
    pub id: ID,
    pub text: String,
    pub user_id: ID,
    pub created_at: String,
}

#[Object]
impl Message {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn text(&self) -> &str {
        &self.text
    }

    async fn user(&self, ctx: &Context<'_>) -> User {
        let users = &ctx.data_unchecked::<Storage>().lock().await.users;
        users
            .iter()
            .find(|x| x.1.id == self.user_id)
            .unwrap()
            .1
            .clone()
    }

    async fn created_at(&self) -> &str {
        &self.created_at
    }
}

#[derive(Clone)]
pub struct PagedMessages {
    pub page_info: MyPageInfo,
    pub messages: Vec<Message>,
}

#[Object]
impl PagedMessages {
    async fn page_info(&self) -> &MyPageInfo {
        &self.page_info
    }

    async fn messages(&self) -> &Vec<Message> {
        &self.messages
    }
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Deleted,
}

#[derive(Clone)]
pub struct BookChanged {
    mutation_type: MutationType,
    id: ID,
}

#[derive(Clone)]
pub struct MessageChanged {
    pub mutation_type: MutationType,
    pub id: ID,
}

#[Object]
impl MessageChanged {
    async fn mutation_type(&self) -> MutationType {
        self.mutation_type
    }

    async fn id(&self) -> &ID {
        &self.id
    }

    async fn message(&self, ctx: &Context<'_>) -> Result<Option<Message>> {
        let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;
        let id = self.id.parse::<usize>()? - 1;
        Ok(messages.get(id).cloned())
    }
}
