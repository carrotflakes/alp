pub mod message;
pub mod room;
pub mod user;

use super::Storage;
use async_graphql::Enum;

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Deleted,
}
