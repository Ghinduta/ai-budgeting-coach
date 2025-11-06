# AI Budgeting Coach - Master Test Plan

**Version:** 1.0
**Date:** 2025-01-05
**Status:** Draft
**Test Architect:** Quinn
**Based on:** PRD v1.0, Implementation Plan v1.0

---

## Table of Contents

1. [Test Strategy Overview](#1-test-strategy-overview)
2. [Requirements Traceability Matrix](#2-requirements-traceability-matrix)
3. [Test Levels & Scope](#3-test-levels--scope)
4. [Risk-Based Test Prioritization](#4-risk-based-test-prioritization)
5. [Test Environment Strategy](#5-test-environment-strategy)
6. [Test Data Management](#6-test-data-management)
7. [Quality Attributes Testing](#7-quality-attributes-testing)
8. [Epic-Level Test Coverage](#8-epic-level-test-coverage)
9. [Test Automation Strategy](#9-test-automation-strategy)
10. [Quality Gates & Acceptance Criteria](#10-quality-gates--acceptance-criteria)
11. [Test Schedule & Milestones](#11-test-schedule--milestones)
12. [Defect Management](#12-defect-management)
13. [Test Metrics & Reporting](#13-test-metrics--reporting)

---

## 1. Test Strategy Overview

### 1.1 Testing Philosophy

The AI Budgeting Coach test strategy is designed around **risk-based testing** with a focus on:

- **Functional Correctness**: All FR1-FR20 requirements validated
- **Architectural Integrity**: Microservices communication, event-driven flows
- **Quality Attributes**: NFR1-NFR18 compliance (performance, security, reliability)
- **User Experience**: WCAG AA accessibility, responsive design
- **AI Quality**: >80% categorization accuracy, transparent coaching

### 1.2 Test Pyramid Strategy

```
           /\
          /  \     E2E Tests (10%)
         /    \    - Critical user journeys
        /------\   - Cross-service flows
       /        \
      /  Int.    \ Integration Tests (30%)
     /   Tests    \ - Service-to-service
    /              \ - Event flows
   /----------------\ - API contracts
  /                  \
 /   Unit Tests       \ Unit Tests (60%)
/      (60%)           \ - Business logic
/______________________\ - Domain models
                         - Service layer
```

**Rationale:**
- **60% Unit Tests**: Fast feedback, high coverage of business logic
- **30% Integration Tests**: Validate microservices communication, event-driven flows
- **10% E2E Tests**: Critical user paths, avoid fragile UI tests

### 1.3 Test Types by Epic Phase

| Phase | Epic Focus | Primary Test Types | Success Criteria |
|-------|-----------|-------------------|------------------|
| Week 1 | Foundation Setup | Manual verification, infrastructure tests | Docker Compose up, all services healthy |
| Week 2 | User Service & Auth | Unit tests (80%+), integration tests | JWT flow, password security validated |
| Week 2 | API Gateway | Integration tests, contract tests | All routes functional, rate limiting works |
| Week 3-4 | Transaction CRUD/CSV | Unit tests, integration tests, CSV edge cases | 1000+ transactions processed, templates work |
| Week 5 | AI Integration | Unit tests, AI accuracy tests, mock tests | >80% categorization accuracy |
| Week 6 | Budget Service | Unit tests, integration tests, event tests | Real-time tracking, alerts at thresholds |
| Week 7 | Notifications | Integration tests, email tests | Email delivery, in-app notifications work |
| Week 8 | Integration & Testing | E2E tests, performance tests, security audit | All flows pass, <500ms p95, OWASP clean |
| Week 9 | Deployment | Smoke tests, monitoring tests | Production deployment successful |
| Week 10-13 | Beta Testing | UAT, usability testing, feedback | 5-10 users, 30+ days active |

---

## 2. Requirements Traceability Matrix

### 2.1 Functional Requirements Coverage

| Req ID | Requirement Summary | Test Types | Priority | Test IDs |
|--------|-------------------|-----------|----------|----------|
| **FR1** | User registration/login with JWT | Unit, Integration, E2E | P0 | TC-AUTH-001 to TC-AUTH-015 |
| **FR2** | Manual transaction entry | Unit, Integration, E2E | P0 | TC-TXN-001 to TC-TXN-010 |
| **FR3** | CSV import with flexible parsing | Unit, Integration, E2E | P0 | TC-CSV-001 to TC-CSV-025 |
| **FR3b** | Save/reuse CSV mappings | Unit, Integration | P1 | TC-CSV-026 to TC-CSV-030 |
| **FR4** | AI transaction categorization | Unit, Integration, AI accuracy | P0 | TC-AI-001 to TC-AI-015 |
| **FR5** | AI confidence scores & overrides | Unit, Integration, E2E | P1 | TC-AI-016 to TC-AI-025 |
| **FR6** | Consolidated transaction list | Integration, E2E | P0 | TC-TXN-011 to TC-TXN-015 |
| **FR7** | Transaction filtering/search | Unit, Integration, E2E | P1 | TC-TXN-016 to TC-TXN-025 |
| **FR8** | Edit/delete transactions | Unit, Integration, E2E | P1 | TC-TXN-026 to TC-TXN-035 |
| **FR9** | Set monthly budgets | Unit, Integration | P0 | TC-BUD-001 to TC-BUD-010 |
| **FR10** | Real-time budget tracking | Unit, Integration, E2E | P0 | TC-BUD-011 to TC-BUD-020 |
| **FR11** | Budget alert notifications | Integration, E2E | P0 | TC-BUD-021 to TC-BUD-030 |
| **FR12** | AI spending pattern analysis | Unit, Integration, AI quality | P1 | TC-AI-026 to TC-AI-035 |
| **FR13** | Transparent AI recommendations | Integration, AI quality, UAT | P1 | TC-AI-036 to TC-AI-045 |
| **FR14** | Monthly financial summaries | Integration, AI quality | P2 | TC-AI-046 to TC-AI-050 |
| **FR15** | Educational context in insights | Integration, UAT | P2 | TC-AI-051 to TC-AI-055 |
| **FR16** | In-app notifications | Unit, Integration, E2E | P1 | TC-NOT-001 to TC-NOT-015 |
| **FR17** | Email notifications | Integration, E2E, email tests | P1 | TC-NOT-016 to TC-NOT-025 |
| **FR18** | Notification preferences | Unit, Integration | P2 | TC-NOT-026 to TC-NOT-030 |
| **FR19** | Profile management | Unit, Integration, E2E | P1 | TC-AUTH-016 to TC-AUTH-020 |
| **FR20** | Multi-currency support (USD/RON/EUR) | Unit, Integration, E2E | P1 | TC-CURR-001 to TC-CURR-015 |

**Total Functional Test Cases:** ~300+

### 2.2 Non-Functional Requirements Coverage

| Req ID | Requirement Summary | Test Types | Measurement Method | Success Criteria |
|--------|-------------------|-----------|-------------------|------------------|
| **NFR1** | Microservices architecture (6 services) | Architecture tests, integration | Service health checks, dependency mapping | All 6 services independent, healthy |
| **NFR2** | RabbitMQ event-driven messaging | Integration tests, event flow tests | Message delivery verification | All events published/consumed |
| **NFR3** | Database-per-service pattern | Integration tests, schema tests | Database isolation verification | No cross-service DB queries |
| **NFR4** | API response time <500ms (p95) | Performance tests (k6) | Response time monitoring | p95 <500ms, p99 <1000ms |
| **NFR5** | Event latency <1 second | Integration tests, performance | End-to-end event timing | TransactionCreated → categorized <1s |
| **NFR6** | AI categorization accuracy >80% | AI accuracy tests, validation set | Manual review + override rate | >80% correct categories |
| **NFR7** | CSV import 1000+ transactions | Load tests, integration | Import performance, error rate | 1000 rows in <5s, >95% success |
| **NFR8** | 99% uptime | Monitoring, health checks | Uptime tracking (Prometheus) | <1% downtime per week |
| **NFR9** | React 18+ with TypeScript | Code quality tests | TypeScript compilation, linting | 0 type errors, lint passing |
| **NFR10** | .NET 8 backend | Code quality tests | Compilation, Roslyn analyzers | 0 build warnings/errors |
| **NFR11** | Docker Compose orchestration | Infrastructure tests | docker-compose up verification | All containers start successfully |
| **NFR12** | Responsive design (desktop/mobile) | Visual regression, manual | Viewport testing (375px, 768px, 1024px+) | All screens responsive |
| **NFR13** | Multi-currency support | Functional tests | Currency formatting verification | USD/RON/EUR formatted correctly |
| **NFR14** | English language only | Manual verification | UI content review | No hardcoded non-English text |
| **NFR15** | Password security, JWT auth | Security tests, penetration | OWASP ZAP scan, manual review | Passwords hashed (BCrypt), JWT secure |
| **NFR16** | Monorepo structure | Code organization tests | Repository structure validation | All services in single repo |
| **NFR17** | Unit tests >70%, integration tests | Code coverage | Code coverage reports (Coverlet) | Unit coverage >80%, integration >60% |
| **NFR18** | AI API cost monitoring | Integration tests, monitoring | Cost tracking, usage caps | <$50/month during beta |

**Total NFR Test Scenarios:** ~100+

---

## 3. Test Levels & Scope

### 3.1 Unit Testing

**Scope:**
- Business logic in Core layers (all services)
- Domain models and validation
- Service layer methods
- Utility functions and helpers

**Coverage Target:** 80%+ for Core layers

**Tools:**
- xUnit (backend)
- Moq/NSubstitute (mocking)
- FluentAssertions (readable assertions)
- Vitest (frontend)
- Testing Library (React components)

**Example Test Scenarios:**
```
GIVEN a user registration request with weak password
WHEN password validation is executed
THEN validation should fail with "Password must contain uppercase letter"

GIVEN a transaction with amount $50
WHEN categorizing merchant "Whole Foods"
THEN category should be "Groceries" with confidence >70%

GIVEN a budget with limit $500 and spent $420
WHEN calculating budget status
THEN percentage should be 84% and status should be "Warning"
```

### 3.2 Integration Testing

**Scope:**
- Service-to-service communication
- Event-driven flows (RabbitMQ)
- Database interactions (EF Core)
- API contract validation
- External service mocking (OpenAI)

**Coverage Target:** All service interfaces and event flows

**Tools:**
- xUnit with TestContainers (real PostgreSQL, RabbitMQ)
- WebApplicationFactory (in-memory API testing)
- MassTransit.Testing (event testing)

**Example Test Scenarios:**
```
GIVEN a TransactionCreated event is published
WHEN AIService consumes the event
THEN TransactionCategorized event should be published within 1 second

GIVEN API Gateway receives request to /api/transactions
WHEN JWT token is valid
THEN request should be routed to TransactionService successfully

GIVEN 1000 transactions are imported via CSV
WHEN bulk insert is executed
THEN all transactions should be persisted in <5 seconds
```

### 3.3 End-to-End Testing

**Scope:**
- Critical user journeys across all services
- Complete workflows (registration → CSV import → budget setup → alerts)
- Cross-browser compatibility

**Coverage Target:** Top 10 critical user paths

**Tools:**
- Playwright (browser automation)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

**Critical E2E Test Cases:**
1. **User Registration & First Login** (TC-E2E-001)
2. **CSV Import End-to-End** (TC-E2E-002)
   - Upload CSV → Map columns → Import → View transactions → AI categorization
3. **Manual Transaction Entry & Edit** (TC-E2E-003)
4. **Budget Creation & Alert Flow** (TC-E2E-004)
   - Create budget → Add transactions → Trigger 80% alert → Receive notification
5. **AI Insights Journey** (TC-E2E-005)
   - Generate insights → View recommendations → Act on coaching
6. **Multi-Account Consolidation** (TC-E2E-006)
   - Import from 2+ banks → View consolidated dashboard
7. **Notification Preferences** (TC-E2E-007)
   - Disable email alerts → Verify no emails sent
8. **Profile Currency Change** (TC-E2E-008)
   - Change USD → EUR → Verify all amounts reformatted
9. **JWT Token Refresh Flow** (TC-E2E-009)
   - Login → Wait 1 hour → Access token expires → Auto-refresh → Continue working
10. **Responsive Design Journey** (TC-E2E-010)
    - Complete key tasks on mobile (375px), tablet (768px), desktop (1024px+)

### 3.4 Performance Testing

**Scope:**
- API response times under load
- CSV import performance (1000+ rows)
- Event processing latency
- Database query optimization

**Tools:**
- k6 (load testing)
- Prometheus + Grafana (monitoring)

**Load Test Scenarios:**

| Scenario | Virtual Users | Duration | Success Criteria |
|----------|--------------|----------|------------------|
| **Baseline Load** | 10 users | 10 min | p95 <500ms, p99 <1000ms |
| **Concurrent Logins** | 50 users | 5 min | p95 <800ms, no auth failures |
| **CSV Import Stress** | 5 concurrent imports (1000 rows each) | 5 min | All complete <10s, no errors |
| **Event Storm** | 100 events/sec | 5 min | All processed <1s latency |
| **Dashboard Load** | 20 concurrent users | 10 min | p95 <600ms for dashboard |

### 3.5 Security Testing

**Scope:**
- OWASP Top 10 vulnerabilities
- Authentication/authorization flows
- JWT token security
- SQL injection protection
- XSS protection

**Tools:**
- OWASP ZAP (automated scanning)
- Manual penetration testing
- Dependency vulnerability scanning (npm audit, dotnet list package --vulnerable)

**Security Test Cases:**
- **SQL Injection** (TC-SEC-001): Attempt malicious SQL in all input fields
- **XSS** (TC-SEC-002): Inject scripts via merchant names, notes
- **JWT Tampering** (TC-SEC-003): Modify JWT payload, verify rejection
- **Broken Authentication** (TC-SEC-004): Test weak passwords, token expiration
- **CORS Misconfiguration** (TC-SEC-005): Verify only allowed origins accepted
- **Rate Limiting Bypass** (TC-SEC-006): Exceed rate limits, verify 429 responses
- **Sensitive Data Exposure** (TC-SEC-007): Verify passwords never logged/returned in API
- **CSRF Protection** (TC-SEC-008): Verify state tokens for mutations

### 3.6 Accessibility Testing

**Scope:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios

**Tools:**
- axe DevTools
- NVDA/JAWS screen readers
- Lighthouse accessibility audits

**Accessibility Test Cases:**
- **Keyboard Navigation** (TC-A11Y-001): Navigate entire app without mouse
- **Screen Reader** (TC-A11Y-002): All content readable by NVDA
- **Color Contrast** (TC-A11Y-003): All text meets 4.5:1 ratio
- **Focus Indicators** (TC-A11Y-004): Visible focus on all interactive elements
- **ARIA Labels** (TC-A11Y-005): All form inputs have labels
- **Budget Status** (TC-A11Y-006): Color + text/icons (not color alone)

### 3.7 User Acceptance Testing (UAT)

**Scope:**
- Beta user validation (5-10 users)
- Real-world usage over 30+ days
- Feedback collection

**UAT Scenarios:**
1. **Onboarding Experience**: New user signs up, imports first CSV
2. **Daily Usage**: User adds manual transactions, reviews insights
3. **Budget Management**: User sets budgets, receives alerts
4. **AI Coaching Value**: User acts on AI recommendations
5. **Multi-Bank Support**: User imports from 2+ different banks

**Success Criteria:**
- 80%+ task completion rate
- NPS >40
- 60%+ retention after 30 days
- >70% users review AI insights weekly

---

## 4. Risk-Based Test Prioritization

### 4.1 Risk Assessment Matrix

| Risk Area | Probability | Impact | Risk Score | Mitigation Testing |
|-----------|------------|--------|-----------|-------------------|
| **CSV Import Failures** | High | High | **CRITICAL** | Comprehensive edge case testing, sample bank CSVs |
| **AI Categorization Accuracy <80%** | Medium | High | **HIGH** | Validation set testing, manual review process |
| **Event Message Loss** | Medium | High | **HIGH** | Integration tests, DLQ verification, idempotency tests |
| **JWT Security Vulnerabilities** | Low | High | **HIGH** | Security tests, penetration testing, token validation |
| **API Performance Degradation** | Medium | Medium | **MEDIUM** | Load tests, performance monitoring, query optimization |
| **RabbitMQ Downtime** | Low | High | **HIGH** | Resilience tests, retry policies, circuit breakers |
| **Multi-Currency Formatting Errors** | Medium | Medium | **MEDIUM** | Currency-specific test cases, locale testing |
| **Budget Calculation Errors** | Medium | High | **HIGH** | Unit tests, integration tests, edge cases |
| **Email Delivery Failures** | Medium | Low | **MEDIUM** | Email integration tests, SMTP monitoring |
| **Responsive Design Breaks** | High | Medium | **MEDIUM** | Visual regression tests, manual device testing |

### 4.2 Priority Test Focus Areas

**P0 (Must Test Thoroughly):**
1. CSV Import with edge cases (various bank formats, malformed data)
2. AI categorization accuracy validation
3. JWT authentication security
4. Event-driven flows (TransactionCreated → AIService → BudgetService)
5. Budget calculation and alerts
6. API Gateway routing and rate limiting

**P1 (High Priority):**
1. Transaction CRUD operations
2. Multi-currency support
3. Performance under load (p95 <500ms)
4. Email notification delivery
5. Responsive design (mobile, tablet, desktop)

**P2 (Standard Priority):**
1. AI coaching quality (subjective)
2. Notification preferences
3. Profile management
4. Accessibility compliance

---

## 5. Test Environment Strategy

### 5.1 Environment Definitions

| Environment | Purpose | Infrastructure | Data | Access |
|-------------|---------|---------------|------|--------|
| **Local Dev** | Developer testing | Docker Compose (laptop) | Seeded test data | Developers |
| **CI/CD** | Automated test execution | GitHub Actions runners | Ephemeral test data | Automated |
| **Integration** | Integration/E2E testing | Docker Compose (shared VM) | Shared test data | Dev team |
| **Staging** | Pre-production validation | Production-like (Docker Compose) | Anonymized prod-like data | Dev team, PM |
| **Production** | Live beta users | Production (Docker Compose + Nginx) | Real user data | Beta users |

### 5.2 Test Data Strategy

**Test Data Categories:**

1. **Minimal Valid Data**: Single user, 10 transactions, 1 budget
2. **Representative Data**: 5 users, 500 transactions (3 months), 10 budgets
3. **Large Volume Data**: 10 users, 5000+ transactions, stress testing
4. **Edge Case Data**:
   - CSV with all supported bank formats (Chase, BofA, Wells Fargo, ING, Revolut)
   - Transactions with special characters in merchant names
   - Budget edge cases (0 limit, negative amounts, future dates)
   - Multi-currency scenarios

**Data Generation:**
- SQL seed scripts for databases
- CSV sample files for import testing
- Faker.NET for synthetic test data

---

## 6. Test Data Management

### 6.1 Sample CSV Files for Testing

**Required Test CSVs:**

| Bank | Format Characteristics | Test File | Scenarios |
|------|----------------------|-----------|-----------|
| **Chase** | MM/DD/YYYY, negative as "(amount)" | chase-sample.csv | Standard US format |
| **Bank of America** | MM/DD/YYYY, comma separator | bofa-sample.csv | Transaction descriptions |
| **Wells Fargo** | MM/DD/YYYY, separate debit/credit columns | wellsfargo-sample.csv | Split amount columns |
| **ING (Romania)** | DD/MM/YYYY, semicolon separator | ing-sample.csv | European date format |
| **Revolut** | YYYY-MM-DD, comma separator, multi-currency | revolut-sample.csv | ISO date, currency codes |
| **Malformed** | Missing columns, invalid dates | malformed-sample.csv | Error handling |

### 6.2 Database Seed Data

**User Test Accounts:**
```
- user1@test.com (USD, 100 transactions, 5 budgets)
- user2@test.com (EUR, 500 transactions, 10 budgets, multi-account)
- user3@test.com (RON, minimal data for UI testing)
- perf-test@test.com (5000+ transactions for performance testing)
```

### 6.3 Event Test Messages

**Sample Event Payloads:**
- TransactionCreated (standard, edge cases)
- TransactionCategorized (high/low confidence)
- BudgetAlertTriggered (80%, 100%, 120% thresholds)
- InsightGenerated (various insight types)

---

## 7. Quality Attributes Testing

### 7.1 Performance Testing (NFR4, NFR5, NFR7)

**Performance Requirements:**
- API response time: p95 <500ms, p99 <1000ms
- Event processing: <1 second end-to-end
- CSV import: 1000 rows in <5 seconds

**Performance Test Plan:**

```gherkin
Scenario: API Gateway handles concurrent requests
  Given 50 concurrent users
  When users make API calls to various endpoints
  Then p95 response time should be <500ms
  And p99 response time should be <1000ms
  And error rate should be <1%

Scenario: CSV import handles large files
  Given a CSV file with 1000 transactions
  When user uploads and imports the file
  Then import should complete in <5 seconds
  And all 1000 transactions should be persisted

Scenario: Event processing maintains low latency
  Given 100 TransactionCreated events per second
  When AIService consumes and categorizes
  Then average latency should be <1 second
  And no events should be lost
```

### 7.2 Security Testing (NFR15)

**Security Requirements:**
- Passwords hashed with BCrypt
- JWT tokens secure (signed, expiring)
- No OWASP Top 10 vulnerabilities

**Security Test Plan:**

```gherkin
Scenario: Passwords are securely hashed
  Given a user registers with password "SecurePass123!"
  When password is stored in database
  Then password should be BCrypt hashed
  And plaintext password should never be logged

Scenario: JWT tokens expire correctly
  Given a user logs in and receives access token
  When 1 hour passes
  Then access token should be rejected as expired
  And refresh token flow should issue new access token

Scenario: SQL injection is prevented
  Given a malicious input "'; DROP TABLE users; --"
  When submitted to any input field
  Then input should be sanitized/parameterized
  And no SQL should be executed
```

### 7.3 Reliability Testing (NFR8)

**Reliability Requirements:**
- 99% uptime during dev/test phase
- Graceful degradation when services unavailable

**Reliability Test Plan:**

```gherkin
Scenario: Service recovers from RabbitMQ failure
  Given all services are running normally
  When RabbitMQ container is stopped
  Then services should log connection errors
  And services should retry connections
  When RabbitMQ is restarted
  Then all services should reconnect automatically

Scenario: Circuit breaker prevents cascade failures
  Given AIService is down
  When 50% of requests fail
  Then circuit breaker should open
  And fallback behavior should execute (category = null)
```

### 7.4 Accessibility Testing (WCAG AA)

**Accessibility Requirements:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support

**Accessibility Test Plan:**

```gherkin
Scenario: User navigates entire app with keyboard only
  Given user is on login page
  When user tabs through all interactive elements
  Then all buttons, links, inputs should be focusable
  And focus indicators should be visible
  And user can complete login without mouse

Scenario: Screen reader announces budget status
  Given a budget with 85% used (Warning status)
  When screen reader reads budget progress bar
  Then it should announce "Budget: Dining, Warning, 85% used, $425 of $500"
  And color alone should not convey status
```

### 7.5 AI Quality Testing (NFR6)

**AI Quality Requirements:**
- Categorization accuracy >80%
- Transparent recommendations with WHY and HOW

**AI Quality Test Plan:**

```gherkin
Scenario: AI categorizes common merchants accurately
  Given a validation set of 100 transactions with known categories
  When AIService categorizes all transactions
  Then accuracy should be >80%
  And confidence scores should correlate with correctness

Scenario: AI recommendation explains WHY pattern occurred
  Given user's dining spending increased 40%
  When AI generates recommendation
  Then recommendation should include:
    - "Why": Root cause analysis
    - "How": Actionable suggestion
    - "Learn": Educational context
```

---

## 8. Epic-Level Test Coverage

### 8.1 Epic 1: Foundation Setup

**Test Focus:** Infrastructure validation, manual verification

**Test Cases:**
- TC-INFRA-001: Verify `docker-compose up` starts all services
- TC-INFRA-002: Verify all 6 PostgreSQL databases created
- TC-INFRA-003: Verify RabbitMQ accessible at localhost:15672
- TC-INFRA-004: Verify Prometheus accessible
- TC-INFRA-005: Verify Grafana accessible
- TC-INFRA-006: Verify all service health endpoints return 200 OK

**Success Criteria:**
- All infrastructure services start successfully
- All service projects compile without errors

---

### 8.2 Epic 2: User Service & Authentication

**Test Focus:** Unit tests (80%+), integration tests, security tests

**Test Cases:**

**Unit Tests:**
- TC-AUTH-U-001: Password validation enforces 8+ characters
- TC-AUTH-U-002: Password validation requires uppercase
- TC-AUTH-U-003: Password validation requires lowercase
- TC-AUTH-U-004: Password validation requires number
- TC-AUTH-U-005: Password validation requires special character
- TC-AUTH-U-006: Email validation rejects invalid formats
- TC-AUTH-U-007: Duplicate email registration returns error
- TC-AUTH-U-008: Password hashing uses BCrypt
- TC-AUTH-U-009: JWT token generation includes user ID claim
- TC-AUTH-U-010: JWT token expiration set to 1 hour

**Integration Tests:**
- TC-AUTH-I-001: User registration creates record in database
- TC-AUTH-I-002: User login returns valid JWT access token
- TC-AUTH-I-003: User login returns refresh token
- TC-AUTH-I-004: Token refresh generates new access token
- TC-AUTH-I-005: Expired access token rejected with 401
- TC-AUTH-I-006: Invalid credentials return 401
- TC-AUTH-I-007: UserRegistered event published on registration

**E2E Tests:**
- TC-AUTH-E2E-001: Complete registration and login flow
- TC-AUTH-E2E-002: Token refresh flow after 1 hour
- TC-AUTH-E2E-003: Logout clears tokens

**Security Tests:**
- TC-AUTH-SEC-001: Password never returned in API responses
- TC-AUTH-SEC-002: Password never logged
- TC-AUTH-SEC-003: JWT tampering detected
- TC-AUTH-SEC-004: Weak password rejected

**Success Criteria:**
- Unit test coverage >80%
- All integration tests pass
- Security tests pass

---

### 8.3 Epic 3: API Gateway

**Test Focus:** Integration tests, contract tests, performance tests

**Test Cases:**

**Integration Tests:**
- TC-GATEWAY-I-001: Route /api/users/* to UserService
- TC-GATEWAY-I-002: Route /api/transactions/* to TransactionService
- TC-GATEWAY-I-003: Route /api/budgets/* to BudgetService
- TC-GATEWAY-I-004: Route /api/ai/* to AIService
- TC-GATEWAY-I-005: Route /api/notifications/* to NotificationService
- TC-GATEWAY-I-006: Invalid route returns 404
- TC-GATEWAY-I-007: JWT validation rejects missing token
- TC-GATEWAY-I-008: JWT validation rejects invalid token
- TC-GATEWAY-I-009: CORS allows frontend origin
- TC-GATEWAY-I-010: CORS blocks unauthorized origins

**Performance Tests:**
- TC-GATEWAY-P-001: Rate limiting enforces 10 req/s general
- TC-GATEWAY-P-002: Rate limiting enforces 5 req/min for /login
- TC-GATEWAY-P-003: Rate limit exceeded returns 429

**Monitoring Tests:**
- TC-GATEWAY-M-001: All requests logged with correlation IDs
- TC-GATEWAY-M-002: Health check aggregates service statuses

**Success Criteria:**
- All routes functional
- Rate limiting works
- CORS configured correctly

---

### 8.4 Epic 4: Transaction Service - CRUD

**Test Focus:** Unit tests (80%+), integration tests, E2E tests

**Test Cases:**

**Unit Tests:**
- TC-TXN-U-001: Transaction validation requires date
- TC-TXN-U-002: Transaction validation requires amount
- TC-TXN-U-003: Transaction validation requires merchant
- TC-TXN-U-004: Future date rejected
- TC-TXN-U-005: Amount supports positive and negative
- TC-TXN-U-006: Duplicate detection (same merchant/amount within 5 min)
- TC-TXN-U-007: Pagination logic correct (page 1, size 50)
- TC-TXN-U-008: Filter by date range
- TC-TXN-U-009: Filter by category
- TC-TXN-U-010: Summary aggregation by category

**Integration Tests:**
- TC-TXN-I-001: Create transaction persists to database
- TC-TXN-I-002: Create transaction publishes TransactionCreated event
- TC-TXN-I-003: Get transactions returns paginated results
- TC-TXN-I-004: Update transaction publishes TransactionUpdated event
- TC-TXN-I-005: Delete transaction publishes TransactionDeleted event
- TC-TXN-I-006: User can only access own transactions (authorization)
- TC-TXN-I-007: Summary endpoint returns correct totals

**E2E Tests:**
- TC-TXN-E2E-001: User adds manual transaction and sees it in list
- TC-TXN-E2E-002: User filters transactions by date range
- TC-TXN-E2E-003: User edits transaction and changes persist
- TC-TXN-E2E-004: User deletes transaction and it's removed

**Success Criteria:**
- Unit test coverage >80%
- All CRUD operations functional
- Events published correctly

---

### 8.5 Epic 5: Transaction Service - CSV Import

**Test Focus:** Edge case testing, integration tests, performance tests

**Test Cases:**

**Unit Tests:**
- TC-CSV-U-001: Parse CSV with comma delimiter
- TC-CSV-U-002: Parse CSV with semicolon delimiter
- TC-CSV-U-003: Parse CSV with tab delimiter
- TC-CSV-U-004: Parse date format MM/DD/YYYY
- TC-CSV-U-005: Parse date format DD/MM/YYYY
- TC-CSV-U-006: Parse date format YYYY-MM-DD
- TC-CSV-U-007: Parse negative amount with "-" sign
- TC-CSV-U-008: Parse negative amount with parentheses "(50.00)"
- TC-CSV-U-009: Handle missing optional columns
- TC-CSV-U-010: Skip malformed rows and continue processing

**Integration Tests:**
- TC-CSV-I-001: Import Chase CSV format (1000 rows)
- TC-CSV-I-002: Import Bank of America CSV format
- TC-CSV-I-003: Import Wells Fargo CSV format
- TC-CSV-I-004: Import ING (Romania) CSV format
- TC-CSV-I-005: Import Revolut CSV format
- TC-CSV-I-006: Import with errors returns summary (imported/failed counts)
- TC-CSV-I-007: Save CSV template for reuse
- TC-CSV-I-008: Load saved template auto-populates mappings
- TC-CSV-I-009: Bulk import publishes TransactionsBulkImported event

**Performance Tests:**
- TC-CSV-P-001: Import 1000 rows completes in <5 seconds
- TC-CSV-P-002: Import 5000 rows completes in <15 seconds
- TC-CSV-P-003: Concurrent imports (5 users) don't block each other

**E2E Tests:**
- TC-CSV-E2E-001: Complete CSV import wizard flow
- TC-CSV-E2E-002: Import with errors displays error details
- TC-CSV-E2E-003: Imported transactions appear in list
- TC-CSV-E2E-004: Save and reuse template for same bank

**Success Criteria:**
- Supports all major bank CSV formats
- 1000+ rows processed successfully
- Templates save and reuse correctly

---

### 8.6 Epic 6: AI Service - Categorization

**Test Focus:** AI accuracy tests, integration tests, mock tests

**Test Cases:**

**Unit Tests (with mocked AI):**
- TC-AI-U-001: Categorization service calls AI provider
- TC-AI-U-002: Parse AI response to extract category
- TC-AI-U-003: Parse AI response to extract confidence score
- TC-AI-U-004: Cache categorization by merchant name
- TC-AI-U-005: Retrieve cached categorization (TTL 30 days)
- TC-AI-U-006: Retry logic for AI API failures (3 retries)
- TC-AI-U-007: Fallback to "Other" category on API failure

**Integration Tests:**
- TC-AI-I-001: Consume TransactionCreated event
- TC-AI-I-002: Categorize transaction via AI
- TC-AI-I-003: Publish TransactionCategorized event
- TC-AI-I-004: Auto-categorization only applied if confidence >=70%
- TC-AI-I-005: Manual override sets confidence to 100%
- TC-AI-I-006: Rate limiting enforces max 50 API calls per minute

**AI Accuracy Tests:**
- TC-AI-ACC-001: Validate accuracy >80% on test set of 100 transactions
- TC-AI-ACC-002: Common merchants (Whole Foods, Starbucks, Shell) categorized correctly
- TC-AI-ACC-003: Confidence scores correlate with accuracy

**E2E Tests:**
- TC-AI-E2E-001: Create transaction triggers AI categorization
- TC-AI-E2E-002: User sees confidence badge in transaction list
- TC-AI-E2E-003: User overrides AI category manually

**Success Criteria:**
- AI categorization accuracy >80%
- Confidence scores reliable
- Caching reduces API costs

---

### 8.7 Epic 7: AI Service - Insights

**Test Focus:** AI quality tests, integration tests, UAT

**Test Cases:**

**Unit Tests:**
- TC-INSIGHT-U-001: Detect spending increase >20%
- TC-INSIGHT-U-002: Detect spending decrease >20%
- TC-INSIGHT-U-003: Detect new category (0 → spending)
- TC-INSIGHT-U-004: Detect abandoned category (spending → 0)
- TC-INSIGHT-U-005: Generate top 3 patterns

**Integration Tests:**
- TC-INSIGHT-I-001: Generate insights for user with 3 months data
- TC-INSIGHT-I-002: AI recommendation includes WHY explanation
- TC-INSIGHT-I-003: AI recommendation includes HOW suggestion
- TC-INSIGHT-I-004: AI recommendation includes educational context
- TC-INSIGHT-I-005: Publish InsightGenerated event

**AI Quality Tests:**
- TC-INSIGHT-Q-001: Recommendations are actionable (manual review)
- TC-INSIGHT-Q-002: Explanations are transparent (manual review)
- TC-INSIGHT-Q-003: Educational context is accurate (manual review)

**E2E Tests:**
- TC-INSIGHT-E2E-001: User views AI Coaching Center
- TC-INSIGHT-E2E-002: User expands insight card to see WHY/HOW/LEARN
- TC-INSIGHT-E2E-003: User dismisses insight

**Success Criteria:**
- Insights generated for key patterns
- Recommendations transparent and actionable

---

### 8.8 Epic 8: Budget Service

**Test Focus:** Unit tests, integration tests, event tests

**Test Cases:**

**Unit Tests:**
- TC-BUD-U-001: Budget validation requires category
- TC-BUD-U-002: Budget validation requires limit >0
- TC-BUD-U-003: One budget per category per month
- TC-BUD-U-004: Calculate spent amount from transactions
- TC-BUD-U-005: Calculate percentage used (spent / limit)
- TC-BUD-U-006: Determine status (On Track / Warning / Exceeded)
- TC-BUD-U-007: Detect 80% threshold crossing
- TC-BUD-U-008: Detect 100% threshold crossing
- TC-BUD-U-009: Alert only once per threshold

**Integration Tests:**
- TC-BUD-I-001: Create budget persists to database
- TC-BUD-I-002: Consume TransactionCreated event
- TC-BUD-I-003: Update budget tracking on transaction
- TC-BUD-I-004: Publish BudgetThresholdWarning at 80%
- TC-BUD-I-005: Publish BudgetExceeded at 100%
- TC-BUD-I-006: Budget status endpoint returns correct data

**E2E Tests:**
- TC-BUD-E2E-001: User creates budget and sees progress bar
- TC-BUD-E2E-002: User adds transactions and budget updates in real-time
- TC-BUD-E2E-003: User receives notification at 80% threshold

**Success Criteria:**
- Real-time budget tracking functional
- Alerts triggered at correct thresholds

---

### 8.9 Epic 9: Notification Service

**Test Focus:** Integration tests, email tests, E2E tests

**Test Cases:**

**Unit Tests:**
- TC-NOT-U-001: Create notification record
- TC-NOT-U-002: Mark notification as read
- TC-NOT-U-003: Filter unread notifications
- TC-NOT-U-004: Email template rendering

**Integration Tests:**
- TC-NOT-I-001: Consume BudgetThresholdWarning event
- TC-NOT-I-002: Create in-app notification
- TC-NOT-I-003: Send email notification
- TC-NOT-I-004: Retry email on SMTP failure
- TC-NOT-I-005: Check user preferences before sending email
- TC-NOT-I-006: Consume InsightGenerated event

**Email Tests:**
- TC-NOT-EMAIL-001: Budget alert email contains correct content
- TC-NOT-EMAIL-002: Email subject line correct
- TC-NOT-EMAIL-003: Email contains CTA button to app
- TC-NOT-EMAIL-004: Unsubscribe link included

**E2E Tests:**
- TC-NOT-E2E-001: User receives in-app notification
- TC-NOT-E2E-002: Notification bell shows unread count
- TC-NOT-E2E-003: User clicks notification and marks as read
- TC-NOT-E2E-004: User disables email notifications in preferences

**Success Criteria:**
- In-app notifications displayed correctly
- Email delivery functional

---

### 8.10 Epic 10: Event-Driven Integration

**Test Focus:** Integration tests, event flow tests, resilience tests

**Test Cases:**

**Integration Tests:**
- TC-EVENT-I-001: TransactionCreated event published and consumed
- TC-EVENT-I-002: TransactionCategorized event published and consumed
- TC-EVENT-I-003: BudgetAlertTriggered event published and consumed
- TC-EVENT-I-004: InsightGenerated event published and consumed
- TC-EVENT-I-005: Correlation IDs propagated through events
- TC-EVENT-I-006: Failed messages moved to DLQ after 5 retries
- TC-EVENT-I-007: Circuit breaker opens at 50% failure rate
- TC-EVENT-I-008: Event processing latency <1 second

**Resilience Tests:**
- TC-EVENT-R-001: Service restarts and reconnects to RabbitMQ
- TC-EVENT-R-002: Messages not lost during RabbitMQ restart
- TC-EVENT-R-003: Idempotent event handling (duplicate events ignored)

**Monitoring Tests:**
- TC-EVENT-M-001: RabbitMQ metrics visible in Grafana
- TC-EVENT-M-002: Queue depths monitored
- TC-EVENT-M-003: Event throughput tracked

**Success Criteria:**
- All event flows functional
- No message loss
- Monitoring dashboards operational

---

### 8.11 Epic 11: Frontend Polish & UX

**Test Focus:** E2E tests, visual regression, accessibility tests

**Test Cases:**

**E2E Tests:**
- TC-FE-E2E-001: Dashboard displays correctly
- TC-FE-E2E-002: All navigation links work
- TC-FE-E2E-003: Loading states shown during API calls
- TC-FE-E2E-004: Error boundaries catch React errors
- TC-FE-E2E-005: Toast notifications appear on actions

**Responsive Design Tests:**
- TC-FE-RESP-001: Mobile (375px) layout correct
- TC-FE-RESP-002: Tablet (768px) layout correct
- TC-FE-RESP-003: Desktop (1024px+) layout correct
- TC-FE-RESP-004: Hamburger menu on mobile

**Accessibility Tests:**
- TC-FE-A11Y-001: All pages pass axe DevTools audit
- TC-FE-A11Y-002: Lighthouse accessibility score >90
- TC-FE-A11Y-003: Keyboard navigation functional

**Performance Tests:**
- TC-FE-PERF-001: Bundle size <500KB gzipped
- TC-FE-PERF-002: Lighthouse performance score >90

**Success Criteria:**
- Responsive on all devices
- Accessibility compliance
- Good performance scores

---

### 8.12 Epic 12: Testing & Quality

**Test Focus:** Comprehensive test suite execution, coverage reports

**Test Cases:**
- TC-TEST-001: All unit tests pass (>80% coverage)
- TC-TEST-002: All integration tests pass
- TC-TEST-003: All E2E tests pass
- TC-TEST-004: Performance tests meet SLAs
- TC-TEST-005: Security tests pass (OWASP clean)
- TC-TEST-006: Code coverage report generated

**Success Criteria:**
- Unit test coverage >80%
- Integration test coverage >60%
- All critical E2E tests pass
- Performance SLAs met
- No high/critical security vulnerabilities

---

### 8.13 Epic 13: Deployment & DevOps

**Test Focus:** Smoke tests, deployment validation, monitoring tests

**Test Cases:**
- TC-DEPLOY-001: Production docker-compose up successful
- TC-DEPLOY-002: All services healthy after deployment
- TC-DEPLOY-003: Nginx reverse proxy routes correctly
- TC-DEPLOY-004: SSL certificate valid
- TC-DEPLOY-005: Database backups run successfully
- TC-DEPLOY-006: Prometheus collecting metrics
- TC-DEPLOY-007: Grafana dashboards functional
- TC-DEPLOY-008: Alerting rules configured

**Success Criteria:**
- Production deployment successful
- Monitoring operational

---

### 8.14 Epic 14: Documentation & Beta Prep

**Test Focus:** UAT, usability testing, feedback collection

**Test Cases:**
- TC-BETA-001: User documentation complete and clear
- TC-BETA-002: API documentation accessible at /api/docs
- TC-BETA-003: CSV import guide covers 3+ banks
- TC-BETA-004: Feedback form functional
- TC-BETA-005: Privacy policy reviewed

**UAT Success Criteria:**
- 5-10 beta users recruited
- 80%+ task completion rate
- NPS >40
- 60%+ retention after 30 days

---

## 9. Test Automation Strategy

### 9.1 CI/CD Integration

**Automated Test Execution:**

```yaml
GitHub Actions Workflow:

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup .NET 8
      - Run dotnet test (all services)
      - Generate code coverage report
      - Upload coverage to Coveralls
      - Fail if coverage <80%

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Start TestContainers (PostgreSQL, RabbitMQ)
      - Run integration tests
      - Fail if any test fails

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - docker-compose up (all services)
      - Run Playwright E2E tests
      - Capture screenshots on failure
      - Fail if any critical test fails

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run OWASP ZAP baseline scan
      - Fail if high/critical vulnerabilities found

  performance-tests:
    runs-on: ubuntu-latest
    steps:
      - docker-compose up
      - Run k6 load tests
      - Fail if p95 >500ms
```

### 9.2 Test Execution Frequency

| Test Type | Frequency | Trigger | Duration |
|-----------|----------|---------|----------|
| **Unit Tests** | Every commit | Git push | ~2 min |
| **Integration Tests** | Every commit | Git push | ~5 min |
| **E2E Tests** | Every PR | Pull request | ~10 min |
| **Performance Tests** | Nightly | Scheduled | ~15 min |
| **Security Scan** | Weekly | Scheduled | ~20 min |
| **Full Regression** | Pre-release | Manual | ~30 min |

---

## 10. Quality Gates & Acceptance Criteria

### 10.1 Story-Level Quality Gates

**Before Story Marked "Done":**
- [ ] All acceptance criteria met
- [ ] Unit tests written and passing (80%+ coverage for Core logic)
- [ ] Integration tests written and passing (if applicable)
- [ ] Code reviewed and approved
- [ ] No high/critical bugs open
- [ ] Documentation updated

### 10.2 Epic-Level Quality Gates

**Before Epic Marked "Complete":**
- [ ] All stories in epic completed
- [ ] Epic acceptance criteria met
- [ ] Integration tests cover epic scope
- [ ] E2E test for critical epic flow passes
- [ ] Performance tested (if applicable)
- [ ] Security tested (if applicable)
- [ ] Demo completed with PM

### 10.3 Release Quality Gates

**Before Production Deployment:**
- [ ] All P0 epics completed
- [ ] Unit test coverage >80%
- [ ] Integration test coverage >60%
- [ ] All critical E2E tests pass
- [ ] Performance SLAs met (p95 <500ms)
- [ ] Security scan clean (no high/critical)
- [ ] WCAG AA accessibility compliance verified
- [ ] Production deployment tested in staging
- [ ] Rollback plan documented
- [ ] Monitoring dashboards operational
- [ ] PM sign-off

---

## 11. Test Schedule & Milestones

### 11.1 Testing Milestones

| Week | Epic | Testing Milestone | Deliverables |
|------|------|------------------|--------------|
| **Week 1** | Epic 1 | Infrastructure validated | All services healthy, docker-compose working |
| **Week 2** | Epic 2, 3 | Auth & Gateway tested | Unit tests >80%, integration tests pass |
| **Week 3-4** | Epic 4, 5 | Transaction CRUD & CSV tested | CSV edge cases pass, 1000+ rows imported |
| **Week 5** | Epic 6 | AI categorization validated | >80% accuracy achieved |
| **Week 6** | Epic 7, 8 | AI insights & budgets tested | Recommendations transparent, alerts working |
| **Week 7** | Epic 9 | Notifications tested | Email delivery, in-app notifications functional |
| **Week 8** | Epic 10, 12 | Integration & quality validated | Full regression passes, performance tested |
| **Week 9** | Epic 13 | Deployment validated | Production deployment successful |
| **Week 10-13** | Epic 14 | Beta testing complete | 5-10 users, 30+ days, feedback collected |

---

## 12. Defect Management

### 12.1 Bug Severity Definitions

| Severity | Definition | Examples | Response Time |
|----------|-----------|----------|---------------|
| **Critical** | System unusable, data loss, security breach | Authentication broken, database corrupted | Immediate fix |
| **High** | Major feature broken, workaround exists | CSV import failing for all banks | Fix within 1 day |
| **Medium** | Feature partially broken, minor impact | Filtering doesn't work for one category | Fix within 1 week |
| **Low** | Cosmetic issue, minor inconvenience | Button text misaligned | Fix when convenient |

### 12.2 Bug Workflow

```
1. Bug Reported (GitHub Issue)
   ↓
2. Triage (Severity assigned)
   ↓
3. Investigation (Root cause analysis)
   ↓
4. Fix Implemented
   ↓
5. Code Review
   ↓
6. Regression Test (Ensure fix works, no new bugs)
   ↓
7. Closed (Verified in deployment)
```

---

## 13. Test Metrics & Reporting

### 13.1 Key Test Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Unit Test Coverage** | >80% | Coverlet reports |
| **Integration Test Coverage** | >60% | Manual tracking |
| **Test Pass Rate** | 100% | CI/CD dashboard |
| **Defect Density** | <5 bugs per epic | GitHub Issues |
| **Test Automation %** | >90% | Automated tests / total tests |
| **Mean Time to Detect (MTTD)** | <1 day | Bug discovery time |
| **Mean Time to Resolve (MTTR)** | <3 days | Bug fix time |

### 13.2 Test Reporting

**Weekly Test Status Report:**
- Test execution summary (pass/fail counts)
- Code coverage trends
- New bugs opened vs. closed
- Performance test results
- Risks and blockers

**Release Test Report:**
- Total test cases executed
- Pass/fail breakdown by epic
- Coverage metrics
- Known issues and workarounds
- Go/No-Go recommendation

---

## Appendix A: Test Case Templates

### Unit Test Template (Given-When-Then)

```csharp
[Fact]
public void MethodName_Scenario_ExpectedBehavior()
{
    // GIVEN - Arrange
    var input = new SomeInput();
    var service = new ServiceUnderTest();

    // WHEN - Act
    var result = service.Method(input);

    // THEN - Assert
    result.Should().Be(expectedValue);
}
```

### Integration Test Template

```csharp
public class ServiceIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task EndpointName_Scenario_ExpectedBehavior()
    {
        // GIVEN - Arrange (with TestContainers)
        await using var dbContainer = new PostgreSqlContainer();
        await dbContainer.StartAsync();

        // WHEN - Act (call API)
        var response = await _client.PostAsync("/api/endpoint", content);

        // THEN - Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

### E2E Test Template (Playwright)

```typescript
test('User Journey - Scenario', async ({ page }) => {
  // GIVEN - Navigate to page
  await page.goto('/login');

  // WHEN - Perform actions
  await page.fill('input[name="email"]', 'user@test.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');

  // THEN - Verify outcome
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Appendix B: Sample Test Data

### Sample CSV Files

**Chase Format (chase-sample.csv):**
```csv
Transaction Date,Post Date,Description,Category,Type,Amount
01/15/2025,01/16/2025,WHOLE FOODS,Shopping,Sale,(45.67)
01/14/2025,01/15/2025,STARBUCKS,Food & Drink,Sale,(5.50)
01/13/2025,01/14/2025,SHELL GAS,Gas,Sale,(52.00)
```

**ING Romania Format (ing-sample.csv):**
```csv
Data;Beneficiar;Detalii;Debit;Credit;Sold
15.01.2025;MEGA IMAGE;Cumparaturi;45,67;;1234,56
14.01.2025;STARBUCKS;Cafea;5,50;;1189,89
```

### Sample User Accounts

```json
{
  "testUsers": [
    {
      "email": "user1@test.com",
      "password": "TestPass123!",
      "currency": "USD",
      "transactionCount": 100,
      "budgetCount": 5
    },
    {
      "email": "user2@test.com",
      "password": "TestPass123!",
      "currency": "EUR",
      "transactionCount": 500,
      "budgetCount": 10
    }
  ]
}
```

---

## Appendix C: Quality Checklists

### Pre-Release Quality Checklist

- [ ] All P0 and P1 epics completed
- [ ] Unit test coverage >80%
- [ ] Integration test coverage >60%
- [ ] All E2E tests pass
- [ ] Performance tests meet SLAs (p95 <500ms)
- [ ] Security scan clean (no high/critical vulnerabilities)
- [ ] WCAG AA accessibility verified
- [ ] All browsers tested (Chrome, Firefox, Safari, Edge)
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] API documentation updated
- [ ] User documentation complete
- [ ] Monitoring dashboards operational
- [ ] Backup/restore tested
- [ ] Rollback plan documented
- [ ] PM sign-off received

---

**End of Test Plan**

**Document Control:**
- Version: 1.0
- Last Updated: 2025-01-05
- Next Review: Weekly during development
- Maintained By: Quinn (Test Architect)
