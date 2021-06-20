mod mutation;
mod objects;
mod paging;
mod query;
mod subscription;

use crate::auth::{Authorize, UID};
use async_graphql::{Context, Result, Schema};
use futures::lock::Mutex;
use slab::Slab;
use std::sync::Arc;

use self::objects::{Message, User};

pub use mutation::MutationRoot;
pub use query::QueryRoot;
pub use subscription::SubscriptionRoot;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

#[derive(Default)]
pub struct Slabs {
    pub messages: Slab<Message>,
    pub users: Slab<User>,
}

pub type Storage = Arc<Mutex<Slabs>>;

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
