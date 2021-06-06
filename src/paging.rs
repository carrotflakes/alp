use async_graphql::{InputObject, SimpleObject, ID};

#[derive(InputObject)]
pub struct PagingInput {
    pub first: Option<i32>,
    pub last: Option<i32>,
    pub before: Option<ID>,
    pub after: Option<ID>,
}

#[derive(Clone, SimpleObject)]
pub struct PageInfo {
    pub start_cursor: ID,
    pub end_cursor: ID,
    pub has_prev: bool,
    pub has_next: bool,
}
