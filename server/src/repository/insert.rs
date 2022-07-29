use crate::db::schema::{
    messages, rooms, user_rooms, users, workspace_invitations, workspace_users, workspaces,
};

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub uid: &'a str,
    pub name: &'a str,
}

#[derive(Insertable)]
#[table_name = "messages"]
pub struct NewMessage<'a> {
    pub user_id: i32,
    pub room_id: i32,
    pub text: &'a str,
}

#[derive(Insertable)]
#[table_name = "rooms"]
pub struct NewRoom<'a> {
    pub code: &'a str,
    pub workspace_id: i32,
}

#[derive(Insertable)]
#[table_name = "user_rooms"]
pub struct NewUserRoom {
    pub user_id: i32,
    pub room_id: i32,
}

#[derive(Insertable)]
#[table_name = "workspaces"]
pub struct NewWorkspace<'a> {
    pub code: &'a str,
}

#[derive(Insertable)]
#[table_name = "workspace_users"]
pub struct NewWorkspaceUser<'a> {
    pub workspace_id: i32,
    pub user_id: i32,
    pub role: &'a str,
    pub screen_name: &'a str,
}
#[derive(Insertable)]
#[table_name = "workspace_invitations"]
pub struct NewWorkspaceInvitation<'a> {
    pub workspace_id: i32,
    pub token: &'a str,
}
