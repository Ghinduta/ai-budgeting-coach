# AI Service

AI-powered transaction categorization and insights generation microservice.

## Responsibilities

- Automatic transaction categorization using OpenAI GPT-4 Turbo
- Confidence scoring for categorizations
- Categorization caching (30-day TTL)
- Spending pattern analysis
- AI insight generation (weekly, monthly)
- Educational recommendations

## Technology

- ASP.NET Core 8 Web API
- OpenAI API (GPT-4 Turbo)
- Entity Framework Core 8
- PostgreSQL (ai_db)
- MassTransit + RabbitMQ

## Database

- **Database Name:** ai_db
- **Tables:** AIInsights, CategorizationCache

## API Endpoints

- `GET /api/ai/insights` - Get AI-generated insights
- `GET /api/ai/analytics` - Get spending analytics

## Event Consumers

- `TransactionCreated` - Triggers auto-categorization
- `UserRegistered` - Generates welcome insights
