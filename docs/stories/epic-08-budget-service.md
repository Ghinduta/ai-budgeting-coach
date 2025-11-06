# Epic 8: Budget Service

**Epic ID:** EPIC-08
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 4-5 days
**Owner:** Dev Team
**Depends On:** Epic 4 (Transaction Service), Epic 10 (Event Integration)

---

## Epic Overview

Implement the Budget Service for creating and tracking monthly budgets per category, with real-time spending monitoring and automatic alert generation when users approach or exceed budget thresholds.

**Goal:** Enable budget tracking with proactive alerts at 80%, 100%, and 120% thresholds.

---

## Stories

### Story 8.1: Implement Budget Service Clean Architecture
**Story ID:** STORY-08-01
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create the three-layer Clean Architecture structure for Budget Service.

**Acceptance Criteria:**
- [ ] BudgetService.API project created
- [ ] BudgetService.Core project created
- [ ] BudgetService.Infrastructure project created
- [ ] Project references configured
- [ ] NuGet packages installed (EF Core, MassTransit, Hangfire, Serilog)
- [ ] Solution compiles successfully

**Implementation Notes:**
- Hangfire for background job scheduling
- Follow same structure as other services

**Testing:**
- Verify compilation
- Check project references

**Dependencies:**
- Epic 1: Foundation Setup

---

### Story 8.2: Create Budget Entity and BudgetAlert Entity
**Story ID:** STORY-08-02
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Define domain entities for budgets and budget alerts.

**Acceptance Criteria:**
- [ ] Budget entity: Id, UserId, Category, Month (YYYYMM format), LimitAmount, CreatedAt, UpdatedAt, DeletedAt
- [ ] BudgetAlert entity: Id, BudgetId, UserId, ThresholdType (enum: Warning80, Exceeded100, Critical120), TriggeredAt, NotifiedAt
- [ ] Enums defined: ThresholdType
- [ ] Unique constraint: one budget per user+category+month
- [ ] Navigation properties configured
- [ ] Month stored as integer (202501 for January 2025)

**Implementation Notes:**
- LimitAmount stored as decimal(18,2)
- Track alert history to prevent duplicate notifications
- Soft delete support

**Testing:**
- Unit tests for entity validation
- Test unique constraint

**Dependencies:**
- Story 8.1

---

### Story 8.3: Implement BudgetDbContext with EF Core
**Story ID:** STORY-08-03
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create Entity Framework Core DbContext for Budget Service.

**Acceptance Criteria:**
- [ ] BudgetDbContext inherits from DbContext
- [ ] DbSet properties for Budgets and BudgetAlerts
- [ ] Fluent API configurations
- [ ] Unique index on (UserId, Category, Month)
- [ ] Index on UserId for querying
- [ ] Index on Month for monthly queries
- [ ] Soft delete query filter
- [ ] Foreign key relationships configured

**Implementation Notes:**
- Use HasQueryFilter for soft deletes
- Configure cascade delete: delete budget → delete alerts

**Testing:**
- Test unique constraint enforcement
- Verify indexes in migration

**Dependencies:**
- Story 8.2

---

### Story 8.4: Create BudgetsController with CRUD Endpoints
**Story ID:** STORY-08-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Implement REST API controller for budget management.

**Acceptance Criteria:**
- [ ] POST /api/budgets - Create budget
- [ ] GET /api/budgets - List budgets (filterable by month)
- [ ] GET /api/budgets/{id} - Get single budget
- [ ] PUT /api/budgets/{id} - Update budget limit
- [ ] DELETE /api/budgets/{id} - Delete budget (soft delete)
- [ ] All endpoints require [Authorize]
- [ ] DTOs for request/response
- [ ] Authorization: users can only access their own budgets
- [ ] Validation: limit amount must be positive
- [ ] Default to current month if month not specified

**Implementation Notes:**
- Return 409 Conflict if duplicate budget exists
- Return budget with current spending status
- Use AutoMapper for entity ↔ DTO mapping

**Testing:**
- Test all CRUD operations
- Test authorization
- Test validation
- Test duplicate prevention

**Dependencies:**
- Story 8.3

---

### Story 8.5: Implement Budget Status Calculation (Spent vs Limit)
**Story ID:** STORY-08-05
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Calculate real-time budget status by aggregating transaction data.

**Acceptance Criteria:**
- [ ] GET /api/budgets/status endpoint
- [ ] Returns for each budget: budgetId, category, month, limitAmount, spentAmount, remainingAmount, percentageUsed, status (OnTrack/Warning/Exceeded/Critical)
- [ ] Status thresholds: OnTrack (<80%), Warning (80-99%), Exceeded (100-119%), Critical (>=120%)
- [ ] SpentAmount calculated by querying TransactionService or consuming transaction events
- [ ] Real-time: reflects latest transactions
- [ ] Performance: <500ms for user with 20 budgets
- [ ] Cache status for 1 minute to reduce load

**Implementation Notes:**
- Option 1: Query TransactionService API for category totals
- Option 2: Maintain spending cache updated by transaction events (preferred)
- Store aggregated spending in BudgetSpending table (UserId, Category, Month, Amount)

**Testing:**
- Test status calculation accuracy
- Test with various spending levels
- Test performance with large transaction volumes
- Verify caching works

**Dependencies:**
- Story 8.4

---

### Story 8.6: Implement TransactionCreatedConsumer (Real-Time Tracking)
**Story ID:** STORY-08-06
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Listen for transaction events and update budget spending in real-time.

**Acceptance Criteria:**
- [ ] TransactionCreatedConsumer class
- [ ] Consumes TransactionCreated, TransactionUpdated, TransactionDeleted events
- [ ] Updates BudgetSpending aggregate for affected category and month
- [ ] Checks if spending crosses alert thresholds (80%, 100%, 120%)
- [ ] Publishes BudgetAlertTriggered event if threshold crossed
- [ ] Idempotent: handles duplicate events gracefully
- [ ] Handles transaction category changes (rebalance budgets)

**Implementation Notes:**
- Use MassTransit consumer
- Store spending aggregates for efficient queries
- Only trigger alert once per threshold per budget

**Testing:**
- Unit tests with mocked dependencies
- Integration test: create transaction → budget updated → alert triggered
- Test edge cases (spending exactly at threshold)

**Dependencies:**
- Story 8.5
- Epic 10: RabbitMQ configuration

---

### Story 8.7: Implement Alert Threshold Detection (80%, 100%, 120%)
**Story ID:** STORY-08-07
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Detect when budget spending crosses alert thresholds and trigger notifications.

**Acceptance Criteria:**
- [ ] ThresholdDetector service class
- [ ] Detects threshold crossing: 80% (warning), 100% (exceeded), 120% (critical)
- [ ] Creates BudgetAlert record when threshold crossed
- [ ] Alert sent only once per threshold per budget
- [ ] If spending decreases below threshold (refund), reset alert eligibility
- [ ] Alert includes: budget details, threshold percentage, amount over/under
- [ ] Alert timing: within 1 minute of transaction posting

**Implementation Notes:**
- Check previous spending vs. new spending
- Use database transaction to ensure atomicity
- Store last alert threshold triggered

**Testing:**
- Test each threshold detection
- Test alert deduplication
- Test refund scenario (spending decreases)

**Dependencies:**
- Story 8.6

---

### Story 8.8: Implement BudgetMonitoringJob (Background Job with Hangfire)
**Story ID:** STORY-08-08
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Create background job to periodically check all budgets and detect issues missed by event processing.

**Acceptance Criteria:**
- [ ] Hangfire configured in Program.cs
- [ ] BudgetMonitoringJob runs every 6 hours
- [ ] Job checks all active budgets for current month
- [ ] Recalculates spending and compares to thresholds
- [ ] Triggers missed alerts (fallback for event failures)
- [ ] Logs job execution (start time, duration, budgets checked, alerts triggered)
- [ ] Job can be manually triggered via admin endpoint (future)

**Implementation Notes:**
- Use Hangfire RecurringJob
- Job runs at: 00:00, 06:00, 12:00, 18:00 UTC
- Query only budgets where Month = current month
- Skip budgets already at highest threshold

**Testing:**
- Test job execution
- Test alert triggering
- Test job scheduling

**Dependencies:**
- Story 8.7

---

### Story 8.9: Implement Event Publisher for BudgetAlertTriggered
**Story ID:** STORY-08-09
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Publish events when budget alerts are triggered for notification delivery.

**Acceptance Criteria:**
- [ ] BudgetAlertTriggered event defined: AlertId, BudgetId, UserId, Category, Month, LimitAmount, SpentAmount, ThresholdType, Timestamp
- [ ] Event published to RabbitMQ exchange: budget.events
- [ ] Event consumed by NotificationService
- [ ] Event includes correlation ID
- [ ] Publishing failures logged

**Implementation Notes:**
- Use MassTransit Publish
- Event contract in shared/Contracts
- Include full budget details in event for notification rendering

**Testing:**
- Integration test: budget threshold crossed → event published
- Test event consumption

**Dependencies:**
- Story 8.8

---

### Story 8.10: Create Database Migrations
**Story ID:** STORY-08-10
**Priority:** P0
**Estimated:** 1 hour

**Description:**
Generate and apply EF Core migrations for budget database.

**Acceptance Criteria:**
- [ ] Migration creates Budgets table
- [ ] Migration creates BudgetAlerts table
- [ ] Migration creates BudgetSpending table (aggregate cache)
- [ ] All indexes created
- [ ] Unique constraint on (UserId, Category, Month)
- [ ] Foreign key constraints configured
- [ ] Migration can be applied cleanly

**Implementation Notes:**
- Review generated migration
- Test on clean database

**Testing:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**Dependencies:**
- Story 8.3

---

### Story 8.11: Add Unit Tests for Budget Calculation Logic
**Story ID:** STORY-08-11
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create comprehensive unit tests for budget service logic.

**Acceptance Criteria:**
- [ ] Tests for budget CRUD operations
- [ ] Tests for status calculation (spent, remaining, percentage)
- [ ] Tests for threshold detection (80%, 100%, 120%)
- [ ] Tests for alert deduplication
- [ ] Tests for spending aggregation
- [ ] Tests for month boundary handling
- [ ] Code coverage >80% for Core layer

**Implementation Notes:**
- Mock repositories and event publisher
- Test edge cases (spending exactly at threshold, refunds)

**Testing:**
```bash
dotnet test --collect:"XPlat Code Coverage"
```

**Dependencies:**
- Story 8.10

---

### Story 8.12: Add Integration Tests for Budget Alert Flow
**Story ID:** STORY-08-12
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Create end-to-end integration tests for budget tracking and alerting.

**Acceptance Criteria:**
- [ ] Integration test: Create budget → add transactions → verify spending updated
- [ ] Integration test: Spending crosses 80% → alert triggered
- [ ] Integration test: Spending crosses 100% → alert triggered
- [ ] Integration test: Verify event published
- [ ] Tests use Testcontainers (PostgreSQL, RabbitMQ)
- [ ] Tests clean up data

**Implementation Notes:**
- Simulate realistic transaction flows
- Verify alert deduplication

**Testing:**
```bash
dotnet test --filter "Category=Integration&Category=Budget"
```

**Dependencies:**
- Story 8.11

---

### Story 8.13: Create Frontend Budgets Page
**Story ID:** STORY-08-13
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Build budget management page for creating and viewing budgets.

**Acceptance Criteria:**
- [ ] BudgetsPage component accessible from main navigation
- [ ] List of standard categories with "Set Budget" or current budget amount
- [ ] Budget creation form: category, limit amount, month (default current)
- [ ] Budget editing: click budget to edit limit inline
- [ ] Budget deletion with confirmation
- [ ] Month selector to view budgets for different months
- [ ] Empty state: "Set your first budget to start tracking"
- [ ] Loading state while fetching
- [ ] Responsive design

**Implementation Notes:**
- Use TanStack Query for data fetching
- Use MUI components
- Optimistic updates for edits

**Testing:**
- Test budget CRUD flows
- Test month selector
- Test responsive layout

**Dependencies:**
- Story 8.12
- Epic 2: Frontend auth

---

### Story 8.14: Create Budget Creation Form
**Story ID:** STORY-08-14
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Build form for creating new budgets.

**Acceptance Criteria:**
- [ ] Modal form or inline form
- [ ] Category dropdown (only show categories without budgets for selected month)
- [ ] Limit amount input (number, positive, 2 decimal places)
- [ ] Month picker (default current month)
- [ ] Form validation: required fields, positive amount
- [ ] Submit button with loading state
- [ ] Success toast notification
- [ ] Error handling

**Implementation Notes:**
- Use React Hook Form + Zod validation
- Validate category doesn't have budget for selected month
- Format currency input

**Testing:**
- Test form validation
- Test duplicate prevention
- Test success flow

**Dependencies:**
- Story 8.13

---

### Story 8.15: Implement Budget Progress Bars with Color Coding
**Story ID:** STORY-08-15
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Display visual budget progress indicators with color-coded status.

**Acceptance Criteria:**
- [ ] Progress bar for each budget showing spent/limit
- [ ] Color coding: Green (<80%), Yellow (80-99%), Red (100-119%), Dark Red (>=120%)
- [ ] Percentage label on bar
- [ ] Amount label: "$450 of $500"
- [ ] Remaining amount: "$50 left"
- [ ] Status text: "On Track", "Warning", "Exceeded", "Critical"
- [ ] Progress bar animates on data update
- [ ] Accessible: color + text + ARIA labels

**Implementation Notes:**
- Use MUI LinearProgress with custom styling
- Calculate percentage on frontend
- Use theme colors for consistency

**Testing:**
- Test visual appearance for each status
- Test animations
- Test accessibility

**Dependencies:**
- Story 8.14

---

### Story 8.16: Display Budget Status Dashboard
**Story ID:** STORY-08-16
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Create dashboard widget summarizing budget status.

**Acceptance Criteria:**
- [ ] Dashboard shows top 3 budgets by priority: exceeded > warning > on track
- [ ] Each budget card: category, progress bar, amount, status
- [ ] Click card navigates to full budgets page
- [ ] Summary stats: X budgets on track, Y warnings, Z exceeded
- [ ] Updates in real-time when transactions added
- [ ] Empty state: "Set budgets to track your spending"

**Implementation Notes:**
- Fetch from /api/budgets/status
- Sort by status priority and percentage
- Use same BudgetCard component as budgets page

**Testing:**
- Test with various budget statuses
- Test navigation
- Test real-time updates

**Dependencies:**
- Story 8.15

---

## Epic Acceptance Criteria

- ✅ Users can create monthly budgets per category
- ✅ Real-time budget tracking updates as transactions added
- ✅ Alerts triggered at 80%, 100%, 120% thresholds
- ✅ Alerts only sent once per threshold
- ✅ Background job checks budgets every 6 hours
- ✅ BudgetAlertTriggered events published
- ✅ Frontend shows budget progress visually
- ✅ Color coding: green (<80%), yellow (80-100%), red (>100%)
- ✅ Unit test coverage >80%
- ✅ Integration tests pass

---

## Dependencies

**Blocks:**
- Epic 9: Notification Service (consumes BudgetAlertTriggered events)

**Depends On:**
- Epic 4: Transaction Service (source of spending data)
- Epic 10: Event Integration (RabbitMQ messaging)

**Enables:**
- Core user value: spending control and awareness
- Foundation for financial goal tracking

---

## Notes

- Budget alerts are high-priority notifications - ensure reliability
- Future: Budget recommendations based on historical spending
- Future: Rollover budgets (unused amount carries to next month)
- Future: Shared budgets for families
- Future: Budget templates (50/30/20 rule, etc.)
- Consider adding budget categories as reference data
- Test alert timing carefully (should be timely but not annoying)

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
