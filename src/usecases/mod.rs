mod pagenation;

use std::sync::Arc;

use crate::{
    auth::{Authorize, UID},
    domain::{
        Message, MessageChanged, MutationType, Role, Room, User, UserStatus, Workspace,
        WorkspaceInvitation, WorkspaceUser,
    },
    repository::Repository,
    simple_broker::SimpleBroker,
};

use futures::{Stream, StreamExt};
use uuid::Uuid;
pub type Result<T> = std::result::Result<T, String>;

pub struct Usecase {
    pub authorize: Authorize,
    pub(crate) repository: Arc<Repository>,
}

impl Usecase {
    pub fn new(authorize: Authorize, repository: Arc<Repository>) -> Self {
        Self {
            authorize,
            repository,
        }
    }

    pub fn get_all_users(&self) -> Result<Vec<User>> {
        Ok(self
            .repository
            .get_all_users()
            .map_err(|x| x.to_string())?
            .into_iter()
            .map(user)
            .collect())
    }

    pub fn get_user(&self, id: usize) -> Result<User> {
        self.repository
            .get_user(id as i32)
            .map(user)
            .map_err(|x| x.to_string())
    }

    pub fn find_user_by_uid(&self, uid: &str) -> Result<Option<User>> {
        match self.repository.get_user_by_uid(uid).map(user) {
            Ok(user) => Ok(Some(user)),
            Err(crate::repository::Error::NotFound) => Ok(None),
            Err(e) => Err(e.to_string()),
        }
    }

    pub fn create_user(&self, uid: &str, name: &str) -> Result<User> {
        self.repository
            .create_user(uid, name)
            .map(user)
            .map_err(|x| x.to_string())
    }

    pub fn post_message(&self, uid: &str, room_id: usize, text: &str) -> Result<Message> {
        let user = self.find_user_by_uid(uid)?;
        if let Some(user) = user {
            self.add_message(user.id, room_id, text)
        } else {
            Err(format!("user not found"))
        }
    }

    pub fn add_message(&self, user_id: usize, room_id: usize, text: &str) -> Result<Message> {
        match self
            .repository
            .add_message(user_id as i32, room_id as i32, text)
        {
            Ok(m) => {
                SimpleBroker::publish(MessageChanged {
                    mutation_type: MutationType::Created,
                    id: m.id as usize,
                    room_id,
                });
                Ok(message(m))
            }
            Err(e) => Err(repo_err(e)),
        }
    }

    pub fn get_message(&self, id: usize) -> Result<Message> {
        self.repository
            .get_message(id as i32)
            .map(message)
            .map_err(|x| x.to_string())
    }

    pub fn get_messages(
        &self,
        room_id: usize,
        after: Option<String>,
        before: Option<String>,
        first: Option<usize>,
        last: Option<usize>,
    ) -> Result<(Vec<Message>, bool, bool)> {
        let (messages, has_prev, has_next) = pagenation::pagenation(
            &mut |id, limit| {
                self.repository
                    .get_messages_gt_id(room_id as i32, id, limit)
            },
            &mut |id, limit| {
                self.repository
                    .get_messages_lt_id(room_id as i32, id, limit)
            },
            after,
            before,
            first,
            last,
        )?;
        let messages = messages.into_iter().map(message).collect();
        Ok((messages, has_prev, has_next))
    }

    pub fn subscribe_messages(
        &self,
        mutation_type: Option<MutationType>,
        room_id: usize,
    ) -> impl Stream<Item = MessageChanged> {
        SimpleBroker::<MessageChanged>::subscribe().filter_map(move |event| {
            let res = match mutation_type {
                Some(mt) if mt != event.mutation_type => None,
                _ if room_id != event.room_id => None,
                _ => Some(event),
            };
            async move { res }
        })
    }

    pub fn subscribe_workspace_users_in_workspace(
        &self,
        uid: &str,
        workspace_id: usize,
    ) -> impl Stream<Item = WorkspaceUser> {
        //TODO
        SimpleBroker::<crate::subscribe::WorkspaceUserUpdate>::subscribe().filter_map(
            move |workspace_user_update| async move {
                if workspace_user_update.workspace_user.workspace_id != workspace_id {
                    None
                } else {
                    Some(workspace_user_update.workspace_user)
                }
            },
        )
    }

    pub fn get_room(&self, id: usize) -> Result<Room> {
        self.repository
            .get_room(id as i32)
            .map(room)
            .map_err(|x| x.to_string())
    }

    pub fn create_room(&self, uid: &str, workspace_id: usize, code: &str) -> Result<Room> {
        if let Some(user) = self.find_user_by_uid(uid)? {
            let room = self
                .repository
                .create_room(workspace_id as i32, code)
                .map(room)
                .map_err(|x| x.to_string())?;
            dbg!((user.id, room.id));
            self.repository
                .add_user_room(user.id as i32, room.id as i32)
                .map_err(|x| x.to_string())?;
            Ok(room)
        } else {
            Err(format!("permission denied"))
        }
    }

    pub fn get_rooms_by_user_id(&self, user_id: usize) -> Result<Vec<Room>> {
        self.repository
            .get_rooms_by_user_id(user_id as i32)
            .map(|rooms| rooms.into_iter().map(room).collect())
            .map_err(|x| x.to_string())
    }

    pub fn join_to_room(&self, user_id: usize, room_id: usize) -> Result<()> {
        self.repository
            .add_user_room(user_id as i32, room_id as i32)
            .map(|_| ())
            .map_err(|x| x.to_string())
    }

    pub fn join_to_workspace(
        &self,
        user_id: usize,
        workspace_id: usize,
        role: Role,
        screen_name: &str,
    ) -> Result<()> {
        self.repository
            .add_user_workspace(user_id as i32, workspace_id as i32, role, screen_name)
            .map(|_| ())
            .map_err(|x| x.to_string())
    }

    pub fn find_user_room(&self, user_id: usize, room_id: usize) -> Result<bool> {
        self.repository
            .find_user_room(user_id as i32, room_id as i32)
            .map_err(|x| x.to_string())
    }

    pub fn create_workspace(&self, uid: &str, code: &str) -> Result<Workspace> {
        if code.len() < 3 {
            return Err(format!("code is too short"));
        }

        if let Some(user) = self.find_user_by_uid(uid)? {
            let workspace = self
                .repository
                .create_workspace(code)
                .map(workspace)
                .map_err(|x| x.to_string())?;
            dbg!((user.id, workspace.id));
            self.repository
                .add_user_workspace(user.id as i32, workspace.id as i32, Role::Admin, &user.name)
                .map_err(|x| x.to_string())?;
            Ok(workspace)
        } else {
            Err(format!("permission denied"))
        }
    }

    pub fn get_workspace(&self, token: &str, workspace_id: usize) -> Result<Workspace> {
        let uid = self.varify_token(token)?;
        let _role = self
            .repository
            .get_role_to_workspace_by_uid(&uid.0, workspace_id as i32)
            .map_err(|x| x.to_string())?;
        self.repository
            .get_workspace(workspace_id as i32)
            .map(workspace)
            .map_err(|x| x.to_string())
    }

    pub fn get_workspaces_by_user_id(&self, user_id: usize) -> Result<Vec<WorkspaceUser>> {
        self.repository
            .get_workspaces_by_user_id(user_id as i32)
            .map(|workspaces| workspaces.into_iter().map(workspace_user).collect())
            .map_err(|x| x.to_string())
    }

    pub fn get_users_by_workspace_id(&self, workspace_id: usize) -> Result<Vec<WorkspaceUser>> {
        self.repository
            .get_users_by_workspace_id(workspace_id as i32)
            .map(|users| users.into_iter().map(workspace_user).collect())
            .map_err(|x| x.to_string())
    }

    pub fn get_rooms_by_workspace_id(&self, workspace_id: usize) -> Result<Vec<Room>> {
        self.repository
            .get_rooms_by_workspace_id(workspace_id as i32)
            .map(|rooms| rooms.into_iter().map(room).collect())
            .map_err(|x| x.to_string())
    }

    pub fn invite(&self, workspace_id: usize) -> Result<WorkspaceInvitation> {
        let token = Uuid::new_v4();
        self.repository
            .create_workspace_invitation(workspace_id as i32, &token.to_string())
            .map(workspace_invitation)
            .map_err(|x| x.to_string())
    }

    pub fn accept_invitation(&self, user_token: &str, token: &str) -> Result<WorkspaceUser> {
        let wi = self
            .repository
            .get_workspace_invitation_by_token(token)
            .map_err(|x| x.to_string())?;

        let uid = self.varify_token(user_token)?;
        self.repository
            .delete_workspace_invitation(wi.id)
            .map_err(|x| x.to_string())?;

        let user = self
            .repository
            .get_user_by_uid(&uid.0)
            .map_err(|x| x.to_string())?;

        self.repository
            .add_user_workspace(user.id, wi.workspace_id, Role::Member, &user.name)
            .map(workspace_user)
            .map_err(|x| x.to_string())
    }

    pub fn leave_from_workspace(&self, token: &str, workspace_id: usize) -> Result<bool> {
        let uid = self.varify_token(token)?;
        let user = self
            .repository
            .get_user_by_uid(&uid.0)
            .map_err(|x| x.to_string())?;
        self.repository
            .remove_user_workspace(user.id as i32, workspace_id as i32)
            .map_err(|x| x.to_string())
    }

    pub fn update_user_profile(
        &self,
        token: &str,
        workspace_user_id: usize,
        screen_name: &str,
    ) -> Result<WorkspaceUser> {
        let _uid = self.varify_token(token)?;
        self.repository
            .update_user_profile(workspace_user_id as i32, screen_name)
            .map(workspace_user)
            .map_err(|x| x.to_string())
    }

    pub fn update_user_status(
        &self,
        token: &str,
        workspace_user_id: usize,
        user_status: UserStatus,
    ) -> Result<()> {
        let uid = self.varify_token(token)?;
        self.repository
            .upsert_user_status(workspace_user_id, user_status)
            .map_err(|x| x.to_string())
    }

    pub fn varify_token(&self, token: &str) -> Result<UID> {
        if token == "dummy" {
            return Ok(UID("dummy".to_string()));
        }

        if token.starts_with("Bearer ") {
            return match self.authorize.varify(token.trim_start_matches("Bearer ")) {
                Ok(Some(uid)) => Ok(uid),
                Ok(None) => Err(format!("token has not uid")),
                Err(err) => Err(format!("token varify failed: {}", err)),
            };
        }
        return Err(format!("token is required"));
    }
}

pub fn user(user: crate::repository::User) -> User {
    User {
        id: user.id as usize,
        uid: user.uid,
        name: user.name,
    }
}

pub fn message(message: crate::repository::Message) -> Message {
    Message {
        id: message.id as usize,
        user_id: message.user_id as usize,
        room_id: message.room_id as usize,
        text: message.text,
        created_at: message.created_at,
    }
}

pub fn room(room: crate::repository::Room) -> Room {
    Room {
        id: room.id as usize,
        code: room.code,
        workspace_id: room.workspace_id as usize,
    }
}

pub fn workspace(workspace: crate::repository::Workspace) -> Workspace {
    Workspace {
        id: workspace.id as usize,
        code: workspace.code,
        created_at: workspace.created_at,
    }
}

pub fn workspace_invitation(
    workspace_invitation: crate::repository::WorkspaceInvitation,
) -> WorkspaceInvitation {
    WorkspaceInvitation {
        id: workspace_invitation.id as usize,
        workspace_id: workspace_invitation.workspace_id as usize,
        token: workspace_invitation.token,
        created_at: workspace_invitation.created_at,
        deleted_at: workspace_invitation.deleted_at,
    }
}

pub fn workspace_user(workspace_user: crate::repository::WorkspaceUser) -> WorkspaceUser {
    WorkspaceUser {
        id: workspace_user.id as usize,
        workspace_id: workspace_user.workspace_id as usize,
        user_id: workspace_user.user_id as usize,
        role: role(&workspace_user.role),
        screen_name: workspace_user.screen_name,
    }
}

pub fn role(role: &str) -> Role {
    match role {
        "member" => Role::Member,
        "admin" => Role::Admin,
        _ => panic!("invalid role value: {}", role),
    }
}

pub fn repo_err(err: crate::repository::Error) -> String {
    err.to_string()
}
