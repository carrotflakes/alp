use super::{
    objects::{message::MessageChanged, MutationType},
    Storage,
};
use crate::schema::varify_token;
use async_graphql::{Context, Subscription, ID};
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
        room_id: ID,
    ) -> async_graphql::Result<impl Stream<Item = MessageChanged>> {
        let room_id = room_id.parse().unwrap();
        let _uid = varify_token(ctx)?;

        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let mutation_type = match mutation_type {
            Some(MutationType::Created) => Some(crate::domain::MutationType::Created),
            Some(MutationType::Deleted) => Some(crate::domain::MutationType::Deleted),
            None => None,
        };

        Ok(usecase
            .subscribe_messages(mutation_type, room_id)
            .map(|event| MessageChanged {
                mutation_type: match event.mutation_type {
                    crate::domain::MutationType::Created => MutationType::Created,
                    crate::domain::MutationType::Deleted => MutationType::Deleted,
                },
                id: event.id.into(),
            }))
    }
}
