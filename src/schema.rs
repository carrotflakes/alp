use crate::simple_broker::SimpleBroker;
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
    text: String,
}

#[Object]
impl Message {
    async fn id(&self) -> &str {
        &self.id
    }

    async fn text(&self) -> &str {
        &self.text
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
    async fn messages(&self, ctx: &Context<'_>) -> Vec<Message> {
        let messages = &ctx.data_unchecked::<Storage>().lock().await.messages;
        messages.iter().map(|(_, book)| book).cloned().collect()
    }

    async fn session(&self, ctx: &Context<'_>) -> Option<String> {
        ctx.data_opt::<MyToken>().map(|token| token.0.to_string())
    }
}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(&self, ctx: &Context<'_>, text: String) -> ID {
        let messages = &mut ctx.data_unchecked::<Storage>().lock().await.messages;
        let entry = messages.vacant_entry();
        let id: ID = entry.key().into();
        let message = Message {
            id: id.clone(),
            text,
        };
        entry.insert(message);
        SimpleBroker::publish(MessageChanged {
            mutation_type: MutationType::Created,
            id: id.clone(),
        });
        id
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
        let id = self.id.parse::<usize>()?;
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
        if let None = ctx.data_opt::<MyToken>() {
            return Err(async_graphql::Error::new("token is required!"));
        }

        Ok(SimpleBroker::<MessageChanged>::subscribe().filter(move |event| {
            let res = if let Some(mutation_type) = mutation_type {
                event.mutation_type == mutation_type
            } else {
                true
            };
            async move { res }
        }))
    }
}
