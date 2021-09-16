use crate::schema::Storage;
use async_graphql::{Context, Object, ID};

use super::{
    get_context,
    objects::{message::Message, room::Room, user::User},
    res,
};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(
        &self,
        ctx: &Context<'_>,
        room_id: ID,
        text: String,
    ) -> async_graphql::Result<Message> {
        let room_id = room_id.parse().unwrap();
        let uctx = get_context(ctx);
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&uctx)?;

        res(usecase.post_message(uid.0.as_str(), room_id, &text))
    }

    async fn create_user(&self, ctx: &Context<'_>, name: String) -> async_graphql::Result<User> {
        let uctx = get_context(ctx);
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&uctx)?;
        res(usecase.create_user(uid.0.as_str(), &name))
    }

    async fn create_room(&self, ctx: &Context<'_>, code: String) -> async_graphql::Result<Room> {
        let uctx = get_context(ctx);
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&uctx)?;
        res(usecase.create_room(uid.0.as_str(), &code))
    }

    async fn join_to_room(
        &self,
        ctx: &Context<'_>,
        user_id: ID,
        room_id: ID,
    ) -> async_graphql::Result<bool> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .join_to_room(user_id.parse().unwrap(), room_id.parse().unwrap())
            .map(|_| true)
            .map_err(|x| x.into())
    }
}
