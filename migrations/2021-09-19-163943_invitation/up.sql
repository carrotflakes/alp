-- Your SQL goes here
CREATE TABLE workspace_invitations (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id),
  token VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  deleted_at TIMESTAMP DEFAULT NULL
);
