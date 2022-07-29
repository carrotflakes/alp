-- This file should undo anything in `up.sql`
ALTER TABLE messages DROP COLUMN room_id;

DROP TABLE rooms;
