-- Step 1: Add new categories to existing enum (temporary step)
ALTER TABLE gallery 
MODIFY COLUMN category ENUM('activities', 'spaces', 'events', 'gallery', 'promos', 'posturas', 'mudras') NOT NULL;

-- Step 2: Update all existing records to new categories
UPDATE gallery SET category = 'posturas' WHERE id > 0;

-- Step 3: Remove old categories from enum, keeping only posturas and mudras
ALTER TABLE gallery 
MODIFY COLUMN category ENUM('posturas', 'mudras') NOT NULL DEFAULT 'posturas';
