mod mutation;
mod objects;
mod query;
mod subscription;

use async_graphql::{dataloader::DataLoader, Result, Schema};

use crate::{
    dataloader::UserLoader,
    usecases::{self, Usecase},
};
use mutation::MutationRoot;
use query::QueryRoot;
use subscription::SubscriptionRoot;

pub struct MyToken(pub String);

pub type MySchema = Schema<QueryRoot, MutationRoot, SubscriptionRoot>;

pub fn new_schema(usecase: Usecase, user_dataloader: DataLoader<UserLoader>) -> MySchema {
    let storage = Storage {
        usecase,
        user_dataloader,
    };

    Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(storage)
        .finish()
}

pub struct Storage {
    pub usecase: Usecase,
    pub user_dataloader: DataLoader<UserLoader>,
}

fn res<T, U: From<T>>(res: usecases::Result<T>) -> Result<U> {
    res.map(|x| x.into()).map_err(|e| e.into())
}
