mod mutation;
mod objects;
mod query;
mod subscription;

use async_graphql::{Context, Result, Schema};

use crate::{
    auth::{Authorize, UID},
    usecases::Usecase,
};
use mutation::MutationRoot;
use query::QueryRoot;
use subscription::SubscriptionRoot;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

pub fn new_schema(auth: Authorize, usecase: Usecase) -> MySchema {
    let storage = Storage { usecase };

    Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(storage)
        .data(auth)
        .finish()
}

pub struct Storage {
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
