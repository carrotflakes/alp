-- Your SQL goes here
CREATE TABLE user_rooms (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  room_id INTEGER NOT NULL REFERENCES rooms(id),
  UNIQUE (user_id, room_id)
);
