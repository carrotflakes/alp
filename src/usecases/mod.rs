use std::sync::Arc;

use crate::{domain::User, infra::Repository};

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
            Err(crate::infra::Error::NotFound) => Ok(None),
            Err(e) => Err(e.to_string()),
        }
    }

    pub fn create_user(&self, uid: &str, name: &str) -> Result<User> {
        self.repository
            .create_user(uid, name)
            .map(user)
            .map_err(|x| x.to_string())
    }
}

pub fn user(user: crate::infra::User) -> User {
    User {
        id: user.id as usize,
        uid: user.uid,
        name: user.name,
    }
}
