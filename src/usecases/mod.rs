mod pagenation;

use std::sync::Arc;

use crate::{
    domain::{Message, MessageChanged, MutationType, Room, User},
    repository::Repository,
    simple_broker::SimpleBroker,
};

use futures::{Stream, StreamExt};
pub type Result<T> = std::result::Result<T, String>;

pub struct Usecase {
    pub(crate) repository: Arc<Repository>,
}

impl Usecase {
    pub fn new(repository: Arc<Repository>) -> Self {
        Self { repository }
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

    pub fn get_room(&self, id: usize) -> Result<Room> {
        self.repository
            .get_room(id as i32)
            .map(room)
            .map_err(|x| x.to_string())
    }

    pub fn create_room(&self, uid: &str, code: &str) -> Result<Room> {
        if let Some(user) = self.find_user_by_uid(uid)? {
            let room = self
                .repository
                .create_room(code)
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

    pub fn find_user_room(&self, user_id: usize, room_id: usize) -> Result<bool> {
        self.repository
            .find_user_room(user_id as i32, room_id as i32)
            .map_err(|x| x.to_string())
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
    }
}

pub fn repo_err(err: crate::repository::Error) -> String {
    err.to_string()
}
