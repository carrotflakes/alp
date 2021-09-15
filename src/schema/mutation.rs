use super::objects::{Message, Room, User};
use crate::schema::{varify_token, Storage};
use async_graphql::{Context, Object, ID};

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
        let uid = varify_token(ctx)?;

        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .post_message(uid.0.as_str(), room_id, &text)
            .map(|message| message.into())
            .map_err(|x| x.into())
    }

    async fn create_user(&self, ctx: &Context<'_>, name: String) -> async_graphql::Result<User> {
        let uid = varify_token(ctx)?;

        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .create_user(uid.0.as_str(), &name)
            .map(|user| user.into())
            .map_err(|x| x.into())
    }

    async fn create_room(&self, ctx: &Context<'_>, code: String) -> async_graphql::Result<Room> {
        let uid = varify_token(ctx)?;

        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .create_room(uid.0.as_str(), &code)
            .map(|room| room.into())
            .map_err(|x| x.into())
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
