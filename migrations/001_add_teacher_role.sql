-- Add 'teacher' role to users table
-- This migration adds the teacher role to the existing user role enum

-- Step 1: Modify the users table to add 'teacher' to role enum
ALTER TABLE users 
MODIFY COLUMN role ENUM('user', 'instructor', 'teacher', 'admin') DEFAULT 'user';

-- Note: If you have existing users with 'instructor' role that should be 'teacher',
-- you can update them with:
-- UPDATE users SET role = 'teacher' WHERE role = 'instructor';
