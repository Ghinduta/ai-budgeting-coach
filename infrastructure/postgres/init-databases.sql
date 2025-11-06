-- AI Budgeting Coach - Database Initialization Script
-- This script runs automatically when PostgreSQL container initializes
-- Creates all 6 databases for microservices

-- User Service Database
CREATE DATABASE user_db;
COMMENT ON DATABASE user_db IS 'User management and authentication';

-- Transaction Service Database
CREATE DATABASE transaction_db;
COMMENT ON DATABASE transaction_db IS 'Transaction CRUD and CSV imports';

-- AI Service Database
CREATE DATABASE ai_db;
COMMENT ON DATABASE ai_db IS 'AI categorization and insights';

-- Budget Service Database
CREATE DATABASE budget_db;
COMMENT ON DATABASE budget_db IS 'Budget tracking and alerts';

-- Notification Service Database
CREATE DATABASE notification_db;
COMMENT ON DATABASE notification_db IS 'Notifications and email delivery';

-- API Gateway Database (optional for MVP)
CREATE DATABASE api_gateway_db;
COMMENT ON DATABASE api_gateway_db IS 'API Gateway rate limiting and logs';

-- Grant all privileges to budgetcoach user
GRANT ALL PRIVILEGES ON DATABASE user_db TO budgetcoach;
GRANT ALL PRIVILEGES ON DATABASE transaction_db TO budgetcoach;
GRANT ALL PRIVILEGES ON DATABASE ai_db TO budgetcoach;
GRANT ALL PRIVILEGES ON DATABASE budget_db TO budgetcoach;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO budgetcoach;
GRANT ALL PRIVILEGES ON DATABASE api_gateway_db TO budgetcoach;
