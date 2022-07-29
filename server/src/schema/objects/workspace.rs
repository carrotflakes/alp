use super::{room::Room, workspace_user::WorkspaceUser, Storage};
use async_graphql::{ComplexObject, Context, Result, SimpleObject, ID};
use chrono::NaiveDateTime;

#[derive(Clone, SimpleObject)]
#[graphql(complex)]
pub struct Workspace {
    #[graphql(skip)]
    pub id: usize,
    pub code: String,
    #[graphql(skip)]
    pub created_at: NaiveDateTime,
}

#[ComplexObject]
impl Workspace {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn rooms(&self, ctx: &Context<'_>) -> Result<Vec<Room>> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_rooms_by_workspace_id(self.id)
            .map(|rooms| rooms.into_iter().map(|x| x.into()).collect())
            .map_err(|x| x.into())
    }

    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<WorkspaceUser>> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_users_by_workspace_id(self.id)
            .map(|users| users.into_iter().map(WorkspaceUser::from).collect())
            .map_err(|x| x.into())
    }

    async fn created_at(&self) -> String {
        self.created_at.to_string()
    }
}

impl From<crate::domain::Workspace> for Workspace {
    fn from(w: crate::domain::Workspace) -> Self {
        Workspace {
            id: w.id,
            code: w.code,
            created_at: w.created_at,
        }
    }
}
