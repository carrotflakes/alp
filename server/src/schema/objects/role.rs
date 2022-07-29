use async_graphql::Enum;

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum Role {
    Member,
    Admin,
}

impl From<crate::domain::Role> for Role {
    fn from(role: crate::domain::Role) -> Self {
        match role {
            crate::domain::Role::Member => Role::Member,
            crate::domain::Role::Admin => Role::Admin,
        }
    }
}

impl Into<crate::domain::Role> for Role {
    fn into(self) -> crate::domain::Role {
        match self {
            Role::Member => crate::domain::Role::Member,
            Role::Admin => crate::domain::Role::Admin,
        }
    }
}
