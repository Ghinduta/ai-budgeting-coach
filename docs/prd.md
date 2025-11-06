# AI Budgeting Coach Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Master modern software architecture patterns (microservices, event-driven design, AI integration, DevOps) through hands-on implementation
- Build a functional AI financial literacy platform that helps users gain multi-account visibility and improve financial understanding
- Deliver transparent AI coaching that explains the "why" behind spending patterns, not just the "what"
- Enable young adults (18-25) to consolidate spending across multiple accounts and build foundational financial literacy
- Create a privacy-first MVP using manual entry and CSV import (no bank API integration)
- Validate product-market fit for AI-powered financial education through 5-10 beta users actively using for 30+ days
- Demonstrate portfolio-ready microservices architecture with event-driven messaging (RabbitMQ) and full-stack implementation

### Background Context

AI Budgeting Coach addresses a critical gap in personal finance tools: the financial literacy crisis. Young adults (18-25) have the lowest financial literacy rate at 35.2%, yet 49% are eager to learn money management. Existing budgeting apps like Mint, YNAB, and Copilot provide data visualization and categorization but fail to educate users on *why* spending patterns matter or *how* to improve. This creates a cycle where users receive insights without understanding, leading to abandoned budgeting tools and persistent poor financial habits.

The platform differentiates itself through transparent, explainable AI coaching that acts as a personal financial educator rather than just a tracking tool. By consolidating multi-account visibility through CSV imports and providing educational explanations for every recommendation, the MVP serves dual purposes: validating a market need for AI financial literacy coaching while providing a production-grade learning project for mastering modern cloud-native architecture patterns.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-04 | 1.0 | Initial PRD creation based on project brief | John (PM) |

---

## Requirements

### Functional Requirements

**FR1:** Users shall register for an account using email and secure password with JWT-based authentication for login/logout sessions.

**FR2:** Users shall manually enter individual transactions specifying date, amount, merchant name, account source, and optionally a category.

**FR3:** Users shall upload and import CSV files from bank exports, with the system supporting flexible CSV parsing that can handle varying formats (different column headers, date formats, delimiters). Users shall map CSV columns to required transaction fields (date, amount, merchant, account) during the import process.

**FR3b:** Users shall be able to save CSV import mappings (column configurations) for reuse when importing from the same bank source multiple times.

**FR4:** The system shall automatically categorize transactions using AI/ML services (OpenAI API, Azure AI Services, or ML.NET) analyzing merchant names to assign standard budget categories (Dining, Groceries, Transportation, etc.).

**FR5:** The AI categorization service shall provide confidence scores for each categorization, allowing users to review and manually override AI suggestions.

**FR6:** Users shall view all transactions across all imported accounts in a single consolidated transaction list with chronological ordering.

**FR7:** Users shall filter and search transactions by date range, account source, category, and merchant name.

**FR8:** Users shall edit or delete any previously entered or imported transaction.

**FR9:** Users shall set monthly budget limits for each spending category.

**FR10:** The system shall track actual spending against budget limits in real-time, displaying visual indicators (color-coded status: on track, warning, exceeded).

**FR11:** The system shall generate budget alert notifications when users approach 80% of budget limits or exceed them.

**FR12:** The AI coaching service shall analyze spending patterns and identify trends (e.g., "dining spending increased 40% this month").

**FR13:** The AI coaching service shall provide transparent recommendations that explain both WHY a pattern occurred and HOW to improve, with specific actionable suggestions (e.g., "5 weekend brunches vs. usual 2 - consider meal prepping on Sundays").

**FR14:** The AI coaching service shall generate monthly financial summaries providing an overview of financial health and prioritized insights.

**FR15:** The AI coaching service shall provide educational explanations of financial concepts contextually within insights (e.g., explaining why tracking matters for credit building).

**FR16:** Users shall receive in-app notifications for budget alerts, spending insights, and AI coaching tips.

**FR17:** Users shall receive email notifications including weekly summaries and budget warnings.

**FR18:** Users shall customize notification preferences including frequency and notification types.

**FR19:** Users shall manage basic profile information including name, email, and preferences.

**FR20:** Users shall specify a currency (USD, RON, or EUR) for their account in user settings, with all transactions and budgets denominated in that single currency.

### Non-Functional Requirements

**NFR1:** The system shall be built using a microservices architecture with 6 core services: API Gateway (YARP), UserService, TransactionService, AIService, BudgetService, and NotificationService.

**NFR2:** Microservices shall communicate via event-driven messaging using RabbitMQ message broker for asynchronous event processing.

**NFR3:** Each microservice shall maintain its own PostgreSQL database following the database-per-service pattern.

**NFR4:** API response times shall be under 500ms for 95% of requests.

**NFR5:** Transaction events shall be processed through the RabbitMQ pipeline with sub-second latency.

**NFR6:** AI transaction categorization shall achieve greater than 80% accuracy.

**NFR7:** The system shall successfully process CSV imports containing 1,000+ transactions across various bank CSV formats without errors, using a flexible CSV parser that can adapt to different structures.

**NFR8:** The system shall maintain 99% uptime for all microservices during development and testing phases.

**NFR9:** The frontend shall be built using React 18+ with TypeScript for type safety.

**NFR10:** The backend shall be built using .NET 8 (C#) with ASP.NET Core Web API.

**NFR11:** The system shall be containerized using Docker and orchestrated via Docker Compose for MVP local deployment.

**NFR12:** The web application shall be responsive, supporting modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions) on both desktop and mobile viewports.

**NFR13:** The system shall support USD, RON (Romanian Leu), and EUR currencies for MVP, with currency set at the account level in user settings.

**NFR14:** The system shall support English language only for MVP.

**NFR15:** User passwords shall be securely hashed and stored; JWT tokens shall be used for session management.

**NFR16:** The codebase shall follow a monorepo structure with all microservices in a single repository for easier development coordination.

**NFR17:** Unit tests shall be implemented for core business logic; integration tests shall cover event flows between services.

**NFR18:** AI/ML API usage costs (OpenAI, Azure AI, etc.) shall be monitored and usage caps implemented to stay within budget constraints (~$20-50/month for MVP beta testing).

---

## User Interface Design Goals

### Overall UX Vision

The AI Budgeting Coach interface should feel like a **personal financial companion** rather than a sterile data dashboard. The design should prioritize clarity, trust, and education over complexity. Users should immediately understand their financial status at a glance while being gently guided toward deeper insights through transparent AI coaching. The experience should reduce financial anxiety by making complex financial data approachable and actionable, with AI explanations feeling conversational and supportive rather than judgmental or robotic.

Key principles:
- **Transparency first**: Every AI insight shows its reasoning
- **Education integrated**: Financial concepts explained contextually, not hidden in help docs
- **Progressive disclosure**: Simple overview → detailed insights → deep dives (user-controlled depth)
- **Trust-building**: Visual confidence indicators for AI suggestions; easy manual overrides
- **Calm, supportive tone**: Reduce money stress through encouraging, informative coaching

### Key Interaction Paradigms

1. **Dashboard-First Navigation**: Landing page shows consolidated financial snapshot (total spending across accounts, budget status, top AI insights)

2. **Conversational AI Coaching Cards**: AI insights presented as expandable cards with:
   - Headline insight (e.g., "Dining spending up 40% this month")
   - "Why this happened" explanation (e.g., "5 weekend brunches vs. usual 2")
   - "What to do" actionable suggestion (e.g., "Try meal prepping on Sundays")
   - Educational context (e.g., "Learn: How small habits compound over time")

3. **CSV Import Wizard**: Multi-step guided flow for CSV upload:
   - Step 1: Upload file
   - Step 2: Preview data with auto-detected columns
   - Step 3: Map columns to required fields (date, amount, merchant, etc.)
   - Step 4: Assign account name/currency
   - Step 5: Confirm and import (with progress indicator)

4. **Inline Editing & Override**: Click-to-edit pattern for transaction details; AI category suggestions shown with confidence % and one-click override

5. **Budget Progress Visualization**: Color-coded budget bars (green = on track, yellow = 80%+ warning, red = exceeded) with actual vs. budgeted amounts

6. **Notification Center**: Persistent notification bell icon with badge count; in-app notification panel for alerts, insights, and coaching tips

### Core Screens and Views

1. **Login/Registration Screen** - Simple email/password form with clear CTAs
2. **Dashboard (Home)** - Consolidated multi-account overview with spending totals, budget status summary, and top 3 AI coaching insights
3. **Transactions List** - All transactions across accounts with filters (date, account, category, merchant) and search
4. **Transaction Import** - CSV upload wizard with column mapping interface
5. **AI Coaching Center** - Dedicated view for all AI insights, recommendations, and monthly summaries
6. **Budget Management** - Set and edit category budgets with visual progress tracking
7. **Settings/Profile** - User profile, notification preferences, account currency selection
8. **Notification Panel** - In-app notification history and management

### Accessibility: WCAG AA

The application will meet WCAG 2.1 Level AA standards to ensure usability for users with disabilities:
- Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Keyboard navigation support for all interactive elements
- Screen reader compatibility with semantic HTML and ARIA labels
- Focus indicators for keyboard users
- No reliance on color alone to convey information (e.g., budget status uses both color and text/icons)

### Branding

**Minimalist Financial Companion Aesthetic:**
- **Color palette**: Calming, trustworthy tones - primary blue/teal (trust, stability), secondary green (positive progress), warning yellow, alert red, neutral grays
- **Typography**: Clean, readable sans-serif font (e.g., Inter, Roboto) for accessibility and modern feel
- **Iconography**: Simple, friendly icons that demystify financial concepts (avoid intimidating corporate banking imagery)
- **Tone**: Supportive and educational, never judgmental - "Here's what's happening and how to improve" vs. "You overspent again"
- **Visual hierarchy**: Clear separation between data (tables, numbers) and coaching (conversational cards with breathing room)

No existing brand guidelines; establishing fresh identity aligned with "approachable financial literacy coach" positioning.

### Target Device and Platforms: Web Responsive

**Primary:** Desktop web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Secondary:** Mobile web browsers (responsive design adapts to smaller screens)

The application will use responsive design principles to ensure usability across device sizes:
- **Desktop (1024px+)**: Multi-column layouts, side-by-side comparisons, expanded data tables
- **Tablet (768px-1023px)**: Adaptive layouts with collapsible sidebars
- **Mobile (320px-767px)**: Single-column stacked layouts, hamburger menus, touch-optimized controls

No native mobile apps for MVP; web-first approach allows single codebase serving all devices.

---

## Technical Assumptions

This section documents all technical decisions that will guide the Architecture team. These choices are based on the project's dual goals: (1) mastering modern software architecture patterns and (2) building a functional MVP for market validation.

### Repository Structure: Monorepo

**Decision:** All microservices, frontend, and shared libraries will reside in a single Git repository.

**Rationale:**
- Simplified dependency management and versioning across services
- Easier coordination of cross-service changes during development
- Single CI/CD pipeline configuration
- Better suited for solo developer or small team
- Atomic commits across multiple services when needed

**Impact on Architect:** Design folder structure that clearly separates services while maintaining monorepo benefits (e.g., `/services/user-service`, `/services/transaction-service`, `/frontend`, `/shared`).

### Service Architecture: Event-Driven Microservices

**Decision:** Build 6 independent microservices communicating via event-driven messaging patterns.

**Core Services:**
1. **API Gateway** - Single entry point using YARP (Yet Another Reverse Proxy)
2. **UserService** - Authentication, user profiles, account settings
3. **TransactionService** - Transaction CRUD, CSV import, multi-account management
4. **AIService** - Transaction categorization, spending analysis, coaching insights generation
5. **BudgetService** - Budget management, tracking, alert generation
6. **NotificationService** - In-app and email notification delivery

**Communication Patterns:**
- **Synchronous:** Frontend → API Gateway → Services (REST APIs)
- **Asynchronous:** Service-to-service via RabbitMQ message broker
- **Event Examples:**
  - `TransactionCreated` → AIService (categorize), BudgetService (update tracking)
  - `BudgetThresholdExceeded` → NotificationService (send alert)
  - `AIInsightGenerated` → NotificationService (notify user)

**Rationale:**
- Primary learning objective: hands-on microservices and event-driven architecture experience
- Demonstrates production-grade patterns (loose coupling, scalability, fault tolerance)
- Portfolio differentiation compared to monolithic applications
- RabbitMQ provides reliable async messaging with mature .NET client libraries

**Impact on Architect:**
- Design clear service boundaries and database-per-service data ownership
- Define event schema and message contracts
- Plan RabbitMQ exchange/queue topology
- Address cross-cutting concerns (logging, error handling, distributed tracing)

### Frontend Technology Stack

**Framework:** React 18+ with TypeScript

**Key Libraries/Tools:**
- **Build Tool:** Vite (fast builds, excellent DX)
- **State Management:** React Query (for server state) + Context API (for local UI state)
- **Routing:** React Router v6
- **UI Component Library:** Material-UI (MUI) - comprehensive components, good accessibility baseline
- **Form Management:** React Hook Form (performance, validation)
- **HTTP Client:** Axios (with interceptors for JWT token handling)
- **Date Handling:** date-fns (lightweight, modular)
- **CSV Parsing:** PapaParse (robust CSV parsing for import preview)

**Rationale:**
- TypeScript provides type safety and better DX for complex state management
- React Query simplifies server state, caching, and data fetching patterns
- MUI accelerates UI development with pre-built accessible components
- Vite offers significantly faster builds than Webpack/CRA

**Impact on Architect:**
- Define React project structure (feature-based vs. layer-based)
- Establish TypeScript configuration and typing conventions
- Design API client layer and error handling patterns
- Plan component hierarchy and shared component library

### Backend Technology Stack

**Framework:** .NET 8 (C#) with ASP.NET Core Web API

**Key Libraries/Patterns:**
- **ORM:** Entity Framework Core 8 for database access
- **Authentication:** ASP.NET Core Identity with JWT bearer tokens
- **Messaging:** RabbitMQ.Client or MassTransit (abstraction over RabbitMQ)
- **Validation:** FluentValidation
- **Logging:** Serilog with structured logging
- **API Documentation:** Swagger/OpenAPI (Swashbuckle)
- **Testing:** xUnit (unit tests), TestContainers (integration tests with real dependencies)

**Architectural Patterns:**
- **Clean Architecture** or **Vertical Slice Architecture** (Architect's choice per service)
- **CQRS lite** where beneficial (e.g., read vs. write models for complex queries)
- **Repository pattern** for data access abstraction
- **Mediator pattern** (MediatR) for request/response handling

**Rationale:**
- .NET 8 is current LTS with excellent performance and modern C# features
- Entity Framework Core simplifies database operations while allowing raw SQL when needed
- MassTransit provides higher-level abstractions for RabbitMQ (sagas, retries, etc.)
- Serilog enables structured logging compatible with modern observability tools

**Impact on Architect:**
- Choose between Clean Architecture (more ceremony, clear separation) vs. Vertical Slice (feature-focused, less boilerplate)
- Design database schema and EF Core entity models per service
- Define messaging contracts and event handling patterns
- Establish error handling, validation, and logging conventions

### Data Layer

**Database:** PostgreSQL 16+ (one database per microservice)

**Database-per-Service Pattern:**
- Each microservice owns its data and schema
- No direct cross-service database queries
- Data synchronization via events when needed

**Rationale:**
- PostgreSQL is robust, open-source, excellent JSON support (useful for flexible CSV metadata storage)
- Database-per-service enforces service boundaries and supports independent scaling
- Avoids distributed transaction complexity for MVP (eventual consistency acceptable)

**Impact on Architect:**
- Design schema for each service's database
- Plan data migration strategy (EF Core migrations)
- Handle eventual consistency scenarios (e.g., AI categorization updates transaction record)
- Consider read models or materialized views for multi-account consolidated queries

### AI/ML Integration

**Primary Option:** OpenAI API (GPT-4 or GPT-3.5-turbo for categorization and coaching)

**Alternative Options:**
- Azure OpenAI Service (if Azure infrastructure chosen)
- Azure AI Language Services (for categorization only)
- ML.NET with local models (cost-saving fallback, lower accuracy expected)

**Decision Deferred to Architect:** Choose based on:
- Cost analysis (OpenAI pay-per-use vs. Azure commitment vs. ML.NET free but requires training)
- Accuracy requirements (>80% for categorization per NFR6)
- Latency tolerance (API calls vs. local inference)
- Coaching quality (GPT-4 likely superior for transparent explanations)

**Rationale:**
- AI API integration demonstrates modern AI/ML capabilities without requiring data science expertise
- OpenAI provides high-quality categorization and natural language generation for coaching
- Flexible provider choice allows cost optimization during MVP

**Impact on Architect:**
- Design AI service abstraction layer (swap providers without affecting other services)
- Plan prompt engineering strategy for categorization and coaching
- Implement retry logic and fallback handling for API failures
- Address API cost monitoring and rate limiting (NFR18)

### DevOps & Deployment (Two Paths - Architect to Choose)

**Option A - Azure Cloud-Native:**
- **Containerization:** Docker with Azure Container Registry (ACR)
- **Orchestration:** Docker Compose (MVP), Azure Kubernetes Service (AKS) (Phase 3)
- **Database:** Azure Database for PostgreSQL
- **Messaging:** Azure Service Bus (RabbitMQ alternative)
- **Monitoring & Logging:** Azure Monitor, Application Insights
- **CI/CD:** GitHub Actions with Azure deployment pipelines

**Option B - Self-Hosted Open Source:**
- **Containerization:** Docker with private registry or Docker Hub
- **Orchestration:** Docker Compose (MVP), Kubernetes (Phase 3)
- **Database:** Self-hosted PostgreSQL
- **Messaging:** RabbitMQ
- **Monitoring:** Prometheus + Grafana
- **Logging:** Serilog with structured logging, ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD:** GitHub Actions with self-hosted runners

**Decision Criteria for Architect:**
- **Cost:** Azure managed services vs. infrastructure management time/complexity
- **Learning Objectives:** Cloud-native patterns (Azure) vs. open-source ecosystem depth
- **Scalability Needs:** Managed scaling (Azure) vs. manual configuration
- **MVP Scope:** Both options use Docker Compose locally for MVP; choice impacts Phase 3 only

**MVP Deployment (Both Options):**
- Local development via Docker Compose
- All 6 services + PostgreSQL + RabbitMQ/Azure Service Bus running in containers
- Simple `docker-compose up` experience for development and testing

**Rationale:**
- Docker Compose sufficient for MVP validation (5-10 beta users)
- Containerization from day one eases transition to cloud deployment (Phase 3)
- Defer production infrastructure decisions until MVP validated

**Impact on Architect:**
- Create Dockerfiles for each service and frontend
- Design docker-compose.yml orchestration
- Plan environment configuration management (.env files, secrets)
- Document local development setup instructions

### Testing Requirements: Unit + Integration

**Required Testing:**
- **Unit Tests:** Core business logic in each service (xUnit + Moq/NSubstitute)
- **Integration Tests:** Event flows between services using TestContainers (real PostgreSQL, RabbitMQ)
- **API Tests:** Contract testing for REST endpoints (optional: use Postman collections or Pact)

**Manual Testing:**
- End-to-end user workflows (CSV import, AI coaching, budget alerts)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design validation (desktop, tablet, mobile)

**Out of Scope for MVP:**
- Automated E2E tests (Selenium, Playwright - defer to Phase 3)
- Performance/load testing (sufficient for 5-10 users without optimization)
- Security penetration testing (basic security hygiene only)

**Rationale:**
- Unit + integration tests provide confidence without E2E test maintenance burden
- TestContainers enable realistic integration testing with actual dependencies
- Manual testing acceptable for MVP with small user base

**Impact on Architect:**
- Design testable code (dependency injection, interface abstractions)
- Provide test helper utilities for common scenarios
- Document testing conventions and examples

### Additional Technical Assumptions and Requests

1. **Version Control & Branching:**
   - Git with GitHub repository
   - Trunk-based development or GitHub Flow (short-lived feature branches)
   - Pull request reviews required (self-review acceptable for solo dev, but practice for team habits)

2. **API Design:**
   - RESTful conventions for synchronous APIs
   - JSON payloads with clear error response formats
   - Versioned APIs (e.g., `/api/v1/transactions`) to allow future changes

3. **Security:**
   - HTTPS only (even in local development via self-signed certs or reverse proxy)
   - JWT tokens with reasonable expiration (e.g., 1 hour access token, 7-day refresh token)
   - Password requirements: minimum 8 characters, complexity rules (uppercase, lowercase, number, special char)
   - SQL injection protection via parameterized queries (EF Core handles this)
   - XSS protection via React's default escaping and Content Security Policy headers

4. **Configuration Management:**
   - Environment variables for secrets (database connections, API keys, JWT secrets)
   - `appsettings.json` for non-sensitive configuration (feature flags, service URLs)
   - `.env` files for local development (excluded from version control)

5. **Error Handling:**
   - Structured error responses with error codes, messages, and optional details
   - Centralized exception handling middleware in API Gateway and services
   - Correlation IDs for tracing requests across services

6. **CSV Import Assumptions:**
   - Support common delimiters: comma, semicolon, tab
   - Handle various date formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
   - Accommodate positive/negative amount representations (e.g., "-50.00" or "(50.00)")
   - Allow column mapping persistence (save per bank/account for reuse)

7. **AI Categorization Categories (Standard Budget Categories):**
   - Suggested categories: Groceries, Dining, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Housing, Income, Transfers, Other
   - Architect may refine based on research or user feedback

8. **Performance Considerations:**
   - Optimize for 5-10 concurrent users (MVP scope)
   - No premature optimization; focus on clean, maintainable code
   - Use indexes on frequently queried fields (user_id, transaction_date, category)
   - Consider pagination for transaction lists (default 50 per page)

9. **Documentation:**
   - README with setup instructions per service
   - OpenAPI/Swagger docs auto-generated for all APIs
   - Architecture Decision Records (ADRs) for significant technical choices
   - Inline code comments for complex business logic only (prefer self-documenting code)

10. **Internationalization (Future-Proofing):**
    - English-only for MVP, but architect should design with i18n in mind (e.g., avoid hardcoded strings in business logic, use resource files or i18n libraries)
    - Currency formatting: Use proper locale formatting for USD ($1,234.56), RON (1.234,56 lei), EUR (1.234,56 €)

---

## Epic List

Based on the MVP scope and requirements, here's the proposed epic structure for AI Budgeting Coach:

### Epic 1: Foundation & User Authentication
**Goal:** Establish project infrastructure, repository structure, containerization setup, and user authentication so users can securely register and log in to the application.

### Epic 2: Transaction Management & Multi-Account Visibility
**Goal:** Enable users to manually enter transactions and import CSV files from multiple bank accounts, providing a consolidated view of all transactions across accounts with filtering and search capabilities.

### Epic 3: AI-Powered Transaction Categorization
**Goal:** Implement AI-powered automatic transaction categorization with confidence scoring and manual override capabilities, reducing manual categorization effort while maintaining user control.

### Epic 4: Budget Tracking & Alerts
**Goal:** Allow users to set category budgets, track spending against those budgets in real-time, and receive notifications when approaching or exceeding budget limits.

### Epic 5: AI Financial Coaching & Insights
**Goal:** Deliver transparent AI-powered spending analysis, personalized recommendations with explanations of WHY patterns occur and HOW to improve, monthly financial summaries, and contextual educational content that builds user financial literacy.

---

## Epic Details

### Epic 1: Foundation & User Authentication

**Epic Goal:** Establish project infrastructure including monorepo structure, containerization with Docker Compose, all 6 microservices scaffolding, RabbitMQ messaging setup, and secure user authentication. Users can register, log in, and access a basic authenticated dashboard, demonstrating the complete stack is operational.

---

#### Story 1.1: Initialize Monorepo and Development Environment

**As a** developer,
**I want** a fully configured monorepo with all microservices scaffolded and Docker Compose orchestration,
**so that** I have a consistent development environment and foundation to build features.

**Acceptance Criteria:**

1. Monorepo structure created with folders: `/services` (6 microservices), `/frontend`, `/shared`, `/docs`
2. Each microservice initialized as .NET 8 Web API project with basic structure (Controllers, Services, Data layers)
3. Frontend initialized as React 18 + TypeScript project using Vite
4. Docker Compose file configures all 6 services + PostgreSQL + RabbitMQ with proper networking
5. Each service has a Dockerfile for containerization
6. Running `docker-compose up` successfully starts all services and dependencies
7. Each service exposes a `/health` endpoint returning 200 OK
8. README documents local setup instructions and architecture overview
9. `.gitignore` properly excludes node_modules, bin, obj, .env files
10. Git repository initialized with initial commit

---

#### Story 1.2: Configure API Gateway with Routing

**As a** frontend developer,
**I want** a single API Gateway endpoint that routes requests to appropriate microservices,
**so that** I have a unified API surface and don't need to manage multiple service URLs.

**Acceptance Criteria:**

1. API Gateway service configured using YARP (Yet Another Reverse Proxy)
2. Routes defined for all microservices: `/api/v1/users/*` → UserService, `/api/v1/transactions/*` → TransactionService, etc.
3. CORS configured to allow frontend origin (localhost:5173 for Vite dev server)
4. Gateway logs incoming requests with correlation IDs for tracing
5. Gateway handles service unavailability gracefully (503 Service Unavailable with clear error message)
6. Swagger/OpenAPI documentation accessible at `/swagger` showing all routed endpoints
7. Gateway passes authentication tokens (JWT) to downstream services via headers
8. Health check endpoint `/health` aggregates status from all services

---

#### Story 1.3: Implement User Registration

**As a** new user,
**I want** to register for an account using my email and password,
**so that** I can access the AI Budgeting Coach platform.

**Acceptance Criteria:**

1. UserService exposes POST `/api/v1/users/register` endpoint
2. Request accepts email, password, name (first/last)
3. Password validation enforces minimum 8 characters, uppercase, lowercase, number, special character
4. Email validation checks for valid email format
5. Duplicate email registration returns 409 Conflict with clear error message
6. Passwords securely hashed using ASP.NET Core Identity (bcrypt or PBKDF2)
7. User record stored in UserService PostgreSQL database with unique ID, email, hashed password, name, created timestamp
8. Successful registration returns 201 Created with user ID (no password in response)
9. Frontend registration form with email, password, confirm password, first name, last name fields
10. Frontend displays validation errors inline (password requirements, email format, passwords match)
11. Successful registration redirects to login page with success message
12. Unit tests validate password requirements and email uniqueness logic
13. Integration test verifies end-to-end registration flow with real database (TestContainers)

---

#### Story 1.4: Implement User Login and JWT Authentication

**As a** registered user,
**I want** to log in with my email and password,
**so that** I can access my personalized budgeting data.

**Acceptance Criteria:**

1. UserService exposes POST `/api/v1/users/login` endpoint
2. Request accepts email and password
3. Invalid credentials return 401 Unauthorized with generic error message (avoid revealing whether email exists)
4. Successful login returns 200 OK with JWT access token (1-hour expiration) and refresh token (7-day expiration)
5. JWT payload includes user ID, email, issued timestamp, expiration
6. JWT signed with secret key stored in environment variable (not hardcoded)
7. Frontend login form with email and password fields
8. Frontend stores JWT in memory (React state) and refresh token in httpOnly cookie or secure localStorage
9. Frontend includes JWT in Authorization header (Bearer token) for all authenticated API requests
10. Successful login redirects to dashboard
11. Login failures display error message ("Invalid email or password")
12. Unit tests validate authentication logic (correct/incorrect passwords, non-existent users)
13. Integration test verifies JWT generation and validation

---

#### Story 1.5: Implement Protected Routes and Token Validation

**As a** logged-in user,
**I want** my session to be secure and only allow access to my own data,
**so that** my financial information remains private.

**Acceptance Criteria:**

1. All microservices validate JWT tokens on protected endpoints using ASP.NET Core JWT middleware
2. Requests without valid JWT return 401 Unauthorized
3. Expired JWTs return 401 Unauthorized with clear error message
4. User ID extracted from JWT claims and used to filter data queries (users only see their own data)
5. Frontend implements protected route wrapper (React Router) that redirects unauthenticated users to login
6. Frontend handles 401 responses by clearing tokens and redirecting to login
7. API Gateway validates JWT before routing to downstream services (reduces duplicate validation)
8. Correlation ID from gateway passed through to services for request tracing
9. Unit tests validate JWT middleware behavior (valid token, expired token, missing token, tampered token)

---

#### Story 1.6: Implement User Profile Management

**As a** logged-in user,
**I want** to view and update my profile settings including currency preference,
**so that** I can configure the application to match my needs.

**Acceptance Criteria:**

1. UserService exposes GET `/api/v1/users/profile` endpoint returning user profile (name, email, currency)
2. UserService exposes PUT `/api/v1/users/profile` endpoint to update name and currency
3. Currency field accepts values: USD, RON, EUR (validated, case-insensitive)
4. Default currency is USD for new users
5. Email cannot be changed via profile update (return 400 Bad Request if attempted)
6. User profile stored in UserService database with currency field
7. Frontend Settings page displays current profile information in editable form
8. Frontend currency selection dropdown shows USD, RON, EUR options
9. Successful profile update shows success message and updates UI
10. Profile updates publish `UserProfileUpdated` event to RabbitMQ (for future use by other services)
11. Unit tests validate currency validation logic
12. Integration test verifies profile retrieval and update flow

---

#### Story 1.7: Build Basic Dashboard Landing Page

**As a** logged-in user,
**I want** to see a dashboard landing page after login,
**so that** I have a home base for navigating the application (even if data is empty initially).

**Acceptance Criteria:**

1. Frontend Dashboard component renders after successful login
2. Dashboard displays welcome message with user's name
3. Dashboard shows placeholder sections for: "Total Spending" (empty state), "Budget Status" (empty state), "AI Insights" (empty state)
4. Navigation header includes: Dashboard link, Transactions link (disabled/placeholder), Budget link (disabled/placeholder), Settings link (active)
5. Empty states display friendly messages: "No transactions yet. Import your first CSV to get started!"
6. Logout button in header clears JWT and redirects to login
7. Dashboard is responsive (mobile, tablet, desktop layouts)
8. Dashboard accessible via keyboard navigation (WCAG AA)

---

#### Story 1.8: Setup Logging and Error Handling Foundation

**As a** developer,
**I want** structured logging and centralized error handling across all services,
**so that** I can debug issues and monitor application health effectively.

**Acceptance Criteria:**

1. Serilog configured in all 6 microservices with structured logging (JSON format)
2. Log levels configurable via environment variables (default: Information for production, Debug for development)
3. Logs include: timestamp, level, message, correlation ID, service name, exception details (if error)
4. Console sink configured for local development (visible in Docker Compose logs)
5. File sink configured to write logs to `/logs` directory in each container
6. Global exception handling middleware in each service catches unhandled exceptions, logs them, and returns standardized error response (500 Internal Server Error with correlation ID)
7. API validation errors return standardized 400 Bad Request with field-level error details
8. Frontend Axios interceptor catches API errors and displays user-friendly messages (avoid exposing technical details)
9. Frontend logs errors to browser console in development mode
10. All services log startup messages confirming configuration (database connection, RabbitMQ connection, etc.)

---

#### Story 1.9: Configure RabbitMQ Messaging Infrastructure

**As a** developer,
**I want** RabbitMQ messaging infrastructure configured and tested,
**so that** services can communicate asynchronously via events.

**Acceptance Criteria:**

1. RabbitMQ container running in Docker Compose with management UI accessible at http://localhost:15672
2. Shared library or NuGet package created for common messaging contracts (event classes)
3. MassTransit or RabbitMQ.Client configured in all services with connection to RabbitMQ
4. Exchange and queue naming conventions documented (e.g., `budgeting-coach.user.events` exchange)
5. Test event `ServiceStarted` published by UserService on startup and consumed by NotificationService (logs receipt)
6. Dead letter queue (DLQ) configured for failed message handling
7. Message retry policy configured (e.g., 3 retries with exponential backoff)
8. Correlation IDs propagated through event messages for tracing
9. Integration test verifies event publishing and consumption between two services
10. Documentation includes RabbitMQ architecture diagram (exchanges, queues, bindings)

---

### Epic 2: Transaction Management & Multi-Account Visibility

**Epic Goal:** Enable users to manually enter transactions and import CSV files from multiple bank accounts (ING, Revolut, others), providing a consolidated view of all transactions across accounts with filtering, searching, editing, and deletion capabilities.

---

#### Story 2.1: Implement Manual Transaction Entry

**As a** user,
**I want** to manually enter a transaction with details like date, amount, merchant, and account,
**so that** I can track expenses that aren't in CSV files (like cash purchases).

**Acceptance Criteria:**

1. TransactionService exposes POST `/api/v1/transactions` endpoint
2. Request accepts: date (ISO 8601 format), amount (decimal), merchant name (string), account name (string), optional category, optional notes
3. Amount validation: non-zero, supports positive (income/refunds) and negative (expenses) values
4. Date validation: cannot be in future (return 400 Bad Request)
5. Transaction stored in TransactionService database with: unique ID, user ID (from JWT), date, amount, merchant, account, category (nullable), notes (nullable), created timestamp, currency (from user profile - fetch from UserService or cache)
6. Successful creation returns 201 Created with transaction object
7. `TransactionCreated` event published to RabbitMQ with transaction details
8. Frontend modal/form for adding transaction with fields: date picker, amount input, merchant text input, account text input (or dropdown if accounts list available), category dropdown (optional), notes textarea
9. Frontend validates: required fields, amount is number, date is valid
10. Successful submission closes modal and refreshes transaction list
11. Unit tests validate transaction creation logic and validation rules
12. Integration test verifies transaction persisted to database and event published

---

#### Story 2.2: Build Transaction List View with Filtering

**As a** user,
**I want** to view all my transactions in a list with the ability to filter by date, account, category, and merchant,
**so that** I can review my spending history across all accounts.

**Acceptance Criteria:**

1. TransactionService exposes GET `/api/v1/transactions` endpoint with query parameters: `startDate`, `endDate`, `account`, `category`, `merchant` (all optional)
2. Results filtered by user ID (from JWT) - users only see their own transactions
3. Transactions returned in reverse chronological order (newest first)
4. Pagination supported with query params: `page` (default 1), `pageSize` (default 50, max 100)
5. Response includes: transactions array, total count, current page, total pages
6. Frontend Transactions page displays table/list with columns: Date, Merchant, Account, Category, Amount, Actions (edit/delete icons)
7. Filters UI: date range picker, account dropdown (populated from unique accounts in user's transactions), category dropdown, merchant search input
8. Applying filters updates URL query params and fetches filtered results
9. Empty state when no transactions: "No transactions found. Add your first transaction or import a CSV."
10. Responsive design: table on desktop, card list on mobile
11. Amounts display with proper currency formatting (USD: $1,234.56, RON: 1.234,56 lei, EUR: 1.234,56 €) based on user's currency setting
12. Loading state while fetching transactions
13. Unit tests validate filtering logic (date range, account, category combinations)
14. Integration test verifies pagination and filtering behavior

---

#### Story 2.3: Implement Transaction Edit and Delete

**As a** user,
**I want** to edit or delete transactions I've entered,
**so that** I can correct mistakes or remove duplicate entries.

**Acceptance Criteria:**

1. TransactionService exposes PUT `/api/v1/transactions/{id}` endpoint to update transaction
2. Request accepts same fields as creation: date, amount, merchant, account, category, notes
3. Only transaction owner (user ID from JWT matches transaction's user ID) can update; otherwise return 403 Forbidden
4. Transaction not found returns 404 Not Found
5. Successful update returns 200 OK with updated transaction object
6. `TransactionUpdated` event published to RabbitMQ
7. TransactionService exposes DELETE `/api/v1/transactions/{id}` endpoint
8. Only transaction owner can delete; otherwise return 403 Forbidden
9. Successful deletion returns 204 No Content
10. `TransactionDeleted` event published to RabbitMQ with transaction ID
11. Frontend edit icon opens modal pre-filled with transaction data
12. Frontend delete icon shows confirmation dialog ("Are you sure you want to delete this transaction?")
13. Successful edit/delete refreshes transaction list
14. Unit tests validate authorization logic (owner vs. non-owner)
15. Integration test verifies edit and delete flows with event publishing

---

#### Story 2.4: Design CSV Import Wizard UI

**As a** user,
**I want** a guided wizard to upload and configure CSV imports,
**so that** I can easily import transactions from different banks despite varying CSV formats.

**Acceptance Criteria:**

1. Frontend "Import CSV" button navigates to multi-step wizard
2. **Step 1: Upload File** - File input accepts .csv files only, displays selected filename
3. **Step 2: Preview & Column Mapping** - Displays first 10 rows of CSV in table, headers detected automatically
4. **Step 2 continued:** Dropdown selectors for each required field (Date, Amount, Merchant) to map CSV columns; optional fields (Category, Notes) also mappable
5. **Step 2 continued:** Date format selector (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY) to parse dates correctly
6. **Step 2 continued:** Amount format handling: detect positive/negative representation (e.g., negative sign, parentheses)
7. **Step 3: Account Details** - Input for account name (e.g., "ING Checking"), non-editable currency display (user's profile currency)
8. **Step 4: Review & Import** - Summary showing: file name, row count, account name, column mappings; "Import" button to proceed
9. Progress indicator shows current step (1 of 4, 2 of 4, etc.)
10. "Back" and "Next" buttons navigate between steps; "Cancel" button exits wizard
11. Wizard validates: file uploaded, required columns mapped, account name provided
12. Responsive design adapts wizard layout for mobile
13. No backend calls yet (Story 2.5 implements backend processing)

---

#### Story 2.5: Implement CSV Upload and Parsing Backend

**As a** user,
**I want** the system to process my uploaded CSV and import transactions,
**so that** I don't have to manually enter hundreds of transactions.

**Acceptance Criteria:**

1. TransactionService exposes POST `/api/v1/transactions/import` endpoint accepting multipart form data: CSV file, column mapping configuration (JSON), account name, date format
2. Backend validates file is .csv, size limit (e.g., 10MB max)
3. Backend parses CSV using flexible parser (handles comma, semicolon, tab delimiters automatically)
4. For each row: extract date (parse using provided format), amount (parse as decimal, handle negative representations), merchant, optional category/notes using column mappings
5. Transactions created with user ID from JWT, account name from request, currency from user profile
6. Skip rows with invalid data (log warning, continue processing); collect errors to return in response
7. Bulk insert transactions into database (optimized for 1,000+ rows per NFR7)
8. Publish `TransactionsBulkImported` event to RabbitMQ with count, account name, user ID
9. Response includes: total rows processed, successful imports count, failed rows with error messages
10. Frontend displays import results: "Successfully imported 487 of 500 transactions. 13 rows failed due to invalid data. View errors."
11. Failed rows shown in expandable section with row number and error reason
12. Successful import redirects to Transactions list showing newly imported data
13. Unit tests validate CSV parsing logic with various formats (comma/semicolon, different date formats, positive/negative amounts)
14. Integration test imports sample ING and Revolut CSVs end-to-end

---

#### Story 2.6: Implement CSV Mapping Template Save/Reuse

**As a** user,
**I want** to save my CSV column mapping configuration for a specific bank,
**so that** I don't have to remap columns every time I import from the same bank.

**Acceptance Criteria:**

1. During CSV import Step 3 (Account Details), checkbox option "Save this mapping as a template" with name input (e.g., "ING Checking Template")
2. TransactionService exposes POST `/api/v1/transactions/import-templates` endpoint accepting: template name, column mappings, date format, account name (optional)
3. Template stored in database with user ID (templates are user-specific)
4. TransactionService exposes GET `/api/v1/transactions/import-templates` endpoint returning user's saved templates
5. In CSV import wizard Step 1, dropdown "Use saved template" displays user's templates
6. Selecting template auto-populates column mappings and date format in Step 2, account name in Step 3
7. User can still modify mappings after loading template (overrides for one-time use or update template)
8. TransactionService exposes DELETE `/api/v1/transactions/import-templates/{id}` to delete template
9. Frontend Settings page shows "Saved Import Templates" section with list of templates and delete button
10. Unit tests validate template CRUD operations
11. Integration test verifies template save and reuse flow

---

#### Story 2.7: Display Multi-Account Consolidated View on Dashboard

**As a** user,
**I want** to see total spending across all my accounts on the dashboard,
**so that** I understand my overall financial situation at a glance.

**Acceptance Criteria:**

1. Dashboard fetches summary data from TransactionService via new GET `/api/v1/transactions/summary` endpoint
2. Summary endpoint returns: total spending (sum of negative transactions) for current month, total income (sum of positive transactions), net cash flow, transaction count, list of unique accounts with per-account totals
3. Dashboard displays cards/widgets:
   - "Total Spending This Month" with amount in user's currency
   - "Income This Month" with amount
   - "Net Cash Flow" with amount (green if positive, red if negative)
   - "Accounts" list showing each account name and its balance/spending
4. Clicking account name filters transaction list to that account
5. Date range selector on dashboard (default: current month) allows viewing different periods
6. Empty state when no transactions: "Import your first CSV or add transactions to see your financial summary"
7. Real-time updates: after importing CSV or adding transaction, dashboard refreshes automatically
8. Summary data cached for 1 minute to reduce database queries (acceptable staleness for dashboard)
9. Unit tests validate summary calculation logic (spending, income, net flow)
10. Integration test verifies multi-account summary accuracy with sample data

---

### Epic 3: AI-Powered Transaction Categorization

**Epic Goal:** Implement AI-powered automatic transaction categorization using OpenAI, Azure AI, or ML.NET services, displaying confidence scores and allowing users to manually override suggestions, reducing manual categorization effort while maintaining control.

---

#### Story 3.1: Setup AI Service Integration

**As a** developer,
**I want** the AIService configured to communicate with an AI/ML provider (OpenAI, Azure AI, or ML.NET),
**so that** we can leverage AI models for transaction categorization and coaching.

**Acceptance Criteria:**

1. AIService configured with abstraction layer for AI provider (interface/adapter pattern to allow swapping providers)
2. **Option A - OpenAI API:** OpenAI client library with API key from environment variable
3. **Option B - Azure OpenAI Service:** Azure SDK with endpoint and key from environment variables
4. **Option C - Azure AI Language Services:** Azure AI client for categorization only
5. **Option D - ML.NET:** Local model inference (fallback option, lower cost)
6. AIService exposes internal method `CategorizeMerchant(merchantName)` that calls configured AI provider
7. Prompt engineering (for GPT-based options): "Categorize the following merchant into one category: [list of categories]. Merchant: {merchantName}. Respond with only the category name and confidence score (0-100)."
8. Standard categories defined: Groceries, Dining, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Housing, Income, Transfers, Other
9. AI response parsed to extract category and confidence score
10. Retry logic implemented for API failures (3 retries with exponential backoff)
11. Fallback behavior: if AI provider fails after retries, assign "Other" category with 0% confidence
12. API usage logged (request count, tokens used for API providers, inference time for ML.NET) for cost monitoring
13. Configuration setting in environment variables specifies which provider to use (allows switching without code changes)
14. Unit tests mock AI provider responses to validate parsing logic (provider-agnostic tests)
15. Integration test makes actual AI call to verify end-to-end (use test credentials with low rate limits)

---

#### Story 3.2: Implement Automatic Categorization on Transaction Creation

**As a** user,
**I want** newly created transactions to be automatically categorized by AI,
**so that** I don't have to manually categorize every transaction.

**Acceptance Criteria:**

1. AIService subscribes to `TransactionCreated` event from RabbitMQ
2. On receiving event, AIService calls `CategorizeMerchant(merchantName)` to get category and confidence
3. AIService publishes `TransactionCategorized` event with: transaction ID, category, confidence score
4. TransactionService subscribes to `TransactionCategorized` event and updates transaction record with category and confidence score
5. Manual transactions created via UI show "Categorizing..." indicator while AI processes
6. Once categorized, transaction list updates to show AI-assigned category with confidence badge (e.g., "Dining 92%")
7. CSV imports trigger bulk categorization: AIService processes all imported transactions asynchronously
8. Progress indicator during CSV import shows "Importing transactions... Categorizing with AI..."
9. Categorization failures (API errors) leave category null and log error; user can manually categorize later
10. Unit tests validate event handling logic
11. Integration test verifies end-to-end categorization flow: create transaction → event published → AI categorizes → category updated

---

#### Story 3.3: Display AI Confidence Scores and Manual Override UI

**As a** user,
**I want** to see how confident the AI is in each categorization and easily override incorrect categories,
**so that** I can trust the categorizations and correct mistakes.

**Acceptance Criteria:**

1. Transaction list displays category with confidence badge:
   - High confidence (80-100%): green badge "Dining 95%"
   - Medium confidence (50-79%): yellow badge "Shopping 65%"
   - Low confidence (0-49%): red badge "Other 20%"
2. Clicking category badge opens inline category dropdown to change category
3. Selecting new category from dropdown updates transaction immediately (PUT `/api/v1/transactions/{id}`)
4. Manual override sets confidence to 100% and marks category source as "User" (vs. "AI")
5. `TransactionCategorized` event published with `source: "User"` to indicate manual override
6. AIService learns from overrides: when same merchant appears again, check if user previously overrode AI suggestion; if so, use user's category (future story: implement simple learning cache)
7. Frontend shows tooltip on confidence badge explaining: "AI confidence in this categorization. You can click to change."
8. Uncategorized transactions (null category) show "Uncategorized" badge in gray with warning icon
9. Bulk categorization action on transaction list: select multiple transactions, assign category to all at once
10. Settings page shows AI categorization toggle (on/off) - if off, transactions remain uncategorized until manual assignment
11. Unit tests validate confidence score display logic and threshold colors
12. Integration test verifies manual override updates transaction and publishes event

---

#### Story 3.4: Implement Categorization Analytics and Accuracy Tracking

**As a** developer/product owner,
**I want** to track AI categorization accuracy and performance metrics,
**so that** we can validate we're meeting NFR6 (>80% accuracy) and optimize the AI service.

**Acceptance Criteria:**

1. AIService logs categorization attempts with: transaction ID, merchant name, AI category, confidence, timestamp, tokens used
2. AIService tracks user overrides: when user changes category, log original AI category vs. user's choice
3. Admin/analytics endpoint GET `/api/v1/ai/analytics` returns:
   - Total categorizations performed
   - Average confidence score
   - Accuracy rate (% of AI categories not overridden by users - proxy for accuracy)
   - Total AI API calls and estimated cost
   - Most frequently overridden categories (indicates AI weakness areas)
4. Dashboard for developers (simple page, not user-facing) displays these metrics
5. Alert if accuracy drops below 75% (threshold for concern before hitting NFR6 requirement)
6. Cost monitoring: alert if AI spending exceeds $50/month (NFR18 budget limit)
7. Logs exportable to CSV for deeper analysis
8. Unit tests validate accuracy calculation logic
9. Integration test verifies analytics data collection over multiple categorizations

---

### Epic 4: Budget Tracking & Alerts

**Epic Goal:** Allow users to set monthly budget limits for each spending category, track spending against those budgets in real-time with visual progress indicators, and receive in-app and email notifications when approaching or exceeding budget limits.

---

#### Story 4.1: Implement Budget Creation and Management

**As a** user,
**I want** to set monthly budget limits for different spending categories,
**so that** I can plan and control my spending in each area.

**Acceptance Criteria:**

1. BudgetService exposes POST `/api/v1/budgets` endpoint accepting: category, monthly limit (decimal), start date (defaults to current month)
2. One budget per category per month (user cannot create duplicate budgets for same category and month; return 409 Conflict)
3. Budget stored in BudgetService database with: unique ID, user ID (from JWT), category, limit amount, month/year, created timestamp
4. BudgetService exposes GET `/api/v1/budgets` endpoint returning user's active budgets for current month
5. BudgetService exposes PUT `/api/v1/budgets/{id}` to update budget limit
6. BudgetService exposes DELETE `/api/v1/budgets/{id}` to delete budget
7. Frontend Budget Management page displays list of categories with budget input fields
8. Categories without budgets show "Set Budget" button; categories with budgets show current limit and "Edit" button
9. Editing budget opens inline input to change limit amount; save button updates budget
10. Frontend validates budget limit is positive number
11. Budget changes publish `BudgetUpdated` event to RabbitMQ
12. Unit tests validate budget CRUD operations and uniqueness constraint
13. Integration test verifies budget creation and retrieval flow

---

#### Story 4.2: Implement Real-Time Budget Tracking

**As a** user,
**I want** to see how much I've spent versus my budget for each category,
**so that** I know if I'm on track or overspending.

**Acceptance Criteria:**

1. BudgetService subscribes to `TransactionCreated`, `TransactionUpdated`, `TransactionDeleted`, `TransactionCategorized` events from RabbitMQ
2. On receiving transaction events, BudgetService recalculates spending for affected category and month
3. BudgetService maintains aggregated spending data: for each user + category + month, store total spent (sum of transaction amounts)
4. BudgetService exposes GET `/api/v1/budgets/status` endpoint returning for each budget:
   - Category name
   - Budget limit
   - Amount spent (calculated from transactions)
   - Remaining amount (limit - spent)
   - Percentage used (spent / limit * 100)
   - Status: "On Track" (< 80%), "Warning" (80-99%), "Exceeded" (>= 100%)
5. Frontend Budget page displays progress bars for each budget:
   - Green bar (0-79% used): "On Track"
   - Yellow bar (80-99% used): "Warning - 85% of budget used"
   - Red bar (100%+ used): "Exceeded by $50"
6. Progress bars animate and update in real-time when transactions added/edited
7. Tooltip on hover shows exact amounts: "Spent $450 of $500 budget. $50 remaining."
8. Dashboard widget shows top 3 budget statuses (prioritize exceeded/warning budgets)
9. Categories without budgets show "No budget set" in gray
10. Unit tests validate spending calculation logic (including transaction updates/deletions)
11. Integration test verifies budget tracking updates correctly when transactions change

---

#### Story 4.3: Implement Budget Alert Notifications (In-App)

**As a** user,
**I want** to receive notifications when I'm approaching or exceeding my budget limits,
**so that** I can adjust my spending before it's too late.

**Acceptance Criteria:**

1. BudgetService detects threshold crossing: when spending reaches 80% of budget, publish `BudgetThresholdWarning` event; when spending exceeds 100%, publish `BudgetExceeded` event
2. Events include: user ID, category, budget limit, amount spent, percentage, threshold type (warning/exceeded)
3. NotificationService subscribes to budget alert events
4. NotificationService creates in-app notification record in database: user ID, notification type (budget alert), title, message, timestamp, read status (default: unread)
5. Notification title examples: "Budget Warning: Dining", "Budget Exceeded: Shopping"
6. Notification message examples: "You've spent $420 of your $500 Dining budget (84%).", "You've exceeded your Shopping budget by $75."
7. NotificationService exposes GET `/api/v1/notifications` endpoint returning user's notifications (newest first), with optional `unread=true` filter
8. Frontend notification bell icon in header shows badge with unread count
9. Clicking bell opens notification panel displaying notifications with timestamp
10. Clicking notification marks it as read (PUT `/api/v1/notifications/{id}/read`)
11. Notification panel includes "Mark all as read" action
12. Notifications auto-refresh every 30 seconds when panel is open
13. Real-time notification: when new alert created, frontend polls or uses simple refresh (WebSocket not required for MVP)
14. Unit tests validate threshold detection logic (edge cases: exactly 80%, exactly 100%)
15. Integration test verifies end-to-end alert flow: transaction pushes spending over threshold → event published → notification created → frontend retrieves

---

#### Story 4.4: Implement Budget Alert Email Notifications

**As a** user,
**I want** to receive email notifications for budget alerts,
**so that** I'm notified even when I'm not actively using the app.

**Acceptance Criteria:**

1. NotificationService configured with SMTP client (use service like SendGrid, Mailgun, or SMTP relay)
2. SMTP credentials stored in environment variables
3. On receiving budget alert events, NotificationService sends email to user's registered email address
4. Email subject: "AI Budgeting Coach: Budget Warning for [Category]" or "Budget Exceeded for [Category]"
5. Email body (HTML template):
   - Friendly greeting with user's name
   - Alert message matching in-app notification
   - Current budget status (spent vs. limit)
   - Call-to-action button "View Budget Dashboard" linking to app
   - Footer with unsubscribe preference link
6. Email sending is asynchronous (non-blocking; failures logged but don't block notification creation)
7. Retry logic for email failures (3 attempts)
8. User Settings page includes notification preferences: toggle for email notifications on/off (default: on)
9. NotificationService checks user preferences before sending email
10. Weekly summary email (separate story): digest of all budget statuses (deferred to future epic)
11. Unit tests mock email client to validate email content generation
12. Integration test sends test email to verify SMTP configuration (manual verification)

---

### Epic 5: AI Financial Coaching & Insights

**Epic Goal:** Deliver the product's key differentiator - transparent AI-powered spending analysis, personalized recommendations with explanations of WHY patterns occur and HOW to improve, monthly financial summaries, and contextual educational content that builds user financial literacy.

---

#### Story 5.1: Implement Spending Pattern Analysis

**As a** user,
**I want** AI to analyze my spending patterns and identify trends,
**so that** I understand how my spending behavior changes over time.

**Acceptance Criteria:**

1. AIService exposes internal method `AnalyzeSpendingPatterns(userId, month)` that retrieves user's transactions for specified month and previous month
2. Analysis calculates for each category:
   - Current month total spending
   - Previous month total spending
   - Percentage change (increase/decrease)
   - Frequency change (number of transactions this month vs. last month)
3. AIService identifies "notable patterns" based on thresholds:
   - Significant increase: >20% increase in category spending
   - Significant decrease: >20% decrease
   - New category: spending in category that had $0 previous month
   - Abandoned category: $0 spending in category that had spending last month
4. Patterns stored in AIService database as "insights" records: user ID, insight type (pattern), category, data (JSON with details), timestamp
5. AIService exposes GET `/api/v1/ai/insights` endpoint returning user's insights for current month
6. Unit tests validate pattern detection logic with sample transaction data
7. Integration test verifies pattern analysis with realistic multi-month transaction data

---

#### Story 5.2: Generate Transparent AI Recommendations with Explanations

**As a** user,
**I want** AI recommendations that explain WHY a pattern occurred and HOW I can improve,
**so that** I learn from my spending and make better financial decisions.

**Acceptance Criteria:**

1. AIService calls configured AI provider (GPT-4, Azure OpenAI, or similar LLM) with prompt: "Analyze this spending pattern: [pattern details]. Provide: 1) WHY this happened (root cause analysis), 2) HOW to improve (specific actionable suggestion), 3) Educational context (financial concept explanation). Be transparent, supportive, and concise."
2. *Note: This story requires LLM capabilities (GPT-4 or Azure OpenAI); ML.NET alone insufficient for natural language generation quality*
3. AI response parsed into structured recommendation: pattern summary, "Why" explanation, "How" suggestion, educational context
4. Example output for "Dining up 40%":
   - **Pattern:** "Your Dining spending increased by 40% this month ($600 vs. $430 last month)."
   - **Why:** "You had 5 weekend brunches this month compared to your usual 2. Weekend dining tends to be more expensive than weekday meals."
   - **How:** "Consider meal prepping on Sundays to reduce the temptation for weekend restaurant meals. Even replacing 2 brunches saves ~$60/month."
   - **Learn:** "Small recurring expenses compound quickly. A $30 brunch weekly = $1,560/year. Redirecting just half of that to savings builds a $780 emergency fund."
5. Recommendations stored in insights database with type "recommendation"
6. AIService generates recommendations for top 3 most significant patterns each month
7. Recommendations include confidence level (based on data quality: more months of history = higher confidence)
8. Unit tests validate prompt engineering and response parsing
9. Integration test generates recommendation from actual pattern and verifies structure

---

#### Story 5.3: Build AI Coaching Center UI

**As a** user,
**I want** a dedicated page to view all my AI insights and recommendations,
**so that** I can review coaching in one place and learn from explanations.

**Acceptance Criteria:**

1. Frontend "AI Coaching" page accessible from main navigation
2. Page displays insights as expandable cards, sorted by importance (exceeded budgets, significant increases, new patterns)
3. Each card shows:
   - **Headline:** Pattern summary (e.g., "Dining Spending Up 40%")
   - **Confidence badge:** High/Medium/Low based on AI confidence
   - **Expandable sections:**
     - "Why This Happened" (collapsed by default, click to expand)
     - "What You Can Do" (collapsed)
     - "Learn More" (educational context, collapsed)
4. Cards use color coding:
   - Red: Exceeded budgets or concerning trends
   - Yellow: Warnings or moderate changes
   - Green: Positive trends (spending decreased, savings increased)
   - Blue: Educational insights (neutral)
5. Filters: "All Insights", "Recommendations", "Patterns", "This Month", "Last 3 Months"
6. Empty state when no insights: "Not enough data yet. Add more transactions to receive personalized coaching."
7. Dashboard homepage shows top 3 coaching insights as preview cards with "View All Insights" link
8. Insights marked as "viewed" when user expands sections (analytics tracking)
9. Responsive design: cards stack vertically on mobile
10. Accessibility: keyboard navigation, screen reader support for expandable sections
11. Loading state while fetching insights from AIService

---

#### Story 5.4: Generate Monthly Financial Summary

**As a** user,
**I want** a monthly summary of my overall financial health from AI,
**so that** I get a holistic view of my progress and areas to focus on.

**Acceptance Criteria:**

1. AIService scheduled job runs on 1st of each month to generate previous month's summary for all users
2. Summary includes:
   - Total income vs. total spending
   - Net cash flow (savings or deficit)
   - Top spending categories with amounts
   - Comparison to previous month (better/worse/same)
   - Top 3 wins (positive changes: reduced spending, stayed under budget)
   - Top 3 focus areas (improvements needed: exceeded budgets, increased spending)
3. Summary generated using GPT-4/LLM prompt: "Create a supportive monthly financial summary for this user: [data]. Highlight wins, identify focus areas, provide encouragement and actionable next steps."
4. Summary stored as insight type "monthly_summary"
5. Monthly summary published as `MonthlySummaryGenerated` event to RabbitMQ
6. NotificationService subscribes to event and sends email with summary
7. Email subject: "Your [Month] Financial Summary from AI Budgeting Coach"
8. Email body includes summary sections with formatting, link to view full coaching center
9. Frontend AI Coaching page displays monthly summary at top (if available for current/previous month)
10. Summary card includes download as PDF option (simple HTML-to-PDF generation)
11. Unit tests validate summary data aggregation logic
12. Integration test generates summary for test user and verifies email sent

---

#### Story 5.5: Implement Educational Context and Financial Concepts Library

**As a** user,
**I want** financial concepts explained when they're relevant to my situation,
**so that** I build financial literacy over time.

**Acceptance Criteria:**

1. AIService maintains library of financial concepts (stored as markdown or JSON): "Emergency Fund", "Compound Interest", "Budget Padding", "Lifestyle Inflation", "Sunk Cost Fallacy", etc.
2. Each concept includes: title, simple explanation (2-3 sentences), example scenario, related reading links (optional)
3. GPT-4/LLM recommendations reference concepts from library when relevant
4. Frontend "Learn More" section in coaching cards links to concept explanations
5. Settings page has "Financial Concepts Glossary" showing all available concepts with explanations
6. Glossary searchable by keyword
7. Concepts tagged by relevance: beginner, intermediate, advanced (user profile can track level)
8. AI coaching adapts tone based on user's financial literacy level (assessed via quiz or self-reported in settings - future enhancement)
9. Tooltips throughout UI explain financial terms inline (e.g., hover over "Net Cash Flow" shows definition)
10. Unit tests validate concept library retrieval
11. Integration test verifies concept linking in recommendations

---

## Checklist Results Report

### PM Requirements Checklist - Validation Report

**Date:** 2025-11-04
**PRD Version:** 1.0 (Draft)
**Reviewed By:** John (PM)

---

### Executive Summary

**Overall PRD Completeness:** 95%
**MVP Scope Appropriateness:** Just Right
**Readiness for Architecture Phase:** Ready
**Most Critical Concerns:** None blocking; minor enhancement opportunities identified

The PRD for AI Budgeting Coach is comprehensive, well-structured, and ready for the architecture phase. The document clearly defines the problem (financial literacy crisis + multi-account fragmentation), target users (young adults 18-25, families), and solution approach (transparent AI coaching). The MVP scope is appropriately focused on core value delivery (multi-account visibility + AI categorization + budget tracking + AI coaching) while explicitly excluding Phase 2 features. All 38 requirements (20 Functional, 18 Non-Functional) are mapped to 29 stories across 5 logically sequenced epics. Technical assumptions provide clear guidance for the Architect regarding microservices architecture, event-driven messaging, technology stack choices, and deployment options.

---

### Category Analysis Table

| Category                         | Status  | Critical Issues |
| -------------------------------- | ------- | --------------- |
| 1. Problem Definition & Context  | PASS    | None            |
| 2. MVP Scope Definition          | PASS    | None            |
| 3. User Experience Requirements  | PASS    | None            |
| 4. Functional Requirements       | PASS    | None            |
| 5. Non-Functional Requirements   | PASS    | None            |
| 6. Epic & Story Structure        | PASS    | None            |
| 7. Technical Guidance            | PASS    | None            |
| 8. Cross-Functional Requirements | PARTIAL | Minor: Data schema not detailed (acceptable - architect responsibility) |
| 9. Clarity & Communication       | PASS    | None            |

**Overall Status:** 8 PASS, 1 PARTIAL - Excellent readiness

---

### Critical Deficiencies

None identified. All critical aspects of the PRD are complete and well-documented.

---

### Recommendations

#### For PM (Immediate Actions)

1. ✅ **PRD is Ready** - No changes required before handoff to Architect
2. ✅ **Output PRD to docs/prd.md** - Formalize document
3. ✅ **Prepare Architect Prompt** - Create clear handoff prompt (completed in Next Steps section)
4. ✅ **Schedule Kickoff** - Align with Architect on timeline, priorities, and questions
5. 📅 **Plan Phase 2 Backlog Grooming** - Document Phase 2 features now to avoid mid-MVP scope creep

#### For Architect (Handoff Guidance)

1. **Review PRD Thoroughly** - Understand problem, users, requirements, constraints
2. **Design System Architecture** - Service boundaries, database schemas, API contracts, message flows
3. **Make Technical Decisions** - Choose Clean/Vertical Slice pattern, RabbitMQ topology, AI provider, DevOps path
4. **Create Architecture Document** - System diagrams, technology justifications, implementation guidelines
5. **Flag Risks Early** - Identify technical blockers or requirement clarifications needed before Sprint 1

#### For Development Phase

1. **Strict MVP Scope Adherence** - Treat out-of-scope list as gospel; no feature additions without formal PRD revision
2. **Monitor Story 2.5 Complexity** - Be prepared to split CSV import if it exceeds 4-hour estimate
3. **Prioritize Epic 1 Completion** - Foundation must be solid (logging, error handling, testing, messaging) before feature work
4. **Track AI Costs Weekly** - Implement cost monitoring from Story 3.4 early to avoid budget surprises
5. **Gather User Feedback Continuously** - Recruit 5-10 beta testers early; iterate based on feedback within MVP scope

---

### Final Decision

**✅ READY FOR ARCHITECT**

The PRD and epics are comprehensive, properly structured, and ready for architectural design. The requirements documentation provides clear guidance on WHAT to build while giving the Architect appropriate authority over HOW to build it. MVP scope is appropriately focused on validating core value proposition (transparent AI coaching + multi-account visibility) with a realistic timeline and well-defined success criteria.

**Confidence Level:** High (95%)

**Next Step:** Handoff to Architect with clear prompt to create Architecture Document

---

## Next Steps

### UX Expert Prompt

```
I need you to review the AI Budgeting Coach Product Requirements Document (PRD) located at docs/prd.md and create detailed UX/UI design deliverables.

**Context:**
AI Budgeting Coach is a web-based financial literacy platform that helps young adults (18-25) gain multi-account visibility and build financial capability through transparent AI coaching. The product differentiates itself by explaining WHY spending patterns occur and HOW to improve, not just providing data dashboards.

**Your Task:**
Based on the PRD's User Interface Design Goals section, create:

1. **Information Architecture** - Sitemap showing all screens and navigation hierarchy
2. **User Flow Diagrams** - Visual flows for critical journeys:
   - User registration and onboarding
   - CSV import wizard (upload → column mapping → account setup → import)
   - Reviewing AI coaching insights
   - Setting and tracking budgets
3. **Wireframes** - Low-fidelity wireframes for the 8 core screens identified in the PRD:
   - Login/Registration
   - Dashboard (with multi-account summary and top AI insights)
   - Transaction List (with filters)
   - CSV Import Wizard (all 4 steps)
   - AI Coaching Center
   - Budget Management
   - Settings/Profile
   - Notification Panel
4. **UI Component Specifications** - Define key components:
   - AI Coaching Card (expandable with Why/How/Learn sections)
   - Budget Progress Bar (green/yellow/red states)
   - Transaction List Item (with category confidence badges)
   - CSV Column Mapping Interface
5. **Interaction Patterns** - Document:
   - How users override AI category suggestions (inline editing)
   - How AI coaching cards expand/collapse
   - How CSV wizard progresses through steps
   - How budget alerts appear and are dismissed
6. **Accessibility Guidelines** - Ensure WCAG 2.1 Level AA compliance:
   - Color contrast requirements
   - Keyboard navigation patterns
   - Screen reader labels and ARIA attributes
   - Focus indicators

**Key Design Principles to Apply:**
- Transparency first (show AI reasoning, not black boxes)
- Progressive disclosure (simple overview → detailed insights)
- Calm, supportive tone (reduce financial anxiety)
- Trust-building (confidence scores, easy overrides)
- Education integrated (financial concepts explained contextually)

**Constraints:**
- Web responsive (desktop, tablet, mobile)
- Material-UI (MUI) component library for React
- English language only
- Support USD, RON, EUR currency formatting

**Deliverables Format:**
- Information Architecture: Mermaid diagram or structured list
- User Flows: Mermaid flowcharts or detailed step-by-step descriptions
- Wireframes: ASCII art, Figma links, or detailed text descriptions
- Component Specs: Markdown tables with states, variants, behaviors
- Accessibility: Checklist with specific requirements per component

Please start by reviewing the PRD and confirming you understand the product vision and design goals.
```

---

### Architect Prompt

```
I need you to review the AI Budgeting Coach Product Requirements Document (PRD) located at docs/prd.md and create a comprehensive Architecture Document.

**Context:**
AI Budgeting Coach is an event-driven microservices application built primarily as a learning project to master modern software architecture patterns (microservices, event-driven messaging, AI integration, DevOps) while delivering a functional AI-powered financial literacy platform. The MVP targets 5-10 beta users with an 8-12 week timeline.

**Your Task:**
Based on the PRD's Requirements and Technical Assumptions sections, design the complete system architecture and create an Architecture Document covering:

1. **System Architecture Overview**
   - High-level architecture diagram (6 microservices + API Gateway + RabbitMQ + PostgreSQL)
   - Service responsibilities and boundaries
   - Communication patterns (synchronous REST, asynchronous events)
   - Data flow diagrams

2. **Service-Level Architecture** - For each of the 6 services, define:
   - **UserService:** Authentication, user profiles, JWT generation
   - **TransactionService:** CRUD operations, CSV import, multi-account queries
   - **AIService:** Transaction categorization, spending analysis, coaching insights
   - **BudgetService:** Budget CRUD, real-time tracking, alert generation
   - **NotificationService:** In-app and email notifications
   - **API Gateway (YARP):** Routing, CORS, JWT validation

   For each service, specify:
   - Internal architecture pattern (Clean Architecture or Vertical Slice - your choice)
   - Database schema (tables, columns, relationships, indexes)
   - API endpoints (REST contracts)
   - Event subscriptions and publications (RabbitMQ message contracts)
   - Key algorithms or business logic

3. **Event-Driven Messaging Architecture**
   - RabbitMQ topology (exchanges, queues, bindings)
   - Message contracts for all events (TransactionCreated, BudgetThresholdExceeded, etc.)
   - Retry policies and dead letter queue handling
   - Correlation ID propagation for distributed tracing

4. **Data Architecture**
   - Database-per-service schemas (PostgreSQL)
   - Entity-relationship diagrams per service
   - Data consistency patterns (eventual consistency approach)
   - Migration strategy (EF Core migrations per service)

5. **AI/ML Integration Architecture**
   - AI provider decision: OpenAI API vs. Azure OpenAI vs. Azure AI Language vs. ML.NET
   - Cost/accuracy/latency trade-off analysis
   - Abstraction layer design (swap providers without affecting other services)
   - Prompt engineering strategy for categorization and coaching
   - Fallback handling for API failures

6. **Security Architecture**
   - JWT token generation and validation flow
   - Password hashing (ASP.NET Core Identity)
   - HTTPS enforcement
   - SQL injection and XSS protection
   - API rate limiting and cost caps

7. **DevOps Architecture Decision**
   - Choose: Azure Cloud-Native OR Self-Hosted Open Source
   - Justify choice based on: cost, learning objectives, scalability, operational complexity
   - Docker Compose configuration for MVP local deployment
   - CI/CD pipeline design (GitHub Actions)
   - Monitoring and logging strategy (Prometheus/Grafana OR Azure Monitor/Application Insights)

8. **Frontend Architecture**
   - React project structure (feature-based or layer-based - your choice)
   - State management patterns (React Query + Context API)
   - API client layer design
   - TypeScript type definitions
   - Component hierarchy (with MUI integration)

9. **Cross-Cutting Concerns**
   - Structured logging (Serilog) with correlation IDs
   - Centralized error handling patterns
   - Health check implementation
   - Configuration management (appsettings.json, environment variables)
   - Testing strategy (unit, integration, TestContainers)

10. **Technical Risks and Mitigations**
    - AI API cost overruns → monitoring and caps
    - CSV format variability → flexible parser design
    - Microservices complexity → clear service boundaries and event contracts
    - AI categorization accuracy < 80% → manual override and learning from user corrections

11. **Implementation Guidance**
    - Coding standards and conventions (.NET, React/TypeScript)
    - Dependency injection patterns
    - Repository and unit of work patterns (if applicable)
    - Error response formats
    - API versioning strategy

**Key Technical Decisions You Must Make:**
1. Service architecture pattern: Clean Architecture vs. Vertical Slice (per service or consistent across all)
2. AI provider selection with justification
3. DevOps path: Azure vs. Self-Hosted with rationale
4. RabbitMQ exchange/queue topology design
5. Database schema design for all 6 services
6. Frontend project structure and state management patterns

**Constraints:**
- .NET 8 backend, React 18 + TypeScript frontend, PostgreSQL, RabbitMQ (or Azure Service Bus)
- Monorepo structure
- Docker Compose for MVP deployment
- 29 stories across 5 epics (reference for implementation planning)
- Budget: ~$20-50/month for AI APIs, free-tier cloud resources
- Timeline: 8-12 weeks part-time

**Deliverables Format:**
- Architecture Document (Markdown) at docs/architecture.md
- System diagrams (Mermaid or ASCII art)
- Database schemas (Markdown tables or ERD diagrams)
- API contracts (OpenAPI/Swagger snippets or structured descriptions)
- Event contracts (JSON schema examples)
- Configuration examples (appsettings.json, docker-compose.yml snippets)

Please start by reviewing the PRD thoroughly, then confirm your understanding of:
1. The dual learning + product validation goals
2. The 6 microservices and their responsibilities
3. The event-driven messaging requirements
4. The key technical constraints and decisions you need to make

After confirmation, create the Architecture Document following the outline above.
```

---

**End of Product Requirements Document**
