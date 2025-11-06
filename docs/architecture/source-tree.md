# AI Budgeting Coach - Source Tree Structure

**Version:** 1.0
**Date:** 2025-01-06
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Monorepo Root Structure](#2-monorepo-root-structure)
3. [Backend Services Structure](#3-backend-services-structure)
4. [Frontend Structure](#4-frontend-structure)
5. [Shared Code Structure](#5-shared-code-structure)
6. [Infrastructure Structure](#6-infrastructure-structure)
7. [Testing Structure](#7-testing-structure)
8. [Documentation Structure](#8-documentation-structure)
9. [File Naming Conventions](#9-file-naming-conventions)
10. [Folder Organization Principles](#10-folder-organization-principles)

---

## 1. Overview

### 1.1 Repository Strategy

**Monorepo** - All code in a single Git repository

**Benefits:**
- Atomic commits across services
- Simplified dependency management
- Easier refactoring
- Single source of truth
- Unified CI/CD pipeline

### 1.2 Repository URL

```
https://github.com/yourusername/ai-budgeting-coach
```

### 1.3 Primary Technologies

- **Backend:** .NET 8 (C#)
- **Frontend:** React 18 + TypeScript
- **Database:** PostgreSQL 16
- **Messaging:** RabbitMQ 3.12
- **Container:** Docker + Docker Compose

---

## 2. Monorepo Root Structure

```
ai-budgeting-coach/
├── .github/                          # GitHub configuration
│   ├── workflows/                    # GitHub Actions workflows
│   │   ├── backend-ci.yml           # Backend CI/CD
│   │   ├── frontend-ci.yml          # Frontend CI/CD
│   │   └── deploy.yml               # Deployment workflow
│   └── ISSUE_TEMPLATE/              # Issue templates
│
├── services/                         # Backend microservices
│   ├── ApiGateway/                  # YARP API Gateway
│   ├── UserService/                 # User management & auth
│   ├── TransactionService/          # Transaction CRUD & CSV
│   ├── AIService/                   # AI categorization & insights
│   ├── BudgetService/               # Budget tracking & alerts
│   ├── NotificationService/         # Notifications & email
│   └── README.md                    # Services overview
│
├── frontend/                         # React frontend application
│   ├── public/                      # Static assets
│   ├── src/                         # Source code
│   └── package.json                 # NPM dependencies
│
├── shared/                           # Shared code across services
│   ├── BudgetCoach.Contracts/       # Message contracts (C#)
│   ├── BudgetCoach.Common/          # Shared utilities (C#)
│   └── types/                       # Shared TypeScript types
│
├── infrastructure/                   # Infrastructure as code
│   ├── docker/                      # Dockerfiles
│   ├── nginx/                       # Nginx configuration
│   ├── postgres/                    # PostgreSQL init scripts
│   ├── rabbitmq/                    # RabbitMQ definitions
│   ├── prometheus/                  # Prometheus configuration
│   ├── grafana/                     # Grafana dashboards
│   └── scripts/                     # Deployment scripts
│
├── tests/                            # Cross-service tests
│   ├── IntegrationTests/            # Integration tests
│   ├── E2ETests/                    # End-to-end tests (Playwright)
│   └── PerformanceTests/            # Load tests (k6)
│
├── docs/                             # Documentation
│   ├── architecture/                # Architecture docs (sharded)
│   ├── stories/                     # User stories
│   ├── qa/                          # QA reports
│   ├── idea.md                      # Initial idea
│   ├── brief.md                     # Project brief
│   ├── prd.md                       # Product requirements
│   ├── architecture.md              # Main architecture doc
│   ├── implementation-plan.md       # Implementation plan
│   ├── deployment-plan.md           # Deployment plan
│   └── test-plan.md                 # Test plan
│
├── .ai/                              # AI-related files
│   └── debug-log.md                 # Development debug log
│
├── .bmad-core/                       # BMad framework files
│   ├── core-config.yaml             # Project configuration
│   └── [agent-specific-files]       # Agent tasks/templates
│
├── docker-compose.yml                # Development environment
├── docker-compose.prod.yml           # Production environment
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── .editorconfig                     # Editor configuration
├── BudgetCoach.sln                   # .NET solution file
├── README.md                         # Project README
└── LICENSE                           # License file
```

---

## 3. Backend Services Structure

### 3.1 Common Service Structure (Clean Architecture)

Each microservice follows **Clean Architecture** with three layers:

```
[ServiceName]/
├── [ServiceName].API/                # Presentation layer
│   ├── Controllers/                 # API controllers
│   │   ├── UsersController.cs
│   │   └── HealthController.cs
│   ├── Middleware/                  # Custom middleware
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── RequestLoggingMiddleware.cs
│   ├── Filters/                     # Action filters
│   ├── DTOs/                        # Data transfer objects
│   │   ├── Requests/               # Request DTOs
│   │   │   └── CreateUserRequest.cs
│   │   └── Responses/              # Response DTOs
│   │       └── UserResponse.cs
│   ├── Validators/                  # FluentValidation validators
│   │   └── CreateUserValidator.cs
│   ├── Extensions/                  # Service registration extensions
│   │   └── ServiceCollectionExtensions.cs
│   ├── appsettings.json            # Configuration
│   ├── appsettings.Development.json
│   ├── appsettings.Production.json
│   ├── Program.cs                  # Application entry point
│   ├── Dockerfile                  # Docker image definition
│   └── [ServiceName].API.csproj    # Project file
│
├── [ServiceName].Core/              # Domain/Business logic layer
│   ├── Entities/                   # Domain entities
│   │   ├── User.cs
│   │   └── RefreshToken.cs
│   ├── Interfaces/                 # Abstraction interfaces
│   │   ├── Repositories/
│   │   │   └── IUserRepository.cs
│   │   └── Services/
│   │       └── IUserService.cs
│   ├── Services/                   # Business logic services
│   │   ├── UserService.cs
│   │   └── JwtTokenService.cs
│   ├── Exceptions/                 # Custom exceptions
│   │   └── UserNotFoundException.cs
│   ├── ValueObjects/               # Value objects
│   └── [ServiceName].Core.csproj
│
└── [ServiceName].Infrastructure/    # Infrastructure layer
    ├── Data/                       # Database context
    │   ├── [ServiceName]DbContext.cs
    │   ├── Migrations/            # EF Core migrations
    │   └── Configurations/        # Entity configurations
    │       └── UserConfiguration.cs
    ├── Repositories/              # Repository implementations
    │   └── UserRepository.cs
    ├── Messaging/                 # RabbitMQ consumers/publishers
    │   ├── Consumers/
    │   │   └── UserRegisteredConsumer.cs
    │   └── Publishers/
    │       └── EventPublisher.cs
    ├── ExternalServices/          # External API clients
    │   ├── OpenAIClient.cs
    │   └── SendGridClient.cs
    ├── Caching/                   # Caching implementations
    │   └── RedisCacheService.cs
    └── [ServiceName].Infrastructure.csproj
```

### 3.2 Service-Specific Details

#### 3.2.1 API Gateway

```
ApiGateway/
├── ApiGateway.API/
│   ├── Middleware/
│   │   ├── JwtValidationMiddleware.cs
│   │   ├── RateLimitingMiddleware.cs
│   │   └── CorrelationIdMiddleware.cs
│   ├── appsettings.json           # YARP route configuration
│   ├── Program.cs
│   ├── Dockerfile
│   └── ApiGateway.API.csproj
└── README.md
```

#### 3.2.2 User Service

```
UserService/
├── UserService.API/
│   ├── Controllers/
│   │   └── UsersController.cs     # Register, Login, Profile
│   ├── DTOs/
│   │   ├── Requests/
│   │   │   ├── RegisterRequest.cs
│   │   │   ├── LoginRequest.cs
│   │   │   └── UpdateProfileRequest.cs
│   │   └── Responses/
│   │       ├── TokenResponse.cs
│   │       └── UserResponse.cs
│   └── Validators/
│       ├── RegisterRequestValidator.cs
│       └── UpdateProfileValidator.cs
├── UserService.Core/
│   ├── Entities/
│   │   ├── User.cs
│   │   └── RefreshToken.cs
│   ├── Interfaces/
│   │   ├── IUserRepository.cs
│   │   ├── IUserService.cs
│   │   ├── IJwtTokenService.cs
│   │   └── IPasswordHasher.cs
│   └── Services/
│       ├── UserService.cs
│       ├── JwtTokenService.cs
│       └── BcryptPasswordHasher.cs
└── UserService.Infrastructure/
    ├── Data/
    │   ├── UserDbContext.cs
    │   ├── Migrations/
    │   └── Configurations/
    │       ├── UserConfiguration.cs
    │       └── RefreshTokenConfiguration.cs
    ├── Repositories/
    │   └── UserRepository.cs
    └── Messaging/
        └── Publishers/
            └── UserRegisteredPublisher.cs
```

#### 3.2.3 Transaction Service

```
TransactionService/
├── TransactionService.API/
│   ├── Controllers/
│   │   ├── TransactionsController.cs
│   │   └── ImportController.cs
│   ├── DTOs/
│   │   ├── Requests/
│   │   │   ├── CreateTransactionRequest.cs
│   │   │   ├── UpdateTransactionRequest.cs
│   │   │   └── ImportCsvRequest.cs
│   │   └── Responses/
│   │       ├── TransactionResponse.cs
│   │       ├── PagedTransactionsResponse.cs
│   │       └── ImportResultResponse.cs
│   └── Validators/
│       └── CreateTransactionValidator.cs
├── TransactionService.Core/
│   ├── Entities/
│   │   ├── Transaction.cs
│   │   └── CSVImportTemplate.cs
│   ├── Interfaces/
│   │   ├── ITransactionRepository.cs
│   │   ├── ITransactionService.cs
│   │   ├── ICsvParser.cs
│   │   └── IImportTemplateRepository.cs
│   └── Services/
│       ├── TransactionService.cs
│       └── CsvParserService.cs
└── TransactionService.Infrastructure/
    ├── Data/
    │   ├── TransactionDbContext.cs
    │   └── Configurations/
    │       ├── TransactionConfiguration.cs
    │       └── CSVImportTemplateConfiguration.cs
    ├── Repositories/
    │   ├── TransactionRepository.cs
    │   └── ImportTemplateRepository.cs
    └── Messaging/
        └── Publishers/
            ├── TransactionCreatedPublisher.cs
            └── TransactionsBulkImportedPublisher.cs
```

#### 3.2.4 AI Service

```
AIService/
├── AIService.API/
│   ├── Controllers/
│   │   ├── InsightsController.cs
│   │   └── AnalyticsController.cs
│   └── DTOs/
│       ├── Responses/
│       │   ├── AIInsightResponse.cs
│       │   └── CategorizationAnalyticsResponse.cs
├── AIService.Core/
│   ├── Entities/
│   │   ├── AIInsight.cs
│   │   └── CategorizationCache.cs
│   ├── Interfaces/
│   │   ├── IOpenAIClient.cs
│   │   ├── ICategorizationService.cs
│   │   └── IInsightGenerationService.cs
│   └── Services/
│       ├── OpenAICategorizationService.cs
│       └── InsightGenerationService.cs
└── AIService.Infrastructure/
    ├── Data/
    │   └── AIDbContext.cs
    ├── ExternalServices/
    │   └── OpenAIClient.cs
    └── Messaging/
        ├── Consumers/
        │   └── TransactionCreatedConsumer.cs
        └── Publishers/
            ├── TransactionCategorizedPublisher.cs
            └── InsightGeneratedPublisher.cs
```

#### 3.2.5 Budget Service

```
BudgetService/
├── BudgetService.API/
│   ├── Controllers/
│   │   └── BudgetsController.cs
│   └── DTOs/
│       ├── Requests/
│       │   ├── CreateBudgetRequest.cs
│       │   └── UpdateBudgetRequest.cs
│       └── Responses/
│           ├── BudgetResponse.cs
│           └── BudgetStatusResponse.cs
├── BudgetService.Core/
│   ├── Entities/
│   │   ├── Budget.cs
│   │   └── BudgetAlert.cs
│   ├── Interfaces/
│   │   ├── IBudgetRepository.cs
│   │   ├── IBudgetService.cs
│   │   └── IBudgetMonitoringService.cs
│   └── Services/
│       ├── BudgetService.cs
│       └── BudgetMonitoringService.cs
└── BudgetService.Infrastructure/
    ├── Data/
    │   └── BudgetDbContext.cs
    ├── Repositories/
    │   └── BudgetRepository.cs
    ├── BackgroundJobs/
    │   └── BudgetMonitoringJob.cs
    └── Messaging/
        ├── Consumers/
        │   ├── TransactionCreatedConsumer.cs
        │   └── TransactionCategorizedConsumer.cs
        └── Publishers/
            └── BudgetAlertTriggeredPublisher.cs
```

#### 3.2.6 Notification Service

```
NotificationService/
├── NotificationService.API/
│   ├── Controllers/
│   │   ├── NotificationsController.cs
│   │   └── PreferencesController.cs
│   └── DTOs/
│       ├── Requests/
│       │   └── UpdatePreferencesRequest.cs
│       └── Responses/
│           ├── NotificationResponse.cs
│           └── PreferencesResponse.cs
├── NotificationService.Core/
│   ├── Entities/
│   │   ├── Notification.cs
│   │   ├── NotificationPreferences.cs
│   │   └── EmailLog.cs
│   ├── Interfaces/
│   │   ├── INotificationRepository.cs
│   │   ├── INotificationService.cs
│   │   ├── IEmailSender.cs
│   │   └── IEmailTemplateService.cs
│   └── Services/
│       ├── NotificationService.cs
│       └── EmailTemplateService.cs
└── NotificationService.Infrastructure/
    ├── Data/
    │   └── NotificationDbContext.cs
    ├── Repositories/
    │   └── NotificationRepository.cs
    ├── ExternalServices/
    │   └── SendGridEmailSender.cs
    └── Messaging/
        └── Consumers/
            ├── BudgetAlertTriggeredConsumer.cs
            └── InsightGeneratedConsumer.cs
```

---

## 4. Frontend Structure

```
frontend/
├── public/                           # Static assets
│   ├── index.html                   # HTML template
│   ├── favicon.ico                  # Favicon
│   └── robots.txt                   # SEO robots file
│
├── src/
│   ├── assets/                      # Static assets (images, fonts)
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/                  # React components (feature-based)
│   │   ├── common/                 # Shared components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── MainLayout/
│   │   │
│   │   ├── auth/                   # Authentication components
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── LoginForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── RegisterForm/
│   │   │   └── ProtectedRoute/
│   │   │
│   │   ├── transactions/           # Transaction components
│   │   │   ├── TransactionList/
│   │   │   ├── TransactionForm/
│   │   │   ├── TransactionFilters/
│   │   │   ├── CsvImportWizard/
│   │   │   └── TransactionSummary/
│   │   │
│   │   ├── budgets/                # Budget components
│   │   │   ├── BudgetList/
│   │   │   ├── BudgetForm/
│   │   │   ├── BudgetProgressBar/
│   │   │   └── BudgetDashboard/
│   │   │
│   │   ├── insights/               # AI insights components
│   │   │   ├── InsightCard/
│   │   │   ├── InsightList/
│   │   │   └── SpendingChart/
│   │   │
│   │   └── notifications/          # Notification components
│   │       ├── NotificationBell/
│   │       ├── NotificationList/
│   │       └── NotificationPreferences/
│   │
│   ├── pages/                       # Page components
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── index.ts
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Transactions/
│   │   ├── Budgets/
│   │   ├── Insights/
│   │   ├── Settings/
│   │   └── NotFound/
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useBudgets.ts
│   │   ├── useInsights.ts
│   │   └── useNotifications.ts
│   │
│   ├── services/                    # API services
│   │   ├── api.service.ts          # Base API client
│   │   ├── auth.service.ts         # Auth API calls
│   │   ├── transactions.service.ts # Transaction API calls
│   │   ├── budgets.service.ts      # Budget API calls
│   │   ├── insights.service.ts     # Insights API calls
│   │   └── notifications.service.ts # Notification API calls
│   │
│   ├── stores/                      # Zustand stores
│   │   ├── auth.store.ts           # Auth state
│   │   ├── ui.store.ts             # UI state (modals, toasts)
│   │   └── preferences.store.ts    # User preferences
│   │
│   ├── types/                       # TypeScript types/interfaces
│   │   ├── user.types.ts
│   │   ├── transaction.types.ts
│   │   ├── budget.types.ts
│   │   ├── insight.types.ts
│   │   ├── notification.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                       # Utility functions
│   │   ├── format.util.ts          # Formatting helpers
│   │   ├── validation.util.ts      # Validation helpers
│   │   ├── date.util.ts            # Date helpers
│   │   └── currency.util.ts        # Currency helpers
│   │
│   ├── constants/                   # Constants
│   │   ├── routes.ts               # Route constants
│   │   ├── api.ts                  # API endpoint constants
│   │   └── app.ts                  # App constants
│   │
│   ├── styles/                      # Global styles
│   │   ├── theme.ts                # MUI theme
│   │   ├── global.css              # Global CSS
│   │   └── variables.css           # CSS variables
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Application entry point
│   ├── router.tsx                   # Router configuration
│   └── vite-env.d.ts               # Vite type definitions
│
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── package.json                     # NPM dependencies
├── package-lock.json                # NPM lock file
└── README.md                        # Frontend README
```

---

## 5. Shared Code Structure

```
shared/
├── BudgetCoach.Contracts/           # C# message contracts
│   ├── Events/
│   │   ├── UserRegisteredEvent.cs
│   │   ├── TransactionCreatedEvent.cs
│   │   ├── TransactionCategorizedEvent.cs
│   │   ├── BudgetAlertTriggeredEvent.cs
│   │   └── InsightGeneratedEvent.cs
│   └── BudgetCoach.Contracts.csproj
│
├── BudgetCoach.Common/              # C# shared utilities
│   ├── Extensions/
│   │   ├── StringExtensions.cs
│   │   └── DateTimeExtensions.cs
│   ├── Helpers/
│   │   └── CurrencyHelper.cs
│   └── BudgetCoach.Common.csproj
│
└── types/                           # TypeScript shared types
    ├── events.types.ts              # Event types
    └── common.types.ts              # Common types
```

---

## 6. Infrastructure Structure

```
infrastructure/
├── docker/                          # Dockerfiles
│   ├── backend.Dockerfile          # Multi-stage .NET Dockerfile
│   ├── frontend.Dockerfile         # Multi-stage Node Dockerfile
│   └── nginx.Dockerfile            # Custom Nginx image
│
├── nginx/                           # Nginx configuration
│   ├── nginx.conf                  # Main Nginx config
│   ├── nginx.dev.conf              # Development config
│   └── nginx.prod.conf             # Production config
│
├── postgres/                        # PostgreSQL scripts
│   ├── init-databases.sql          # Create all databases
│   └── seed-data.sql               # Optional seed data
│
├── rabbitmq/                        # RabbitMQ configuration
│   └── definitions.json            # Exchange/queue definitions
│
├── prometheus/                      # Prometheus configuration
│   ├── prometheus.yml              # Scrape configuration
│   └── alerts.yml                  # Alert rules
│
├── grafana/                         # Grafana configuration
│   ├── dashboards/                 # Dashboard JSON files
│   │   ├── system-overview.json
│   │   ├── api-performance.json
│   │   ├── rabbitmq.json
│   │   └── business-metrics.json
│   └── datasources/                # Data source definitions
│       └── prometheus.yml
│
└── scripts/                         # Deployment/utility scripts
    ├── deploy.sh                   # Deployment script
    ├── backup.sh                   # Backup script
    ├── restore.sh                  # Restore script
    └── seed-test-data.sh           # Test data seeding
```

---

## 7. Testing Structure

```
tests/
├── IntegrationTests/                # Integration tests
│   ├── UserService.IntegrationTests/
│   │   ├── AuthenticationTests.cs
│   │   ├── UserProfileTests.cs
│   │   └── TestFixture.cs
│   ├── TransactionService.IntegrationTests/
│   │   ├── TransactionCrudTests.cs
│   │   ├── CsvImportTests.cs
│   │   └── TestFixture.cs
│   └── EventFlow.IntegrationTests/
│       ├── TransactionCategorizationFlowTests.cs
│       └── BudgetAlertFlowTests.cs
│
├── E2ETests/                        # End-to-end tests (Playwright)
│   ├── specs/
│   │   ├── auth.spec.ts
│   │   ├── transactions.spec.ts
│   │   ├── budgets.spec.ts
│   │   └── csv-import.spec.ts
│   ├── fixtures/
│   │   └── test-data.csv
│   ├── helpers/
│   │   └── auth.helper.ts
│   └── playwright.config.ts
│
└── PerformanceTests/                # Performance tests (k6)
    ├── scenarios/
    │   ├── load-test.js
    │   ├── stress-test.js
    │   └── spike-test.js
    └── k6.config.js
```

---

## 8. Documentation Structure

```
docs/
├── architecture/                    # Architecture documentation (sharded)
│   ├── coding-standards.md         # Coding standards
│   ├── tech-stack.md               # Technology stack details
│   └── source-tree.md              # This document
│
├── stories/                         # User stories
│   ├── STORIES-INDEX.md            # Story index
│   ├── epic-01-foundation-setup.md
│   ├── epic-02-user-service-authentication.md
│   ├── epic-03-api-gateway.md
│   ├── epic-04-transaction-crud.md
│   ├── epic-05-csv-import.md
│   ├── epic-06-ai-categorization.md
│   ├── epic-07-ai-insights.md
│   ├── epic-08-budget-service.md
│   ├── epic-09-notification-service.md
│   ├── epic-10-event-integration.md
│   ├── epic-11-frontend-polish.md
│   ├── epic-12-testing-quality.md
│   ├── epic-13-deployment-devops.md
│   └── epic-14-documentation-beta.md
│
├── qa/                              # QA documentation
│   ├── test-plan.md
│   ├── bug-reports/
│   └── test-results/
│
├── api/                             # API documentation
│   ├── openapi.yaml                # OpenAPI specification
│   └── postman-collection.json     # Postman collection
│
├── runbooks/                        # Operational runbooks
│   ├── deployment.md
│   ├── monitoring.md
│   └── incident-response.md
│
├── idea.md                          # Initial project idea
├── brief.md                         # Project brief
├── prd.md                           # Product requirements document
├── architecture.md                  # Main architecture document
├── implementation-plan.md           # Implementation plan
├── deployment-plan.md               # Deployment plan
└── test-plan.md                     # Test plan
```

---

## 9. File Naming Conventions

### 9.1 Backend (C#)

```
✅ CORRECT:
UserService.cs                       # PascalCase for classes
IUserRepository.cs                   # I-prefix for interfaces
CreateUserRequest.cs                 # PascalCase for DTOs
UserConfiguration.cs                 # EF configuration
20250106_CreateUsersTable.cs         # Migration with timestamp

❌ INCORRECT:
userService.cs                       # camelCase
user_service.cs                      # snake_case
user-service.cs                      # kebab-case
```

### 9.2 Frontend (TypeScript/React)

```
✅ CORRECT:
UserProfile.tsx                      # PascalCase for components
useAuth.ts                           # camelCase for hooks (use prefix)
auth.service.ts                      # camelCase with .service suffix
user.types.ts                        # camelCase with .types suffix
format.util.ts                       # camelCase with .util suffix

❌ INCORRECT:
user-profile.tsx                     # kebab-case
UserProfile.js                       # Use .tsx for React components
AuthHook.ts                          # Don't use Hook suffix
```

### 9.3 Configuration Files

```
✅ CORRECT:
docker-compose.yml                   # kebab-case
.env.example                         # kebab-case
appsettings.json                     # camelCase (convention)
```

---

## 10. Folder Organization Principles

### 10.1 Feature-Based Organization

**Frontend components organized by feature, not by type:**

```
✅ CORRECT (Feature-based):
components/
├── auth/
│   ├── LoginForm/
│   ├── RegisterForm/
│   └── ProtectedRoute/
└── transactions/
    ├── TransactionList/
    └── TransactionForm/

❌ INCORRECT (Type-based):
components/
├── forms/
│   ├── LoginForm/
│   ├── RegisterForm/
│   └── TransactionForm/
└── lists/
    └── TransactionList/
```

### 10.2 Clean Architecture Layers

**Backend services follow dependency direction:**

```
API Layer → Core Layer ← Infrastructure Layer
```

- **API** depends on **Core**
- **Infrastructure** depends on **Core**
- **Core** has no dependencies (domain-centric)

### 10.3 Colocation

**Keep related files together:**

```
✅ CORRECT:
TransactionList/
├── TransactionList.tsx              # Component
├── TransactionList.test.tsx         # Test
├── TransactionList.styles.ts        # Styles (if needed)
└── index.ts                         # Barrel export

❌ INCORRECT:
components/
├── TransactionList.tsx
tests/
└── TransactionList.test.tsx
```

### 10.4 Barrel Exports

**Use index.ts for clean imports:**

```typescript
// components/auth/LoginForm/index.ts
export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm';

// Usage
import { LoginForm } from '@/components/auth/LoginForm';
```

### 10.5 Shared Code

**Extract shared code, but don't over-abstract:**

```
✅ CORRECT:
- Wait until code is duplicated 3 times before extracting
- Extract to shared/ only when used by multiple services

❌ INCORRECT:
- Prematurely extracting code used in only one place
- Creating "utils" dumping ground
```

---

## Appendix A: Project File Examples

### A.1 .NET Solution File Structure

```xml
<!-- BudgetCoach.sln -->
Solution
├── services
│   ├── ApiGateway
│   │   └── ApiGateway.API
│   ├── UserService
│   │   ├── UserService.API
│   │   ├── UserService.Core
│   │   └── UserService.Infrastructure
│   ├── TransactionService
│   │   ├── TransactionService.API
│   │   ├── TransactionService.Core
│   │   └── TransactionService.Infrastructure
│   ├── AIService
│   ├── BudgetService
│   └── NotificationService
├── shared
│   ├── BudgetCoach.Contracts
│   └── BudgetCoach.Common
└── tests
    ├── UserService.IntegrationTests
    └── EventFlow.IntegrationTests
```

### A.2 Frontend Package.json Structure

```json
{
  "name": "budgetcoach-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

---

## Appendix B: Quick Reference

### Common Paths

```bash
# Backend service
cd services/UserService/UserService.API

# Frontend component
cd frontend/src/components/transactions/TransactionList

# Shared contracts
cd shared/BudgetCoach.Contracts/Events

# Infrastructure
cd infrastructure/docker

# Documentation
cd docs/architecture

# Tests
cd tests/IntegrationTests
```

### File Count Estimates

```
Total Files: ~500-700 files

Backend Services:     ~200-300 files (6 services × 30-50 files each)
Frontend:             ~150-200 files (components, pages, hooks, etc.)
Shared Code:          ~20-30 files
Infrastructure:       ~30-40 files
Tests:                ~80-100 files
Documentation:        ~20-30 files
Configuration:        ~20-30 files
```

---

**End of Source Tree Document**
