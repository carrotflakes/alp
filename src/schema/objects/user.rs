use crate::schema::res;

use super::{room::Room, workspace_user::WorkspaceUser, Storage};
use async_graphql::{ComplexObject, Context, Result, SimpleObject, ID};

#[derive(Clone, SimpleObject)]
#[graphql(complex)]
pub struct User {
    #[graphql(skip)]
    pub id: usize,
    pub uid: String,
    pub name: String,
}

#[ComplexObject]
impl User {
    async fn id(&self) -> ID {
        ID(self.id.to_string())
    }

    async fn room(&self, ctx: &Context<'_>, id: ID) -> Result<Room> {
        let room_id = id.parse().unwrap();
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        if usecase
            .find_user_room(self.id, room_id)
            .map_err(|x| async_graphql::Error::new(x))?
        // TODO
        {
            res(usecase.get_room(room_id))
        } else {
            Err(format!("permission denied").into())
        }
    }

    async fn rooms(&self, ctx: &Context<'_>) -> Result<Vec<Room>> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_rooms_by_user_id(self.id)
            .map(|rooms| rooms.into_iter().map(|x| x.into()).collect())
            .map_err(|x| x.into())
    }

    async fn workspaces(&self, ctx: &Context<'_>) -> Result<Vec<WorkspaceUser>> {
        let usecase = &ctx.data_unchecked::<Storage>().usecase;
        usecase
            .get_workspaces_by_user_id(self.id)
            .map(|workspaces| workspaces.into_iter().map(WorkspaceUser::from).collect())
            .map_err(|x| x.into())
    }
}

impl From<crate::domain::User> for User {
    fn from(u: crate::domain::User) -> Self {
        User {
            id: u.id,
            uid: u.uid,
            name: u.name,
        }
    }
}
