use chrono::NaiveDateTime;

#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub uid: String,
    pub name: String,
}

#[derive(Queryable)]
pub struct Message {
    pub id: i32,
    pub user_id: i32,
    pub text: String,
    pub created_at: NaiveDateTime,
    pub room_id: i32,
}

#[derive(Queryable)]
pub struct Room {
    pub id: i32,
    pub code: String,
    pub created_at: NaiveDateTime,
    pub workspace_id: i32,
}

#[derive(Queryable)]
pub struct Workspace {
    pub id: i32,
    pub code: String,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable)]
pub struct WorkspaceUser {
    pub id: i32,
    pub workspace_id: i32,
    pub user_id: i32,
    pub role: String,
    pub screen_name: String,
}

#[derive(Queryable)]
pub struct WorkspaceInvitation {
    pub id: i32,
    pub workspace_id: i32,
    pub token: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}
