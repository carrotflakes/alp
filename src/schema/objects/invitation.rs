use crate::schema::{res, MyToken};

use super::{workspace::Workspace, Storage};
use async_graphql::{Context, Object, Result, ID};
use chrono::NaiveDateTime;

#[derive(Clone)]
pub struct WorkspaceInvitation {
    pub id: usize,
    pub workspace_id: usize,
    pub token: String,
    pub created_at: NaiveDateTime,
}

#[Object]
impl WorkspaceInvitation {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn token(&self) -> &str {
        &self.token
    }

    async fn workspace(&self, ctx: &Context<'_>) -> Result<Workspace> {
        let token = ctx.data_opt::<MyToken>().ok_or("token is required")?;
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        res(usecase.get_workspace(&token.0, self.workspace_id))
    }

    async fn created_at(&self) -> String {
        self.created_at.to_string()
    }
}

impl From<crate::domain::WorkspaceInvitation> for WorkspaceInvitation {
    fn from(wi: crate::domain::WorkspaceInvitation) -> Self {
        WorkspaceInvitation {
            id: wi.id,
            workspace_id: wi.workspace_id,
            token: wi.token,
            created_at: wi.created_at,
        }
    }
}
