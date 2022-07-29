mod mutation;
mod objects;
mod query;
mod subscription;

use async_graphql::{Result, Schema};

use crate::usecases::{self, Usecase};
use mutation::MutationRoot;
use query::QueryRoot;
use subscription::SubscriptionRoot;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

pub fn new_schema(usecase: Usecase) -> MySchema {
    let storage = Storage { usecase };

    Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(storage)
        .finish()
}

pub struct Storage {
    pub usecase: Usecase,
}

fn res<T, U: From<T>>(res: usecases::Result<T>) -> Result<U> {
    res.map(|x| x.into()).map_err(|e| e.into())
}
