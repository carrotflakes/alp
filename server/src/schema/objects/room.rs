use super::{message::Message, Storage};
use async_graphql::{
    connection::{Connection, Edge, EmptyFields},
    ComplexObject, Context, Result, SimpleObject, ID,
};

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
                connection.edges.extend(messages.into_iter().map(|message| {
                    let message: Message = message.into();
                    Edge::with_additional_fields(message.id.to_string(), message, EmptyFields)
                }));
                Ok::<_, async_graphql::Error>(connection)
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
