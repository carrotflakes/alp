use chrono::NaiveDateTime;

pub type DateTime = NaiveDateTime;

#[derive(Debug, Clone)]
pub struct User {
    pub id: usize,
    pub uid: String,
    pub name: String,
}

#[derive(Debug, Clone)]
pub enum UserStatus {
    Online,
    Offline,
}

impl ToString for UserStatus {
    fn to_string(&self) -> String {
        match self {
            UserStatus::Online => "online".to_string(),
            UserStatus::Offline => "offline".to_string(),
        }
    }
}

impl std::str::FromStr for UserStatus {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "online" => Ok(UserStatus::Online),
            "offline" => Ok(UserStatus::Offline),
            _ => Err(format!("Invalid user status: {}", s)),
        }
    }
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

#[derive(Debug, Clone)]
pub struct WorkspaceUser {
    pub id: usize,
    pub workspace_id: usize,
    pub user_id: usize,
    pub role: Role,
    pub screen_name: String,
}

#[derive(Debug, Clone, Copy, PartialEq)]
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
