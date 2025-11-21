-- Update activities table to properly reference teacher
-- The instructor_id column will now reference teachers

-- Rename instructor_id to teacher_id for clarity (optional, but recommended)
ALTER TABLE activities 
CHANGE COLUMN instructor_id teacher_id INT,
ADD CONSTRAINT fk_activities_teacher 
    FOREIGN KEY (teacher_id) REFERENCES users(id) 
    ON DELETE SET NULL;

-- Update instructor_name column if it exists
-- (This might be a computed field or join in queries, check your schema)
