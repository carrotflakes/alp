use crate::db::schema::{messages, users};

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
