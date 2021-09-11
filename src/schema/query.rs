use super::objects::{Message, User};
use crate::schema::{varify_token, MyToken, Storage};
use async_graphql::connection::{Connection, Edge, EmptyFields};
use async_graphql::{Context, Object, Result};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn all_users(&self, ctx: &Context<'_>) -> Result<Vec<User>> {
        let storage = &ctx.data_unchecked::<Storage>();
        let users = storage.usecase.get_all_users().map_err(|x| x)?;
        Ok(users
            .into_iter()
            .map(|x| User {
                id: x.id.into(),
                uid: x.uid,
                name: x.name,
            })
            .collect())
    }

    async fn messages(
        &self,
        ctx: &Context<'_>,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<String, Message, EmptyFields, EmptyFields>> {
        async_graphql::connection::query(
            after,
            before,
            first,
            last,
            |after: Option<String>, before, first, last| async move {
                let usecase = &ctx.data_unchecked::<Storage>().usecase;
                let (messages, has_prev, has_next) =
                    usecase.get_messages(after, before, first, last)?;
                let mut connection = Connection::new(has_prev, has_next);
                connection.append(messages.into_iter().map(|m| {
                    let message = Message {
                        id: m.id,
                        text: m.text,
                        user_id: m.user_id,
                        created_at: m.created_at,
                    };
                    Edge::with_additional_fields(m.id.to_string(), message, EmptyFields)
                }));
                Ok(connection)
            },
        )
        .await
    }

    async fn session(&self, ctx: &Context<'_>) -> Option<String> {
        ctx.data_opt::<MyToken>().map(|token| token.0.to_string())
    }

    async fn me(&self, ctx: &Context<'_>) -> Result<User> {
        let uid = varify_token(ctx)?;

        let storage = &ctx.data_unchecked::<Storage>();
        let user = storage.usecase.find_user_by_uid(uid.0.as_str())?;
        if let Some(user) = user {
            Ok(User {
                id: user.id.into(),
                uid: user.uid,
                name: user.name,
            })
        } else {
            Err(format!("user not found").into())
        }
    }

    async fn numbers(
        &self,
        after: Option<String>,
        before: Option<String>,
        first: Option<i32>,
        last: Option<i32>,
    ) -> Result<Connection<usize, i32, EmptyFields, EmptyFields>> {
        async_graphql::connection::query(
            after,
            before,
            first,
            last,
            |after, before, first, last| async move {
                let mut start = after.map(|after| after + 1).unwrap_or(0);
                let mut end = before.unwrap_or(10000);
                if let Some(first) = first {
                    end = (start + first).min(end);
                }
                if let Some(last) = last {
                    start = if last > end - start { end } else { end - last };
                }
                let mut connection = Connection::new(start > 0, end < 10000);
                connection.append(
                    (start..end)
                        .into_iter()
                        .map(|n| Edge::with_additional_fields(n, n as i32, EmptyFields)),
                );
                Ok(connection)
            },
        )
        .await
    }
}
