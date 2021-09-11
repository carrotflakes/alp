use diesel::prelude::*;
use std::sync::Arc;

use crate::db::{
    schema::users::{self, dsl::*},
    PgPool, PgPooled,
};

#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub uid: String,
    pub name: String,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub uid: &'a str,
    pub name: &'a str,
}

pub struct Repository {
    conn: Arc<PgPool>,
}

#[derive(Debug)]
pub enum Error {
    NotFound,
    Other(String),
}

impl Error {
    pub fn to_string(&self) -> String {
        match self {
            Error::NotFound => "NotFound".to_owned(),
            Error::Other(s) => s.to_owned(),
        }
    }
}

pub type Result<T> = std::result::Result<T, Error>;

impl Repository {
    pub fn new(conn: Arc<PgPool>) -> Self {
        Self { conn }
    }

    fn get_conn(&self) -> Result<PgPooled> {
        self.conn.get().map_err(|x| Error::Other(x.to_string()))
    }

    pub fn create_user(&self, t_uid: &str, t_name: &str) -> Result<User> {
        let new_user = NewUser {
            uid: t_uid,
            name: t_name,
        };

        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_user(&self, t_id: i32) -> Result<User> {
        users
            .find(t_id)
            .first::<User>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_user_by_uid(&self, t_uid: &str) -> Result<User> {
        users
            .filter(uid.eq(t_uid))
            .first::<User>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_all_users(&self) -> Result<Vec<User>> {
        users.load::<User>(&self.get_conn()?).map_err(err)
    }
}

pub fn err(err: diesel::result::Error) -> Error {
    match err {
        diesel::result::Error::NotFound => Error::NotFound,
        _ => Error::Other(err.to_string()),
    }
}

#[test]
fn test() {
    let connection = super::db::new_pool().unwrap();
    let repository = Repository::new(connection);
    repository.create_user("uid", "hello").unwrap();
    let results = repository.get_all_users().unwrap();

    println!("Displaying {} posts", results.len());
    for user in &results {
        println!("{}", user.id);
        println!("----------\n");
        println!("{}", user.name);
    }
    dbg!(results.len());
}
