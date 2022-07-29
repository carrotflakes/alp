-- Your SQL goes here
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id SERIAL NOT NULL REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
)
