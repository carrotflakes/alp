use crate::schema::Storage;
use async_graphql::{Context, InputObject, Object, Result, ID};

use super::{
    objects::{
        invitation::WorkspaceInvitation,
        message::Message,
        role::Role,
        room::Room,
        user::User,
        workspace::Workspace,
        workspace_user::{UserStatus, WorkspaceUser},
    },
    res, MyToken,
};

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn post_message(&self, ctx: &Context<'_>, room_id: ID, text: String) -> Result<Message> {
        let room_id = room_id.parse().unwrap();
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&token.0)?;

        res(usecase.post_message(uid.0.as_str(), room_id, &text))
    }

    async fn create_user(&self, ctx: &Context<'_>, name: String) -> Result<User> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&token.0)?;
        res(usecase.create_user(uid.0.as_str(), &name))
    }

    async fn create_room(&self, ctx: &Context<'_>, workspace_id: ID, code: String) -> Result<Room> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&token.0)?;
        res(usecase.create_room(uid.0.as_str(), workspace_id.parse().unwrap(), &code))
    }

    async fn join_to_room(&self, ctx: &Context<'_>, user_id: ID, room_id: ID) -> Result<bool> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .join_to_room(user_id.parse().unwrap(), room_id.parse().unwrap())
            .map(|_| true)
            .map_err(|x| x.into())
    }

    async fn join_to_workspace(
        &self,
        ctx: &Context<'_>,
        user_id: ID,
        workspace_id: ID,
        role: Role,
        screen_name: String,
    ) -> Result<bool> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .join_to_workspace(
                user_id.parse().unwrap(),
                workspace_id.parse().unwrap(),
                role.into(),
                &screen_name,
            )
            .map(|_| true)
            .map_err(|x| x.into())
    }

    async fn leave_from_workspace(&self, ctx: &Context<'_>, workspace_id: ID) -> Result<bool> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .leave_from_workspace(&token.0, workspace_id.parse().unwrap())
            .and_then(|x| if x { Ok(true) } else { Err("not found".into()) })
            .map_err(|x| x.into())
    }

    async fn create_workspace(&self, ctx: &Context<'_>, code: String) -> Result<Workspace> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        let uid = usecase.varify_token(&token.0)?;
        res(usecase.create_workspace(uid.0.as_str(), &code))
    }

    async fn invite(&self, ctx: &Context<'_>, workspace_id: ID) -> Result<WorkspaceInvitation> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.invite(workspace_id.parse().unwrap()))
    }

    async fn accept_invitation(&self, ctx: &Context<'_>, token: String) -> Result<WorkspaceUser> {
        let user_token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.accept_invitation(&user_token.0, &token))
    }

    async fn update_user_profile(
        &self,
        ctx: &Context<'_>,
        workspace_user_id: ID,
        profile: UpdateUserProfile,
    ) -> Result<WorkspaceUser> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let workspace_user_id = workspace_user_id.parse().unwrap();
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.update_user_profile(&token.0, workspace_user_id, &profile.screen_name))
    }

    async fn update_user_status(
        &self,
        ctx: &Context<'_>,
        workspace_user_id: ID,
        user_status: UserStatus,
    ) -> Result<bool> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let workspace_user_id = workspace_user_id.parse().unwrap();
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase
            .update_user_status(&token.0, workspace_user_id, user_status.into())
            .map(|_| true))
    }
}

#[derive(InputObject)]
pub struct UpdateUserProfile {
    screen_name: String,
}
