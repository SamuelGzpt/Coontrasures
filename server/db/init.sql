-- Database Initialization Script for Coontrasures
-- Recommended Database: PostgreSQL
-- Tools recommended: pgAdmin or DBeaver

-- 1. Create the Database (Run this separately if needed)
-- CREATE DATABASE cootransures_db;

-- 2. Create the Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    size_bytes BIGINT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Create an Index for faster queries on active reports
CREATE INDEX IF NOT EXISTS idx_reports_active ON public.reports(is_active);

-- 4. Create an Admin Users table (Optional - better than hardcoding)
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store BCrypt hash, not plain text!
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Example Insert (DO NOT USE IN PRODUCTION WITHOUT CHANGING PASSWORD)
-- 'admin123' hashed with bcrypt cost 10:
-- INSERT INTO public.users (username, password_hash) VALUES ('admin', '$2b$10$YourHashedPasswordHere...');

COMMENT ON TABLE public.reports IS 'Stores metadata for uploaded PDF reports';
