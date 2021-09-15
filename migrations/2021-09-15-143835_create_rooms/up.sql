-- Your SQL goes here
CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  code VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

INSERT INTO rooms (id, code) VALUES (1, 'default');

ALTER TABLE messages ADD COLUMN room_id INTEGER NOT NULL DEFAULT 1 REFERENCES rooms(id);

ALTER TABLE messages ALTER COLUMN room_id DROP DEFAULT;
