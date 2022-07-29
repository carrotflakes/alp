use crate::schema::{MyToken, Storage};

use super::{role::Role, user::User, workspace::Workspace};
use async_graphql::{ComplexObject, Context, Enum, Result, SimpleObject, ID};

#[derive(Clone, SimpleObject)]
#[graphql(complex)]
pub struct WorkspaceUser {
    #[graphql(skip)]
    pub id: usize,
    #[graphql(skip)]
    pub workspace_id: usize,
    #[graphql(skip)]
    pub user_id: usize,
    pub role: Role,
    pub screen_name: String,
}

#[ComplexObject]
impl WorkspaceUser {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn workspace_id(&self) -> ID {
        ID(self.workspace_id.to_string())
    }

    async fn user_id(&self) -> ID {
        ID(self.user_id.to_string())
    }

    async fn workspace(&self, ctx: &Context<'_>) -> Result<Workspace> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_workspace(&token.0, self.workspace_id)
            .map(Workspace::from)
            .map_err(|x| x.into())
    }

    async fn user(&self, ctx: &Context<'_>) -> Result<User> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_user(self.user_id)
            .map(User::from)
            .map_err(|x| x.into())
    }

    async fn status(&self, ctx: &Context<'_>) -> Result<UserStatus> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .repository
            .get_user_status(self.id)
            .map(|status| match status {
                crate::domain::UserStatus::Online => UserStatus::Online,
                crate::domain::UserStatus::Offline => UserStatus::Offline,
            })
            .map_err(|x| x.to_string().into())
    }
}

impl From<crate::domain::WorkspaceUser> for WorkspaceUser {
    fn from(wu: crate::domain::WorkspaceUser) -> Self {
        WorkspaceUser {
            id: wu.id,
            workspace_id: wu.workspace_id,
            user_id: wu.user_id,
            role: wu.role.into(),
            screen_name: wu.screen_name,
        }
    }
}

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum UserStatus {
    Online,
    Offline,
}

impl From<crate::domain::UserStatus> for UserStatus {
    fn from(u: crate::domain::UserStatus) -> Self {
        match u {
            crate::domain::UserStatus::Online => UserStatus::Online,
            crate::domain::UserStatus::Offline => UserStatus::Offline,
        }
    }
}

impl Into<crate::domain::UserStatus> for UserStatus {
    fn into(self) -> crate::domain::UserStatus {
        match self {
            UserStatus::Online => crate::domain::UserStatus::Online,
            UserStatus::Offline => crate::domain::UserStatus::Offline,
        }
    }
}
