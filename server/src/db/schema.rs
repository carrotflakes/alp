// @generated automatically by Diesel CLI.

diesel::table! {
    messages (id) {
        id -> Int4,
        user_id -> Int4,
        text -> Text,
        created_at -> Timestamp,
        room_id -> Int4,
    }
}

diesel::table! {
    rooms (id) {
        id -> Int4,
        code -> Varchar,
        created_at -> Timestamp,
        workspace_id -> Int4,
    }
}

diesel::table! {
    user_rooms (id) {
        id -> Int4,
        user_id -> Int4,
        room_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        uid -> Varchar,
        name -> Varchar,
    }
}

diesel::table! {
    workspace_invitations (id) {
        id -> Int4,
        workspace_id -> Int4,
        token -> Varchar,
        created_at -> Timestamp,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    workspace_users (id) {
        id -> Int4,
        workspace_id -> Int4,
        user_id -> Int4,
        role -> Varchar,
        screen_name -> Varchar,
    }
}

diesel::table! {
    workspaces (id) {
        id -> Int4,
        code -> Varchar,
        created_at -> Timestamp,
    }
}

diesel::joinable!(messages -> rooms (room_id));
diesel::joinable!(messages -> users (user_id));
diesel::joinable!(rooms -> workspaces (workspace_id));
diesel::joinable!(user_rooms -> rooms (room_id));
diesel::joinable!(user_rooms -> users (user_id));
diesel::joinable!(workspace_invitations -> workspaces (workspace_id));
diesel::joinable!(workspace_users -> users (user_id));
diesel::joinable!(workspace_users -> workspaces (workspace_id));

diesel::allow_tables_to_appear_in_same_query!(
    messages,
    rooms,
    user_rooms,
    users,
    workspace_invitations,
    workspace_users,
    workspaces,
);
