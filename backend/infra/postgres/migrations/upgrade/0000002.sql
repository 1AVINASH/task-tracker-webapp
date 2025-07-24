CREATE TABLE if not exists boards (
    id bigserial,
    title varchar(255),
    theme varchar(255),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE boards
ADD COLUMN if not exists last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE tasks ADD COLUMN if not exists board_id bigint;

CREATE OR REPLACE FUNCTION update_last_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER if not exists update_boards_last_updated_at
BEFORE UPDATE ON boards
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_at_column();

CREATE TYPE if not exists tasks_status AS ENUM('DELETED', 'COMPLETED', 'IN_PROGRESS');
ALTER TABLE tasks ADD COLUMN if not exists status tasks_status;