# Docker Setup

This directory contains Docker-related configuration for the Next.js application.

## MySQL Initialization

Place SQL scripts in `mysql/init/` directory. They will be executed automatically when the MySQL container starts for the first time, in alphabetical order.

Example:
```sql
-- ./mysql/init/01-create-tables.sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Usage

1. Start the database:
   ```bash
   docker-compose up -d mysql
   ```

2. Start with phpMyAdmin (optional):
   ```bash
   docker-compose up -d mysql phpmyadmin
   ```

3. Access phpMyAdmin at: http://localhost:8080

## Environment Variables

Copy `.env.example` to `.env` and customize as needed.
