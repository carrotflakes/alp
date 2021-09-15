use std::sync::Arc;

use crate::{
    domain::{Message, MessageChanged, MutationType, Room, User},
    repository::Repository,
    simple_broker::SimpleBroker,
};

use futures::{Stream, StreamExt};
pub type Result<T> = std::result::Result<T, String>;

pub struct Usecase {
    repository: Arc<Repository>,
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
        match self.repository.add_message(user_id as i32, room_id as i32, text) {
            Ok(m) => {
                SimpleBroker::publish(MessageChanged {
                    mutation_type: MutationType::Created,
                    id: m.id as usize,
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
        after: Option<String>,
        before: Option<String>,
        first: Option<usize>,
        last: Option<usize>,
    ) -> Result<(Vec<Message>, bool, bool)> {
        let (asc, limit, id) = match (first, last) {
            (None, None) => {
                return Err(format!("'first' or 'last' required in PagingInput").into());
            }
            (Some(_), Some(_)) => {
                return Err(format!("cannot specify 'first' and 'last' same time").into());
            }
            (Some(limit), None) => (true, limit, after),
            (None, Some(limit)) => (false, limit, before),
        };

        if limit < 1 {
            return Err("invalid limit".into());
        }
        let limit = limit.min(20) as i64;

        let id = id
            .map(|x| x.parse().unwrap())
            .unwrap_or(if asc { 0 } else { i32::MAX });

        let (messages, has_prev, has_next): (Vec<_>, _, _) = if asc {
            let mut messages = self
                .repository
                .get_messages_gt_id(id, limit + 1)
                .map_err(repo_err)?;
            let has_next = messages.len() > limit as usize;
            let has_prev = self
                .repository
                .get_messages_lt_id(id, 2)
                .map_err(repo_err)?
                .len()
                == 2;
            if has_next {
                messages.pop();
            }
            (messages, has_prev, has_next)
        } else {
            let mut messages = self
                .repository
                .get_messages_lt_id(id, limit + 1)
                .map_err(repo_err)?;
            let has_prev = messages.len() > limit as usize;
            let has_next = self
                .repository
                .get_messages_gt_id(id, 2)
                .map_err(repo_err)?
                .len()
                == 2;
            if has_prev {
                messages.remove(0);
            }
            (messages, has_prev, has_next)
        };
        let messages = messages.into_iter().map(message).collect();
        Ok((messages, has_prev, has_next))
    }

    pub fn subscribe_messages(
        &self,
        mutation_type: Option<MutationType>,
    ) -> impl Stream<Item = MessageChanged> {
        SimpleBroker::<MessageChanged>::subscribe().filter_map(move |event| {
            let res = match mutation_type {
                Some(mt) if mt != event.mutation_type => None,
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
