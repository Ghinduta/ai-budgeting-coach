# Backend Microservices

This folder contains all backend microservices for the AI Budgeting Coach application.

## Services

- **ApiGateway** - YARP reverse proxy, authentication, rate limiting
- **UserService** - User authentication, profiles, JWT token management
- **TransactionService** - Transaction CRUD, CSV imports, summaries
- **AIService** - OpenAI integration, categorization, insights generation
- **BudgetService** - Budget tracking, spending alerts
- **NotificationService** - Email notifications, in-app alerts

## Architecture

Each service follows Clean Architecture with three layers:
- **API** - Controllers, DTOs, Middleware, Validation
- **Core** - Business logic, entities, interfaces, domain services
- **Infrastructure** - Data access, external services, messaging

## Running Services

See individual service README files for specific instructions.
