mod mutation;
mod objects;
mod paging;
mod query;
mod subscription;

use crate::{
    auth::{Authorize, UID},
    usecases::Usecase,
};
use async_graphql::{Context, Result, Schema};
use futures::lock::Mutex;
use slab::Slab;
use std::sync::Arc;

use objects::{Message, User};

use mutation::MutationRoot;
use query::QueryRoot;
use subscription::SubscriptionRoot;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

pub fn new_schema(auth: Authorize, usecase: Usecase) -> MySchema {
    let storage = StorageInner {
        messages: Default::default(),
        users: Default::default(),
        usecase,
    };
    let storage = Arc::new(Mutex::new(storage));

    Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(storage)
        .data(auth)
        .finish()
}

pub type Storage = Arc<Mutex<StorageInner>>;

pub struct StorageInner {
    pub messages: Slab<Message>,
    pub users: Slab<User>,
    pub usecase: Usecase,
}

pub fn varify_token(ctx: &Context<'_>) -> Result<UID, async_graphql::Error> {
    let uid = if let Some(token) = ctx.data_opt::<MyToken>() {
        if token.0 == "dummy" {
            return Ok(UID("dummy".to_string()));
        }

        if token.0.starts_with("Bearer ") {
            match ctx
                .data_unchecked::<Authorize>()
                .varify(token.0.trim_start_matches("Bearer "))
            {
                Ok(Some(uid)) => uid,
                Ok(None) => return Err(async_graphql::Error::new(format!("token has not uid"))),
                Err(err) => {
                    return Err(async_graphql::Error::new(format!(
                        "token varify failed: {}",
                        err
                    )))
                }
            }
        } else {
            return Err(async_graphql::Error::new("token is invalid"));
        }
    } else {
        return Err(async_graphql::Error::new("token is required"));
    };
    Ok(uid)
}
