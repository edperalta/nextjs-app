-- PostgreSQL Initialization Script
-- Runs automatically on first container start.

-- Grant CREATEDB so Prisma Migrate can create its shadow database.
ALTER USER nextjs_user CREATEDB;

-- Enable pgvector extension for semantic search / embedding storage.
CREATE EXTENSION IF NOT EXISTS vector;
