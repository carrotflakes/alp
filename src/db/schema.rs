table! {
    messages (id) {
        id -> Int4,
        user_id -> Int4,
        text -> Text,
        created_at -> Timestamp,
        room_id -> Int4,
    }
}

table! {
    rooms (id) {
        id -> Int4,
        code -> Varchar,
        created_at -> Timestamp,
    }
}

table! {
    user_rooms (id) {
        id -> Int4,
        user_id -> Int4,
        room_id -> Int4,
    }
}

table! {
    users (id) {
        id -> Int4,
        uid -> Varchar,
        name -> Varchar,
    }
}

joinable!(messages -> rooms (room_id));
joinable!(messages -> users (user_id));
joinable!(user_rooms -> rooms (room_id));
joinable!(user_rooms -> users (user_id));

allow_tables_to_appear_in_same_query!(
    messages,
    rooms,
    user_rooms,
    users,
);
