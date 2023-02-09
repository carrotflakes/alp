use std::{convert::Infallible, sync::Arc};

use async_graphql::dataloader::Loader;

use crate::{domain::User, repository::Repository};

pub struct UserLoader {
    repository: Arc<Repository>,
}

impl UserLoader {
    pub fn new(repository: Arc<Repository>) -> Self {
        Self { repository }
    }
}

#[async_trait::async_trait]
impl Loader<i32> for UserLoader {
    type Value = User;
    type Error = Infallible;

    async fn load(
        &self,
        keys: &[i32],
    ) -> Result<std::collections::HashMap<i32, Self::Value>, Self::Error> {
        Ok(self
            .repository
            .get_users(keys)
            .unwrap()
            .into_iter()
            .map(|x| {
                (
                    x.id,
                    User {
                        id: x.id as usize,
                        uid: x.uid,
                        name: x.name,
                    },
                )
            })
            .collect())
    }
}
