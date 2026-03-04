# Docker Setup

This directory contains Docker-related configuration for the Next.js application.

## PostgreSQL Initialization

Place SQL scripts in `postgres/init/` directory. They will be executed automatically when the PostgreSQL container starts for the first time, in alphabetical order.

Example:
```sql
-- ./postgres/init/02-seed.sql
INSERT INTO users (name, email) VALUES ('Admin', 'admin@example.com');
```

## Usage

1. Start the database:
   ```bash
   docker-compose up -d postgres
   ```

2. Start with pgAdmin (optional):
   ```bash
   docker-compose up -d postgres pgadmin
   ```

3. Access pgAdmin at: http://localhost:8080
   - Default email: `admin@example.com`
   - Default password: `admin_password`

## Environment Variables

Copy `.env.example` to `.env` and customize as needed.
