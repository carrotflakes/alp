use super::objects::{Message, User};
use crate::schema::{varify_token, Storage};
use async_graphql::{Context, Object};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(
        &self,
        ctx: &Context<'_>,
        text: String,
    ) -> async_graphql::Result<Message> {
        let uid = varify_token(ctx)?;

        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .post_message(uid.0.as_str(), 1, &text) // TODO
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
}
