# Budget Service

Budget tracking and alerting microservice.

## Responsibilities

- Budget CRUD operations (per category, per month)
- Real-time budget tracking against spending
- Alert threshold detection (80%, 100%, 120%)
- Budget status calculations
- Budget alert event publishing

## Technology

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- PostgreSQL (budget_db)
- Hangfire (background jobs)
- MassTransit + RabbitMQ

## Database

- **Database Name:** budget_db
- **Tables:** Budgets, BudgetAlerts

## API Endpoints

- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget
- `GET /api/budgets/status` - Get all budget statuses

## Event Consumers

- `TransactionCreated` - Updates budget tracking in real-time
