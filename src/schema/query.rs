use super::objects::{Message, PagedMessages, User};
use super::paging::{MyPageInfo, PagingInput};
use crate::schema::{varify_token, MyToken, Storage};
use async_graphql::connection::{Connection, Edge, EmptyFields};
use async_graphql::{Context, Object, Result};

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn all_messages(&self, ctx: &Context<'_>) -> Vec<Message> {
        let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;
        messages.iter().map(|(_, book)| book).cloned().collect()
    }

    async fn all_users(&self, ctx: &Context<'_>) -> Vec<User> {
        let users = &ctx.data_unchecked::<Storage>().lock().await.users;
        users.iter().map(|(_, user)| user).cloned().collect()
    }

    async fn messages_old(
        &self,
        ctx: &Context<'_>,
        paging: PagingInput,
    ) -> async_graphql::Result<PagedMessages> {
        let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;

        let (asc, limit, id) = match (&paging.first, &paging.last) {
            (None, None) => {
                return Err(format!("'first' or 'last' required in PagingInput").into());
            }
            (Some(_), Some(_)) => {
                return Err(format!("cannot specify 'first' and 'last' same time").into());
            }
            (Some(limit), None) => (true, *limit, paging.after),
            (None, Some(limit)) => (false, *limit, paging.before),
        };

        if limit < 1 {
            return Err("invalid limit".into());
        }
        let limit = limit.min(20) as usize;

        let id = id
            .map(|x| x.parse().unwrap())
            .unwrap_or(if asc { 0 } else { usize::MAX });

        let (messages, has_prev, has_next): (Vec<_>, _, _) = if asc {
            let i = messages
                .iter()
                .position(|x| x.1.id.parse::<usize>().unwrap() > id)
                .unwrap_or(messages.len());
            (
                messages
                    .iter()
                    .skip(i)
                    .take(limit)
                    .map(|x| x.1)
                    .cloned()
                    .collect(),
                0 < i,
                i + limit < messages.len(),
            )
        } else {
            let i = messages
                .iter()
                .position(|x| x.1.id.parse::<usize>().unwrap() >= id)
                .unwrap_or(messages.len());
            let s = i.saturating_sub(limit);
            (
                messages
                    .iter()
                    .skip(s)
                    .take(i - s)
                    .map(|x| x.1)
                    .cloned()
                    .collect(),
                0 < s,
                i < messages.len(),
            )
        };
        let start_cursor = messages.first().map(|s| s.id.clone()).unwrap_or(id.into());
        let end_cursor = messages.last().map(|s| s.id.clone()).unwrap_or(id.into());

        Ok(PagedMessages {
            page_info: MyPageInfo {
                start_cursor,
                end_cursor,
                has_prev,
                has_next,
            },
            messages,
        })
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
                let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;

                let (asc, limit, id) = match (first, last) {
                    (None, None) => {
                        return Err(format!("'first' or 'last' required in PagingInput").into());
                    }
                    (Some(_), Some(_)) => {
                        return Err(format!("cannot specify 'first' and 'last' same time").into());
                    }
                    (Some(limit), None) => (true, limit, after),
                    (None, Some(limit)) => (false, limit, before),
                };

                if limit < 1 {
                    return Err("invalid limit".into());
                }
                let limit = limit.min(20) as usize;

                let id = id
                    .map(|x| x.parse().unwrap())
                    .unwrap_or(if asc { 0 } else { usize::MAX });

                let (messages, has_prev, has_next): (Vec<_>, _, _) = if asc {
                    let i = messages
                        .iter()
                        .position(|x| x.1.id.parse::<usize>().unwrap() > id)
                        .unwrap_or(messages.len());
                    (
                        messages
                            .iter()
                            .skip(i)
                            .take(limit)
                            .map(|x| x.1)
                            .cloned()
                            .collect(),
                        0 < i,
                        i + limit < messages.len(),
                    )
                } else {
                    let i = messages
                        .iter()
                        .position(|x| x.1.id.parse::<usize>().unwrap() >= id)
                        .unwrap_or(messages.len());
                    let s = i.saturating_sub(limit);
                    (
                        messages
                            .iter()
                            .skip(s)
                            .take(i - s)
                            .map(|x| x.1)
                            .cloned()
                            .collect(),
                        0 < s,
                        i < messages.len(),
                    )
                };
                // let start_cursor = messages.first().map(|s| s.id.clone()).unwrap_or(id.into());
                // let end_cursor = messages.last().map(|s| s.id.clone()).unwrap_or(id.into());
                let mut connection = Connection::new(has_prev, has_next);
                connection.append(messages.into_iter().map(|m: Message| {
                    Edge::with_additional_fields(m.id.to_string(), m, EmptyFields)
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
        let slabs = &mut ctx.data_unchecked::<Storage>().lock().await;
        if let Some(user) = slabs
            .users
            .iter()
            .find(|x| x.1.uid == uid.0)
            .map(|x| x.1.clone())
        {
            Ok(user)
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
