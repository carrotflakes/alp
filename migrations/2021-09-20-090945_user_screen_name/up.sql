-- Your SQL goes here
ALTER TABLE workspace_users ADD COLUMN screen_name VARCHAR NOT NULL DEFAULT '';

UPDATE workspace_users SET screen_name = (SELECT users.name FROM users WHERE workspace_users.user_id = users.id);
