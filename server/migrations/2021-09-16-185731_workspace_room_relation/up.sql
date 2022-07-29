-- Your SQL goes here
ALTER TABLE rooms ADD COLUMN workspace_id INTEGER NOT NULL DEFAULT 1 REFERENCES workspaces(id);
