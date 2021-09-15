mod insert;
mod query;

use diesel::prelude::*;
use std::sync::Arc;

use crate::db::{
    schema::{messages, rooms, user_rooms, users},
    PgPool, PgPooled,
};
use insert::*;
pub use query::*;

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

    pub fn create_user(&self, uid: &str, name: &str) -> Result<User> {
        let new_user = NewUser { uid, name };

        diesel::insert_into(users::table)
            .values(&new_user)
            .get_result(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_user(&self, id: i32) -> Result<User> {
        users::dsl::users
            .find(id)
            .first::<User>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_user_by_uid(&self, uid: &str) -> Result<User> {
        users::dsl::users
            .filter(users::dsl::uid.eq(uid))
            .first::<User>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_all_users(&self) -> Result<Vec<User>> {
        users::dsl::users
            .load::<User>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn add_message(&self, user_id: i32, room_id: i32, text: &str) -> Result<Message> {
        let new_message = NewMessage {
            user_id,
            room_id,
            text,
        };

        diesel::insert_into(messages::table)
            .values(&new_message)
            .get_result(&self.get_conn()?)
            .map_err(err)
    }

    pub fn count_messages(&self) -> Result<i64> {
        messages::dsl::messages
            .count()
            .get_result(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_message(&self, id: i32) -> Result<Message> {
        messages::dsl::messages
            .find(id)
            .first::<Message>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_messages_gt_id(&self, room_id: i32, id: i32, limit: i64) -> Result<Vec<Message>> {
        messages::dsl::messages
            .filter(messages::dsl::room_id.eq(room_id))
            .filter(messages::dsl::id.gt(id))
            .limit(limit)
            .get_results(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_messages_lt_id(&self, room_id: i32, id: i32, limit: i64) -> Result<Vec<Message>> {
        messages::dsl::messages
            .filter(messages::dsl::room_id.eq(room_id))
            .filter(messages::dsl::id.lt(id))
            .order(messages::dsl::id.desc())
            .limit(limit)
            .get_results(&self.get_conn()?)
            .map(|mut messages| {
                messages.reverse();
                messages
            })
            .map_err(err)
    }

    pub fn get_room(&self, id: i32) -> Result<Room> {
        rooms::dsl::rooms
            .find(id)
            .first::<Room>(&self.get_conn()?)
            .map_err(err)
    }

    pub fn create_room(&self, code: &str) -> Result<Room> {
        let new_room = NewRoom { code };

        diesel::insert_into(rooms::table)
            .values(&new_room)
            .get_result(&self.get_conn()?)
            .map_err(err)
    }

    pub fn get_rooms_by_user_id(&self, user_id: i32) -> Result<Vec<Room>> {
        user_rooms::dsl::user_rooms
            .filter(user_rooms::dsl::user_id.eq(user_id))
            .inner_join(rooms::dsl::rooms)
            .select(rooms::all_columns)
            .get_results(&self.get_conn()?)
            .map_err(err)
    }

    pub fn add_user_room(&self, user_id: i32, room_id: i32) -> Result<usize> {
        let new_user_room = NewUserRoom { user_id, room_id };

        diesel::insert_into(user_rooms::table)
            .values(&new_user_room)
            .execute(&self.get_conn()?)
            .map_err(err)
    }

    pub fn find_user_room(&self, user_id: i32, room_id: i32) -> Result<bool> {
        user_rooms::dsl::user_rooms
            .filter(
                user_rooms::dsl::user_id
                    .eq(user_id)
                    .and(user_rooms::dsl::room_id.eq(room_id)),
            )
            .count()
            .get_result(&self.get_conn()?)
            .map(|count: i64| count == 1)
            .map_err(err)
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
