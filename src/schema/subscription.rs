use super::objects::{MessageChanged, MutationType};
use crate::schema::varify_token;
use crate::simple_broker::SimpleBroker;
use async_graphql::{Context, Subscription};
use futures::{Stream, StreamExt};
use std::time::Duration;

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
