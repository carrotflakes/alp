use crate::schema::objects::workspace_user::WorkspaceUser;

use super::{
    objects::{message::MessageChanged, MutationType},
    MyToken, Storage,
};
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
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let _uid = usecase.varify_token(&token.0)?;

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

    async fn users_in_workspace(
        &self,
        ctx: &Context<'_>,
        workspace_id: ID,
    ) -> async_graphql::Result<impl Stream<Item = WorkspaceUser>> {
        let workspace_id = workspace_id.parse().unwrap();
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&token.0)?;

        Ok(usecase
            .subscribe_workspace_users_in_workspace(&uid.0, workspace_id)
            .map(|workspace_user| workspace_user.into()))
    }
}
