-- MySQL Initialization Script
-- This script runs automatically when the container starts for the first time

-- Set character set and collation
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Grant additional permissions to the application user
-- This allows Prisma Migrate to create shadow databases
GRANT CREATE ON *.* TO 'nextjs_user'@'%';
GRANT DROP ON *.* TO 'nextjs_user'@'%';
FLUSH PRIVILEGES;

-- Use the application database
USE nextjs_db;

-- Display initialization message
SELECT 'Database initialized successfully!' AS message;
SELECT DATABASE() AS current_database;
SELECT VERSION() AS mysql_version;
SELECT 'Granted CREATE and DROP permissions to nextjs_user' AS permissions;
