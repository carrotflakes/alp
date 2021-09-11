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
}
