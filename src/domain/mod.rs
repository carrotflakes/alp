use chrono::NaiveDateTime;

pub type DateTime = NaiveDateTime;

pub struct User {
    pub id: usize,
    pub uid: String,
    pub name: String,
}

pub struct Message {
    pub id: usize,
    pub user_id: usize,
    pub room_id: usize,
    pub text: String,
    pub created_at: DateTime,
}

pub struct Room {
    pub id: usize,
    pub code: String,
    pub workspace_id: usize,
}

pub struct Workspace {
    pub id: usize,
    pub code: String,
    pub created_at: DateTime,
}

pub struct WorkspaceUser {
    pub id: usize,
    pub workspace_id: usize,
    pub user_id: usize,
    pub role: Role,
    pub screen_name: String,
}

#[derive(Clone, Copy, PartialEq)]
pub enum Role {
    Member,
    Admin,
}

#[derive(Eq, PartialEq, Clone, Copy)]
pub enum MutationType {
    Created,
    Deleted,
}

#[derive(Clone)]
pub struct MessageChanged {
    pub mutation_type: MutationType,
    pub id: usize,
    pub room_id: usize,
}

#[derive(Clone)]
pub struct WorkspaceInvitation {
    pub id: usize,
    pub workspace_id: usize,
    pub token: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}
