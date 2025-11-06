# AI Budgeting Coach - Implementation Plan

**Version:** 1.0
**Date:** 2025-01-05
**Status:** Draft
**Based on:** PRD v1.0, Architecture v1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Implementation Phases](#2-implementation-phases)
3. [Epic Breakdown](#3-epic-breakdown)
4. [Development Timeline](#4-development-timeline)
5. [Dependencies & Prerequisites](#5-dependencies--prerequisites)
6. [Risk Assessment](#6-risk-assessment)

---

## 1. Overview

### 1.1 Project Scope

**MVP Goal:** Deliver a functional AI-powered budgeting coach with 6 microservices, event-driven architecture, and React frontend.

**Target Users:** 5-10 beta users for 30+ days validation
**Budget:** $20-50/month (AI API costs only)
**Infrastructure:** Self-hosted Docker Compose on single VM

### 1.2 Technical Stack Summary

- **Backend:** .NET 8, ASP.NET Core Web API, Entity Framework Core
- **Frontend:** React 18, TypeScript, Material-UI, Zustand, TanStack Query
- **Database:** PostgreSQL 16 (6 databases)
- **Messaging:** RabbitMQ 3.12 + MassTransit
- **AI:** OpenAI GPT-4 Turbo API
- **Infrastructure:** Docker Compose, Nginx
- **Monitoring:** Prometheus + Grafana

### 1.3 Success Criteria

- ✅ All 6 microservices deployed and communicating
- ✅ Event-driven architecture functional (RabbitMQ)
- ✅ CSV import processing 1000+ transactions
- ✅ AI categorization >80% accuracy
- ✅ <500ms API response time (p95)
- ✅ 5-10 users actively using for 30+ days
- ✅ Unit test coverage >70%, integration tests functional

---

## 2. Implementation Phases

### Phase 0: Foundation (Week 1)
**Goal:** Project setup and infrastructure foundation

**Deliverables:**
- Monorepo structure created
- Docker Compose development environment
- PostgreSQL + RabbitMQ running locally
- CI/CD pipeline (GitHub Actions) skeleton
- Development standards extracted to separate files

### Phase 1: Core Authentication (Week 2)
**Goal:** User authentication and API Gateway functional

**Deliverables:**
- API Gateway service (YARP configuration)
- User Service (Clean Architecture implementation)
- JWT authentication flow
- User registration/login/profile endpoints
- User database schema and migrations
- Frontend authentication pages (login/register)

### Phase 2: Transaction Management (Week 3-4)
**Goal:** Transaction CRUD and CSV import functional

**Deliverables:**
- Transaction Service (all layers)
- Transaction database schema
- Manual transaction entry (API + UI)
- CSV import with column mapping
- CSV template saving/reuse
- Frontend transaction list, filters, forms
- Event publishing for TransactionCreated

### Phase 3: AI Integration (Week 5)
**Goal:** AI categorization and insights operational

**Deliverables:**
- AI Service (OpenAI integration)
- Transaction categorization (confidence scores)
- Categorization cache implementation
- Event consumer for TransactionCreated
- Event publisher for TransactionCategorized
- AI insights generation (pattern detection)
- Frontend AI insights display

### Phase 4: Budget Tracking (Week 6)
**Goal:** Budget management and alerts

**Deliverables:**
- Budget Service implementation
- Budget CRUD endpoints
- Real-time budget tracking
- Alert threshold detection (80%, 100%, 120%)
- Event consumer for TransactionCreated
- Event publisher for BudgetAlertTriggered
- Frontend budget dashboard and progress bars

### Phase 5: Notifications (Week 7)
**Goal:** Notification delivery operational

**Deliverables:**
- Notification Service implementation
- Email sending (SMTP integration)
- In-app notification storage
- Notification preferences management
- Event consumers (BudgetAlert, InsightGenerated)
- Frontend notification bell and list
- Email templates (budget alerts, insights)

### Phase 6: Integration & Testing (Week 8)
**Goal:** End-to-end integration validated

**Deliverables:**
- Integration tests (Testcontainers)
- E2E tests (Playwright)
- Complete event flow testing
- Performance testing (k6 load tests)
- Security audit (OWASP checklist)
- Bug fixes and refinements

### Phase 7: Deployment & Documentation (Week 9)
**Goal:** Production deployment ready

**Deliverables:**
- Production Docker Compose configuration
- Nginx reverse proxy with SSL
- Monitoring dashboards (Grafana)
- Deployment scripts
- Backup/restore procedures
- User documentation
- API documentation (Swagger)

### Phase 8: Beta Testing (Week 10-13)
**Goal:** Validate with 5-10 users for 30+ days

**Deliverables:**
- Beta user onboarding
- Feedback collection system
- Bug fixes based on user feedback
- Performance tuning
- User behavior analytics
- MVP validation report

---

## 3. Epic Breakdown

### Epic 1: Foundation Setup
**Priority:** P0 (Blocking)
**Estimated Duration:** 3-5 days

**Stories:**
1. Create monorepo structure with all service folders
2. Setup Docker Compose development environment (PostgreSQL, RabbitMQ, Prometheus, Grafana)
3. Extract architecture coding standards to separate markdown files
4. Create .NET solution file with all service projects
5. Setup GitHub Actions CI/CD pipeline skeleton
6. Create database initialization scripts

**Acceptance Criteria:**
- `docker-compose up` starts all infrastructure services
- All databases created and accessible
- RabbitMQ management UI accessible at localhost:15672
- CI pipeline runs on push to main branch
- All service projects compile successfully

---

### Epic 2: User Service & Authentication
**Priority:** P0 (Blocking)
**Estimated Duration:** 5-7 days

**Stories:**
1. Implement User Service Clean Architecture structure (API, Core, Infrastructure)
2. Create User entity and RefreshToken entity
3. Implement UserDbContext with EF Core
4. Implement password hashing service (BCrypt)
5. Implement JWT token generator service
6. Create UsersController with register/login/profile endpoints
7. Implement input validation (FluentValidation)
8. Create user database migrations
9. Implement event publisher for UserRegistered event
10. Add unit tests for UserService (80%+ coverage)
11. Add integration tests for authentication flow
12. Create frontend login page (React + MUI)
13. Create frontend register page
14. Implement frontend auth store (Zustand)
15. Create axios interceptor for JWT token refresh
16. Implement ProtectedRoute component

**Acceptance Criteria:**
- Users can register with email/password
- Users can login and receive JWT tokens
- Access tokens expire after 1 hour, refresh tokens after 7 days
- Token refresh flow works automatically
- Password requirements enforced (8+ chars, upper, lower, number)
- Unit test coverage >80%
- Integration tests pass for auth flow
- Frontend login/register functional with error handling

---

### Epic 3: API Gateway
**Priority:** P0 (Blocking)
**Estimated Duration:** 2-3 days

**Stories:**
1. Create API Gateway project with YARP
2. Configure YARP routes for all microservices
3. Implement JWT validation middleware
4. Implement rate limiting middleware (10 req/s general, 5 req/min login)
5. Implement request logging middleware with correlation IDs
6. Implement exception handling middleware
7. Configure CORS for frontend origin
8. Add health check endpoint
9. Create API Gateway Dockerfile

**Acceptance Criteria:**
- API Gateway routes requests to all services
- JWT tokens validated before forwarding requests
- Rate limiting applied and returns 429 when exceeded
- All requests logged with correlation IDs
- CORS configured for localhost:3000 (dev) and production domain
- Health check endpoint returns service status

---

### Epic 4: Transaction Service - Core CRUD
**Priority:** P1 (High)
**Estimated Duration:** 4-6 days

**Stories:**
1. Implement Transaction Service Clean Architecture (API, Core, Infrastructure)
2. Create Transaction entity and CSVImportTemplate entity
3. Implement TransactionDbContext with EF Core
4. Create TransactionsController with CRUD endpoints
5. Implement pagination for transaction list
6. Implement filtering (date range, category, merchant)
7. Implement transaction summary endpoint (aggregate by category)
8. Implement duplicate detection (same merchant/amount within 5 min)
9. Create database migrations for transactions
10. Implement event publisher for TransactionCreated/Updated/Deleted
11. Add unit tests for TransactionService (80%+ coverage)
12. Add integration tests for CRUD operations
13. Create frontend TransactionList component
14. Create frontend TransactionForm component (create/edit)
15. Implement frontend transaction filters
16. Create frontend transaction summary dashboard

**Acceptance Criteria:**
- Users can create, read, update, delete transactions
- Transaction list paginated (50 per page)
- Filters work correctly (date, category, merchant)
- Summary endpoint returns correct aggregations
- Duplicate detection prevents identical transactions within 5 minutes
- Events published for all transaction changes
- Unit test coverage >80%
- Frontend transaction management fully functional

---

### Epic 5: Transaction Service - CSV Import
**Priority:** P1 (High)
**Estimated Duration:** 5-7 days

**Stories:**
1. Implement CSV parser service (CsvHelper library)
2. Create ImportController with upload endpoint
3. Implement flexible CSV column mapping
4. Implement CSV template CRUD (save/reuse mappings)
5. Implement bulk transaction insertion (efficient batching)
6. Implement error handling for malformed CSV rows
7. Implement import summary response (imported/failed counts)
8. Add unit tests for CSV parsing edge cases
9. Add integration tests for CSV import with sample files
10. Create frontend CSV upload dialog
11. Create frontend column mapping UI
12. Implement CSV template dropdown and management
13. Display import progress and results
14. Add sample CSV files for testing (Chase, BofA, Wells Fargo formats)

**Acceptance Criteria:**
- System handles CSV files with 1000+ rows
- Users can map CSV columns to transaction fields
- Templates saved and reusable for same bank
- Import errors displayed with row numbers
- Bulk insert completes in <5 seconds for 1000 rows
- Various bank CSV formats supported (different headers, date formats)
- Frontend CSV import workflow intuitive
- Sample CSV files import successfully

---

### Epic 6: AI Service - Categorization
**Priority:** P1 (High)
**Estimated Duration:** 4-5 days

**Stories:**
1. Implement AI Service Clean Architecture
2. Create AIInsight entity and CategorizationCache entity
3. Implement OpenAI client wrapper
4. Create categorization prompt template
5. Implement TransactionCreatedConsumer (RabbitMQ)
6. Implement categorization logic with confidence scoring
7. Implement categorization caching (30-day TTL)
8. Implement event publisher for TransactionCategorized
9. Configure OpenAI API key and rate limiting
10. Add unit tests for categorization service (mocked OpenAI)
11. Add integration tests for event-driven categorization flow
12. Create frontend category confidence indicators
13. Implement manual category override in frontend

**Acceptance Criteria:**
- AI categorizes transactions into 10 standard categories
- Confidence scores provided (0-100)
- Categorization results cached by merchant name
- Auto-categorization only applied if confidence >=70%
- TransactionCategorized events published successfully
- OpenAI API calls batched (max 50/min)
- Unit test coverage >75%
- Frontend displays AI categories with confidence badges

---

### Epic 7: AI Service - Insights
**Priority:** P2 (Medium)
**Estimated Duration:** 4-5 days

**Stories:**
1. Implement InsightGenerationService
2. Create weekly insights analyzer (7-day patterns)
3. Create monthly insights analyzer (30-day patterns)
4. Implement spending trend detection
5. Implement anomaly detection (unusual spending)
6. Generate actionable recommendations with explanations
7. Implement event publisher for InsightGenerated
8. Create InsightsController with GET endpoint
9. Add unit tests for insight generation logic
10. Create frontend Insights page
11. Implement insight cards with priority indicators
12. Add dismiss functionality for insights
13. Display spending trend charts (Recharts)

**Acceptance Criteria:**
- Weekly insights generated automatically
- Insights explain WHY patterns occurred (educational)
- Insights provide HOW to improve (actionable)
- Insights stored in database for historical view
- InsightGenerated events trigger notifications
- Frontend displays insights with visual indicators
- Users can dismiss insights

---

### Epic 8: Budget Service
**Priority:** P1 (High)
**Estimated Duration:** 4-5 days

**Stories:**
1. Implement Budget Service Clean Architecture
2. Create Budget entity and BudgetAlert entity
3. Implement BudgetDbContext with EF Core
4. Create BudgetsController with CRUD endpoints
5. Implement budget status calculation (spent vs limit)
6. Implement TransactionCreatedConsumer (real-time tracking)
7. Implement alert threshold detection (80%, 100%, 120%)
8. Implement BudgetMonitoringJob (background job with Hangfire)
9. Implement event publisher for BudgetAlertTriggered
10. Create database migrations
11. Add unit tests for budget calculation logic
12. Add integration tests for budget alert flow
13. Create frontend Budgets page
14. Create budget creation form
15. Implement budget progress bars with color coding
16. Display budget status dashboard

**Acceptance Criteria:**
- Users can create monthly budgets per category
- Real-time budget tracking updates as transactions added
- Alerts triggered at 80%, 100%, 120% thresholds
- Alerts only sent once per threshold
- Background job checks budgets every 6 hours
- BudgetAlertTriggered events published
- Frontend shows budget progress visually
- Color coding: green (<80%), yellow (80-100%), red (>100%)

---

### Epic 9: Notification Service
**Priority:** P1 (High)
**Estimated Duration:** 4-5 days

**Stories:**
1. Implement Notification Service Clean Architecture
2. Create Notification, NotificationPreferences, EmailLog entities
3. Implement NotificationDbContext with EF Core
4. Create NotificationsController and PreferencesController
5. Implement SMTP email sender (SendGrid/Gmail)
6. Implement email templates (budget alerts, insights)
7. Implement BudgetAlertTriggeredConsumer
8. Implement InsightGeneratedConsumer
9. Implement in-app notification creation
10. Implement notification preferences management
11. Create database migrations
12. Add unit tests for notification service
13. Add integration tests for email sending
14. Create frontend NotificationBell component
15. Create frontend NotificationList component
16. Create frontend NotificationPreferences page
17. Implement real-time notification updates

**Acceptance Criteria:**
- Email notifications sent for budget alerts
- In-app notifications stored in database
- Users can view notification history
- Users can mark notifications as read
- Users can customize notification preferences
- Email templates professional and clear
- Frontend notification bell shows unread count
- Notification list paginated and filterable

---

### Epic 10: Event-Driven Integration
**Priority:** P0 (Blocking)
**Estimated Duration:** 3-4 days

**Stories:**
1. Configure RabbitMQ exchanges and queues
2. Implement shared message contracts library
3. Configure MassTransit in all services
4. Implement retry policies (exponential backoff)
5. Implement circuit breakers (50% failure threshold)
6. Implement dead letter queues
7. Add correlation IDs to all events
8. Configure event logging (Serilog)
9. Add integration tests for complete event flows
10. Setup RabbitMQ monitoring in Grafana

**Acceptance Criteria:**
- All services publish/consume events successfully
- Events follow at-least-once delivery guarantee
- Failed events moved to DLQ after 5 retries
- Circuit breakers prevent cascading failures
- Correlation IDs trace events across services
- Event processing latency <1 second
- Grafana dashboard shows queue depths and throughput

---

### Epic 11: Frontend Polish & UX
**Priority:** P2 (Medium)
**Estimated Duration:** 4-5 days

**Stories:**
1. Implement Dashboard page (overview widgets)
2. Create responsive layout for mobile
3. Implement loading states and skeletons
4. Implement error boundaries and error pages
5. Add toast notifications for user actions
6. Implement form validation with error messages
7. Add accessibility features (ARIA labels, keyboard nav)
8. Implement date range pickers
9. Add search functionality for transactions
10. Create empty states for all lists
11. Optimize bundle size (code splitting)
12. Add performance monitoring (Web Vitals)
13. Implement PWA features (service worker, manifest)

**Acceptance Criteria:**
- Dashboard shows key metrics at a glance
- Responsive on mobile (375px+) and desktop
- Loading states prevent confusion
- Errors handled gracefully with retry options
- Forms validate before submission
- WCAG 2.1 AA compliance
- Lighthouse score >90 (performance, accessibility, best practices)
- Bundle size <500KB gzipped

---

### Epic 12: Testing & Quality
**Priority:** P1 (High)
**Estimated Duration:** 5-7 days

**Stories:**
1. Achieve 80%+ unit test coverage for all services
2. Create comprehensive integration test suite
3. Implement E2E tests for critical user flows (Playwright)
4. Setup test data seeding scripts
5. Create performance tests (k6 load testing)
6. Run security audit (OWASP checklist)
7. Fix all high-priority vulnerabilities
8. Implement automated test runs in CI/CD
9. Create test coverage reports
10. Setup mutation testing (Stryker)

**Acceptance Criteria:**
- Unit test coverage >80% for Core layers
- Integration tests cover all API endpoints
- E2E tests cover: registration, login, transaction CRUD, CSV import, budget creation
- Load tests verify <500ms p95 response time
- No high/critical security vulnerabilities
- CI/CD pipeline fails on test failures
- Code coverage badge in README

---

### Epic 13: Deployment & DevOps
**Priority:** P1 (High)
**Estimated Duration:** 4-5 days

**Stories:**
1. Create production Docker Compose configuration
2. Configure Nginx reverse proxy with SSL (Let's Encrypt)
3. Setup domain and DNS
4. Implement database backup scripts
5. Create deployment automation scripts
6. Setup Prometheus metrics collection
7. Create Grafana dashboards (system, API, RabbitMQ)
8. Configure log aggregation (ELK or Seq)
9. Setup alerting rules (disk space, memory, errors)
10. Create runbook documentation
11. Perform dry-run deployment
12. Deploy to production VM

**Acceptance Criteria:**
- Production environment accessible via HTTPS
- SSL certificates auto-renew
- Database backups run daily
- Deployment script performs zero-downtime updates
- Grafana dashboards show all metrics
- Alerts sent for critical issues
- Logs searchable and retained for 30 days
- Runbook covers common scenarios

---

### Epic 14: Documentation & Beta Prep
**Priority:** P2 (Medium)
**Estimated Duration:** 3-4 days

**Stories:**
1. Create user documentation (getting started guide)
2. Create API documentation (Swagger UI)
3. Document CSV import instructions (bank-specific)
4. Create troubleshooting guide
5. Setup feedback collection system
6. Create beta user onboarding email templates
7. Prepare demo data for new users
8. Create privacy policy and terms of service
9. Setup analytics (privacy-friendly)
10. Create beta testing feedback form

**Acceptance Criteria:**
- User documentation clear and comprehensive
- API documentation accessible at /api/docs
- CSV instructions cover 3+ major banks
- Feedback form embedded in app
- Demo data realistic and useful
- Privacy policy reviewed
- Analytics dashboard setup
- Beta users can onboard independently

---

## 4. Development Timeline

### Gantt Chart (14 Weeks Total)

```
Week 1:  [Epic 1: Foundation]
Week 2:  [Epic 2: User Service][Epic 3: API Gateway]
Week 3:  [Epic 4: Transaction CRUD]
Week 4:  [Epic 5: CSV Import][Epic 10: Event Integration]
Week 5:  [Epic 6: AI Categorization]
Week 6:  [Epic 7: AI Insights][Epic 8: Budget Service]
Week 7:  [Epic 9: Notification Service]
Week 8:  [Epic 11: Frontend Polish]
Week 9:  [Epic 12: Testing & Quality]
Week 10: [Epic 13: Deployment][Epic 14: Documentation]
Week 11-14: [Beta Testing Period - 30 days]
```

### Milestones

| Milestone | Target Date | Criteria |
|-----------|------------|----------|
| M1: Foundation Complete | Week 1 | Infrastructure running, repos setup |
| M2: Auth Working | Week 2 | Users can register/login |
| M3: Transactions Working | Week 4 | Manual entry + CSV import functional |
| M4: AI Integration Live | Week 5 | Auto-categorization working |
| M5: Budgets Tracking | Week 6 | Budget alerts firing |
| M6: Full Stack Complete | Week 7 | All features implemented |
| M7: Testing Complete | Week 9 | All tests passing, >80% coverage |
| M8: Production Deployed | Week 10 | Live on production domain |
| M9: Beta Users Onboarded | Week 11 | 5-10 users actively using |
| M10: MVP Validated | Week 14 | 30+ days usage data collected |

---

## 5. Dependencies & Prerequisites

### External Dependencies

1. **OpenAI API Access**
   - Requirement: API key with GPT-4 Turbo access
   - Cost: ~$20-50/month for MVP usage
   - Risk: API outages, rate limits
   - Mitigation: Implement caching, fallback to manual categorization

2. **SMTP Service**
   - Requirement: SendGrid account or Gmail SMTP
   - Cost: Free tier sufficient for MVP
   - Risk: Email deliverability issues
   - Mitigation: Use reputable provider, configure SPF/DKIM

3. **Domain & SSL**
   - Requirement: Domain name (e.g., aibudgetcoach.com)
   - Cost: ~$15/year
   - Risk: DNS propagation delays
   - Mitigation: Setup early, use Let's Encrypt for SSL

4. **Cloud VM**
   - Requirement: 4 vCPU, 8GB RAM, 100GB SSD
   - Cost: ~$40/month (DigitalOcean, Hetzner, or AWS)
   - Risk: Server downtime
   - Mitigation: Choose reliable provider, setup monitoring

### Internal Prerequisites

1. **Development Environment**
   - .NET 8 SDK
   - Node.js 20+
   - Docker Desktop
   - PostgreSQL client (pgAdmin or DBeaver)
   - Git

2. **Development Tools**
   - Visual Studio 2022 or Rider or VS Code
   - Postman or Insomnia (API testing)
   - GitHub account (repository hosting)

3. **Skills Required**
   - C# / .NET Core proficiency
   - React / TypeScript proficiency
   - SQL / PostgreSQL knowledge
   - Docker / container basics
   - REST API design
   - Git workflow

---

## 6. Risk Assessment

### High Risk Items

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| OpenAI API costs exceed budget | High | Medium | Implement aggressive caching, rate limiting, usage monitoring |
| Event-driven architecture complexity delays timeline | High | Medium | Start with simpler point-to-point, refactor to events incrementally |
| CSV parsing edge cases cause data loss | High | Medium | Extensive testing with real bank CSVs, import preview before commit |
| Performance issues with 1000+ transactions | Medium | Medium | Implement pagination, indexing, query optimization early |
| Security vulnerabilities in auth flow | High | Low | Follow OWASP checklist, penetration testing, code review |
| RabbitMQ message loss during failures | Medium | Low | Implement persistent messages, acknowledgments, DLQ |
| Beta users don't provide feedback | Medium | High | Incentivize feedback, make reporting easy, personal outreach |
| Deployment complexity on single VM | Medium | Medium | Docker Compose simplifies, thorough testing before production |

### Medium Risk Items

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Timeline slip due to scope creep | Medium | High | Strict MVP scope, defer non-essential features |
| Integration test flakiness | Low | High | Use Testcontainers for isolation, retry logic |
| Mobile UI not fully responsive | Medium | Medium | Test on real devices early, use responsive design patterns |
| Database migration issues in production | Medium | Low | Test migrations thoroughly, backup before deploy |
| Third-party library breaking changes | Low | Medium | Pin dependency versions, test updates before upgrading |

---

## 7. Success Metrics & KPIs

### Technical Metrics

- **API Response Time:** p95 <500ms, p99 <1000ms
- **Test Coverage:** Unit >80%, Integration >60%
- **Uptime:** >99% for all services
- **Event Processing Latency:** <1 second end-to-end
- **AI Categorization Accuracy:** >80%
- **CSV Import Success Rate:** >95% for 1000+ row files
- **Lighthouse Score:** >90 (performance, accessibility, best practices)
- **Bundle Size:** <500KB gzipped

### User Metrics (Beta Period)

- **Active Users:** 5-10 users
- **Retention:** 7-day retention >80%, 30-day retention >60%
- **Engagement:** Average 3+ sessions per week
- **Transactions per User:** Average 50+ transactions imported
- **Feature Adoption:** >80% use CSV import, >60% set budgets, >70% review AI insights
- **User Satisfaction:** NPS >40, feedback rating >4/5

### Business Validation

- **Product-Market Fit:** At least 3/10 beta users express willingness to pay
- **Learning Validation:** Portfolio-ready codebase demonstrating microservices mastery
- **Cost Validation:** Total infrastructure cost <$100/month for MVP

---

## 8. Next Steps

1. **Review & Approve Plan** - Stakeholder review of this implementation plan
2. **Setup Project Tracking** - Create GitHub Project board with all stories
3. **Begin Epic 1** - Foundation setup (Week 1)
4. **Weekly Check-ins** - Review progress, adjust timeline as needed
5. **Risk Monitoring** - Track mitigation effectiveness weekly

---

**End of Implementation Plan**
