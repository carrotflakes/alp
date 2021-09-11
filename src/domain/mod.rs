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
    pub text: String,
    pub created_at: DateTime,
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
}
