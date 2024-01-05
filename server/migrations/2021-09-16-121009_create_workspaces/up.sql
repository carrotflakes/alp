-- Your SQL goes here-- Your SQL goes here
CREATE TABLE workspaces (
  id SERIAL PRIMARY KEY,
  code VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE workspace_users (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role VARCHAR NOT NULL,
  UNIQUE (workspace_id, user_id)
);

INSERT INTO workspaces (code) VALUES ('default');
