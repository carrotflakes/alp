use crate::auth::{Authorize, UID};
use crate::paging::{MyPageInfo, PagingInput};
use crate::simple_broker::SimpleBroker;
use async_graphql::connection::{Connection, Edge, EmptyFields};
use async_graphql::{Context, Enum, Object, Result, Schema, Subscription, ID};
use futures::{lock::Mutex, Stream, StreamExt};
use slab::Slab;
use std::sync::Arc;
use std::time::Duration;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

#[derive(Clone)]
pub struct Message {
    id: ID,
    uid: String,
    text: String,
}

#[Object]
impl Message {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn uid(&self) -> &str {
        &self.uid
    }

    async fn text(&self) -> &str {
        &self.text
    }
}

#[derive(Clone)]
pub struct PagedMessages {
    page_info: MyPageInfo,
    messages: Vec<Message>,
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

#[derive(Default)]
pub struct Slabs {
    messages: Slab<Message>,
}

pub type Storage = Arc<Mutex<Slabs>>;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn all_messages(&self, ctx: &Context<'_>) -> Vec<Message> {
        let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;
        messages.iter().map(|(_, book)| book).cloned().collect()
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

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(&self, ctx: &Context<'_>, text: String) -> async_graphql::Result<ID> {
        let uid = varify_token(ctx)?;
        let messages = &mut ctx.data_unchecked::<Storage>().lock().await.messages;
        let entry = messages.vacant_entry();
        let id: ID = (entry.key() + 1).into();
        let message = Message {
            id: id.clone(),
            uid: uid.0.to_string(),
            text,
        };
        entry.insert(message);
        SimpleBroker::publish(MessageChanged {
            mutation_type: MutationType::Created,
            id: id.clone(),
        });
        Ok(id)
    }
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
enum MutationType {
    Created,
    Deleted,
}

#[derive(Clone)]
struct BookChanged {
    mutation_type: MutationType,
    id: ID,
}

#[derive(Clone)]
struct MessageChanged {
    mutation_type: MutationType,
    id: ID,
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

pub struct SubscriptionRoot;

#[Subscription]
impl SubscriptionRoot {
    async fn interval(&self, #[graphql(default = 1)] n: i32) -> impl Stream<Item = i32> {
        let mut value = 0;
        async_stream::stream! {
            loop {
                futures_timer::Delay::new(Duration::from_secs(1)).await;
                value += n;
                yield value;
            }
        }
    }

    async fn messages(
        &self,
        ctx: &Context<'_>,
        mutation_type: Option<MutationType>,
    ) -> async_graphql::Result<impl Stream<Item = MessageChanged>> {
        let uid = varify_token(ctx)?;
        println!("uid: {}", uid.0);

        Ok(
            SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
                let res = if let Some(mutation_type) = mutation_type {
                    event.mutation_type == mutation_type
                } else {
                    true
                };
                async move { res }
            }),
        )
    }
}

fn varify_token(ctx: &Context<'_>) -> Result<UID, async_graphql::Error> {
    let uid = if let Some(token) = ctx.data_opt::<MyToken>() {
        if token.0 == "dummy" {
            return Ok(UID("dummy".to_string()));
        }

        if token.0.starts_with("Bearer ") {
            match ctx
                .data_unchecked::<Authorize>()
                .varify(token.0.trim_start_matches("Bearer "))
            {
                Ok(Some(uid)) => uid,
                Ok(None) => return Err(async_graphql::Error::new(format!("token has not uid"))),
                Err(err) => {
                    return Err(async_graphql::Error::new(format!(
                        "token varify failed: {}",
                        err
                    )))
                }
            }
        } else {
            return Err(async_graphql::Error::new("token is invalid"));
        }
    } else {
        return Err(async_graphql::Error::new("token is required"));
    };
    Ok(uid)
}
