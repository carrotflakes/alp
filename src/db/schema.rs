table! {
    messages (id) {
        id -> Int4,
        user_id -> Int4,
        text -> Text,
        created_at -> Timestamp,
    }
}

table! {
    users (id) {
        id -> Int4,
        uid -> Varchar,
        name -> Varchar,
    }
}

joinable!(messages -> users (user_id));

allow_tables_to_appear_in_same_query!(
    messages,
    users,
);
