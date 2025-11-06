# Shared Code

Shared libraries and types used across microservices and frontend.

## Folders

### Contracts/
RabbitMQ message contracts (events) shared between services.
- UserEvents.cs - User-related events
- TransactionEvents.cs - Transaction-related events
- AIEvents.cs - AI/insight-related events
- BudgetEvents.cs - Budget-related events

### Common/
Common utilities and base classes for backend services.
- Exceptions/ - Custom exception classes
- Middleware/ - Shared middleware components
- Models/ - Shared DTOs (PagedResponse, ErrorResponse)
- Extensions/ - Extension methods

### Types/
Shared TypeScript type definitions for frontend.
- user.types.ts
- transaction.types.ts
- budget.types.ts
- insight.types.ts
- notification.types.ts
- api.types.ts

## Usage

Backend services reference Contracts/ and Common/ via project references.
Frontend imports Types/ as npm package or direct TypeScript references.
