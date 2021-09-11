use super::{paging::MyPageInfo, Storage};
use async_graphql::{Context, Enum, Object, Result, SimpleObject, ID};

#[derive(Clone, SimpleObject)]
pub struct User {
    pub id: usize,
    pub uid: String,
    pub name: String,
}

#[derive(Clone)]
pub struct Message {
    pub id: ID,
    pub text: String,
    pub user_id: usize,
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

    async fn user(&self, ctx: &Context<'_>) -> Result<User> {
        let usecase = &ctx.data_unchecked::<Storage>().lock().await.usecase;

        let user = usecase.get_user(self.user_id).map_err(|x| x)?;
        Ok(User {
            id: user.id.into(),
            uid: user.uid,
            name: user.name,
        })
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
