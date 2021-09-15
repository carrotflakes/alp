use super::Storage;
use async_graphql::{
    connection::{Connection, Edge, EmptyFields},
    ComplexObject, Context, Enum, Object, Result, SimpleObject, ID,
};
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

    async fn room(&self, ctx: &Context<'_>, id: ID) -> Result<Room> {
        let room_id = id.parse().unwrap();
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        if usecase
            .find_user_room(self.id, room_id)
            .map_err(|x| async_graphql::Error::new(x))?
        // TODO
        {
            usecase
                .get_room(room_id)
                .map(|room| Room::from(room))
                .map_err(|x| x.into())
        } else {
            Err(format!("permission denied").into())
        }
    }

    async fn rooms(&self, ctx: &Context<'_>) -> Result<Vec<Room>> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_rooms_by_user_id(self.id)
            .map(|rooms| rooms.into_iter().map(|x| x.into()).collect())
            .map_err(|x| x.into())
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
        usecase
            .get_user(self.user_id)
            .map(|user| user.into())
            .map_err(|x| x.into())
    }

    async fn room(&self, ctx: &Context<'_>) -> Result<Room> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_room(self.room_id)
            .map(|room| room.into())
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
            room_id: u.room_id,
            created_at: u.created_at,
        }
    }
}

#[derive(Clone, SimpleObject)]
#[graphql(complex)]
pub struct Room {
    #[graphql(skip)]
    pub id: usize,
    pub code: String,
}

#[ComplexObject]
impl Room {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn messages(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<String, Message, EmptyFields, EmptyFields>> {
        let room_id = self.id;
        async_graphql::connection::query(
            after,
            before,
            first,
            last,
            |after: Option<String>, before, first, last| async move {
                let usecase = &ctx.data_unchecked::<Storage>().usecase;
                let (messages, has_prev, has_next) =
                    usecase.get_messages(room_id, after, before, first, last)?;
                let mut connection = Connection::new(has_prev, has_next);
                connection.append(messages.into_iter().map(|message| {
                    let message: Message = message.into();
                    Edge::with_additional_fields(message.id.to_string(), message, EmptyFields)
                }));
                Ok(connection)
            },
        )
        .await
    }
}

impl From<crate::domain::Room> for Room {
    fn from(u: crate::domain::Room) -> Self {
        Room {
            id: u.id,
            code: u.code,
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
