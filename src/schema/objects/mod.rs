pub mod invitation;
pub mod message;
pub mod role;
pub mod room;
pub mod user;
pub mod workspace;

use super::Storage;
use async_graphql::Enum;

#[derive(Enum, Eq, PartialEq, Copy, Clone)]
pub enum MutationType {
    Created,
    Deleted,
}
