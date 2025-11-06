# Epic 4: Transaction Service - Core CRUD

**Epic ID:** EPIC-04
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 4-6 days
**Owner:** Dev Team
**Depends On:** Epic 2 (User Service), Epic 3 (API Gateway)

---

## Epic Overview

Implement the Transaction Service with complete CRUD operations, pagination, filtering, transaction summaries, and duplicate detection. This service is the foundation for all financial tracking functionality.

**Goal:** Enable users to manually create, read, update, and delete transactions with robust filtering and summary capabilities.

---

## Stories

### Story 4.1: Implement Transaction Service Clean Architecture Structure
**Story ID:** STORY-04-01
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create the three-layer Clean Architecture structure for Transaction Service.

**Acceptance Criteria:**
- [ ] TransactionService.API project created (ASP.NET Core Web API)
- [ ] TransactionService.Core project created (class library)
- [ ] TransactionService.Infrastructure project created (class library)
- [ ] Project references configured (API → Core, Infrastructure → Core)
- [ ] NuGet packages installed (EF Core, MassTransit, Serilog, FluentValidation, AutoMapper)
- [ ] Solution compiles successfully
- [ ] Basic folder structure created (Entities/, DTOs/, Interfaces/, Services/)

**Implementation Notes:**
- Follow same structure as UserService for consistency
- Reference coding standards document

**Testing:**
- Verify all projects compile
- Check project references

**Dependencies:**
- Epic 1: Foundation Setup

---

### Story 4.2: Create Transaction Entity and CSVImportTemplate Entity
**Story ID:** STORY-04-02
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Define domain entities for Transaction and CSVImportTemplate with all required properties and relationships.

**Acceptance Criteria:**
- [ ] Transaction entity includes: Id, UserId, Date, Amount, Merchant, Account, Category, CategoryConfidence, CategorySource, Notes, ImportBatchId, CreatedAt, UpdatedAt, DeletedAt (soft delete)
- [ ] CSVImportTemplate entity includes: Id, UserId, Name, DateColumn, AmountColumn, MerchantColumn, AccountColumn, NotesColumn, DateFormat, SkipRows, CreatedAt, UpdatedAt
- [ ] Enums defined: CategorySource (AI, User, None)
- [ ] Value objects for Amount (decimal with currency awareness)
- [ ] Navigation properties configured
- [ ] Entities follow domain-driven design principles

**Implementation Notes:**
- Amount stored as decimal with 2 decimal places
- Date stored as DateOnly type
- Category nullable (null until categorized)
- CategoryConfidence range: 0-100

**Testing:**
- Unit tests for entity validation
- Test Amount value object

**Dependencies:**
- Story 4.1

---

### Story 4.3: Implement TransactionDbContext with EF Core
**Story ID:** STORY-04-03
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create Entity Framework Core DbContext for Transaction Service with proper configurations.

**Acceptance Criteria:**
- [ ] TransactionDbContext inherits from DbContext
- [ ] DbSet properties for Transactions and CSVImportTemplates
- [ ] Fluent API configurations in OnModelCreating
- [ ] Indexes created: UserId, Date, Category, Merchant, Account (for performance)
- [ ] Composite index on (UserId, Date) for date range queries
- [ ] Soft delete query filter (DeletedAt IS NULL)
- [ ] Currency configuration (future: multi-currency support)
- [ ] Cascade delete rules configured
- [ ] Database connection string from configuration

**Implementation Notes:**
- Use HasQueryFilter for soft deletes
- Configure decimal precision (18,2) for amounts
- Add check constraints for data integrity

**Testing:**
- Test query filters work correctly
- Verify indexes created in migration

**Dependencies:**
- Story 4.2

---

### Story 4.4: Create TransactionsController with CRUD Endpoints
**Story ID:** STORY-04-04
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Implement REST API controller with all CRUD operations for transactions.

**Acceptance Criteria:**
- [ ] POST /api/transactions - Create transaction
- [ ] GET /api/transactions - List transactions (paginated, filtered)
- [ ] GET /api/transactions/{id} - Get single transaction
- [ ] PUT /api/transactions/{id} - Update transaction
- [ ] DELETE /api/transactions/{id} - Delete transaction (soft delete)
- [ ] All endpoints require [Authorize] attribute
- [ ] DTOs used for request/response (CreateTransactionRequest, UpdateTransactionRequest, TransactionResponse)
- [ ] AutoMapper configured for entity ↔DTO mapping
- [ ] User ID extracted from JWT claims
- [ ] Authorization check: users can only access their own transactions

**Implementation Notes:**
- Return 201 Created with Location header for POST
- Return 204 No Content for DELETE
- Return 404 Not Found if transaction doesn't exist or belongs to different user
- Return 400 Bad Request for validation errors

**Testing:**
- Test all CRUD operations
- Test authorization (user can't access other user's transactions)
- Test validation errors

**Dependencies:**
- Story 4.3

---

### Story 4.5: Implement Pagination for Transaction List
**Story ID:** STORY-04-05
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Add pagination support to transaction list endpoint for handling large datasets efficiently.

**Acceptance Criteria:**
- [ ] Query parameters: page (default 1), pageSize (default 50, max 100)
- [ ] Response includes: data array, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage
- [ ] Pagination uses Skip/Take pattern
- [ ] Total count query optimized (separate query)
- [ ] Page numbers start at 1 (not 0)
- [ ] Invalid page numbers handled gracefully
- [ ] Performance: <500ms for 10,000+ transactions

**Implementation Notes:**
- Create PagedResponse<T> generic class
- Use EF Core compiled queries for performance
- Add index on (UserId, Date DESC) for pagination

**Testing:**
- Test with various page sizes
- Test edge cases (page 0, page > totalPages)
- Performance test with 10,000+ records

**Dependencies:**
- Story 4.4

---

### Story 4.6: Implement Filtering (Date Range, Category, Merchant)
**Story ID:** STORY-04-06
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Add comprehensive filtering capabilities to transaction list endpoint.

**Acceptance Criteria:**
- [ ] Filter by date range: startDate, endDate (ISO 8601 format)
- [ ] Filter by account: account parameter (exact match)
- [ ] Filter by category: category parameter (exact match)
- [ ] Filter by merchant: merchant parameter (case-insensitive partial match)
- [ ] Filters can be combined (AND logic)
- [ ] Date filters default to current month if not specified
- [ ] Invalid date formats return 400 Bad Request
- [ ] Null/empty filters ignored (don't restrict results)
- [ ] Filtering doesn't break pagination

**Implementation Notes:**
- Use IQueryable for efficient query building
- Build dynamic query based on provided filters
- Use parameterized queries to prevent SQL injection
- Consider specification pattern for complex filtering

**Testing:**
- Test each filter individually
- Test filter combinations
- Test with pagination
- Test performance with filters on large datasets

**Dependencies:**
- Story 4.5

---

### Story 4.7: Implement Transaction Summary Endpoint
**Story ID:** STORY-04-07
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Create endpoint that returns aggregated transaction data for dashboard and reporting.

**Acceptance Criteria:**
- [ ] GET /api/transactions/summary endpoint
- [ ] Query parameters: startDate, endDate (default to current month)
- [ ] Response includes: totalIncome (sum of positive amounts), totalExpenses (sum of negative amounts), netCashFlow, transactionCount, categoryBreakdown (dictionary: category → amount), accountBreakdown (dictionary: account → amount)
- [ ] Negative amounts for expenses (already stored as negative)
- [ ] Summary only includes user's transactions
- [ ] Performance: <500ms for 1,000+ transactions
- [ ] Caching for 5 minutes (optional optimization)

**Implementation Notes:**
- Use EF Core GroupBy for aggregations
- Consider materialized view for large datasets
- Currency formatting handled by frontend

**Testing:**
- Test with various date ranges
- Verify calculation accuracy
- Test with mixed income/expense transactions
- Performance test

**Dependencies:**
- Story 4.6

---

### Story 4.8: Implement Duplicate Detection
**Story ID:** STORY-04-08
**Priority:** P1
**Estimated:** 2 hours

**Description:**
Prevent duplicate transactions by detecting same merchant and amount within 5 minutes.

**Acceptance Criteria:**
- [ ] Before creating transaction, check for duplicates
- [ ] Duplicate criteria: same UserId, Merchant (case-insensitive), Amount (exact), Date within 5 minutes
- [ ] If duplicate found, return 409 Conflict with message: "Potential duplicate transaction detected"
- [ ] Response includes details of existing transaction
- [ ] User can override and create anyway (add parameter force=true)
- [ ] Duplicate check only on create, not update
- [ ] Performance: duplicate check <100ms

**Implementation Notes:**
- Use efficient query with indexes
- Consider fuzzy matching for merchant names (future enhancement)
- Log duplicate detections for analysis

**Testing:**
- Test duplicate detection works
- Test force parameter allows creation
- Test 5-minute window boundaries
- Test case-insensitive merchant matching

**Dependencies:**
- Story 4.4

---

### Story 4.9: Create Database Migrations for Transactions
**Story ID:** STORY-04-09
**Priority:** P0
**Estimated:** 1 hour

**Description:**
Generate and apply EF Core migrations for transaction database.

**Acceptance Criteria:**
- [ ] Migration creates Transactions table with all columns
- [ ] Migration creates CSVImportTemplates table
- [ ] All indexes created in migration
- [ ] Check constraints created (e.g., Amount != 0)
- [ ] Foreign key constraints configured
- [ ] Migration can be applied to empty database
- [ ] Migration can be rolled back cleanly
- [ ] Migration documented in README

**Implementation Notes:**
- Review generated migration code before applying
- Add custom SQL for check constraints if needed
- Test migration on clean database

**Testing:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
- Verify database schema matches design
- Test rollback: `dotnet ef database update 0`

**Dependencies:**
- Story 4.3

---

### Story 4.10: Implement Event Publisher for Transaction Events
**Story ID:** STORY-04-10
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Publish events when transactions are created, updated, or deleted for event-driven architecture.

**Acceptance Criteria:**
- [ ] TransactionCreated event published after transaction creation
- [ ] TransactionUpdated event published after transaction update
- [ ] TransactionDeleted event published after soft delete
- [ ] Events include: TransactionId, UserId, Date, Amount, Merchant, Account, Category (if set), Timestamp, CorrelationId
- [ ] Events published only after successful database commit
- [ ] Event publishing failures logged but don't block operation
- [ ] Events published to RabbitMQ exchange: transaction.events
- [ ] MassTransit configured with retry policy

**Implementation Notes:**
- Create event contracts in shared/Contracts
- Use outbox pattern for reliability (future enhancement)
- Include correlation ID from API Gateway

**Testing:**
- Unit tests with mocked event publisher
- Integration test verifies events published to RabbitMQ
- Test event publishing failure handling

**Dependencies:**
- Story 4.4
- Epic 1: RabbitMQ configuration

---

### Story 4.11: Add Unit Tests for TransactionService (80%+ Coverage)
**Story ID:** STORY-04-11
**Priority:** P1
**Estimated:** 5 hours

**Description:**
Create comprehensive unit test suite for Transaction Service business logic.

**Acceptance Criteria:**
- [ ] TransactionService.Tests project created (xUnit)
- [ ] Tests for TransactionService class (CRUD operations)
- [ ] Tests for duplicate detection logic
- [ ] Tests for filtering logic
- [ ] Tests for summary calculations
- [ ] Tests for validation rules
- [ ] Mocks used for repository and event publisher
- [ ] AAA pattern (Arrange, Act, Assert) followed
- [ ] FluentAssertions used for assertions
- [ ] Code coverage >80% for Core layer

**Implementation Notes:**
- Mock ITransactionRepository interface
- Test edge cases (null values, boundary conditions)
- Test validation errors

**Testing:**
```bash
dotnet test --collect:"XPlat Code Coverage"
```
- Review coverage report
- Add tests for uncovered scenarios

**Dependencies:**
- Story 4.10

---

### Story 4.12: Add Integration Tests for CRUD Operations
**Story ID:** STORY-04-12
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create integration tests for complete transaction CRUD workflows using real database.

**Acceptance Criteria:**
- [ ] Integration test project with WebApplicationFactory
- [ ] Testcontainers used for PostgreSQL
- [ ] Test: Create transaction → verify in database → verify event published
- [ ] Test: Update transaction → verify changes persisted
- [ ] Test: Delete transaction → verify soft delete
- [ ] Test: List with pagination and filters
- [ ] Test: Duplicate detection flow
- [ ] Test: Authorization (user can't access other user's transactions)
- [ ] All tests pass consistently
- [ ] Test data cleaned up between tests

**Implementation Notes:**
- Use realistic test data
- Create test utilities for JWT token generation
- Share test database container across tests for speed

**Testing:**
```bash
dotnet test --filter "Category=Integration"
```
- Verify tests are isolated
- Check test execution time (<30s total)

**Dependencies:**
- Story 4.11

---

### Story 4.13: Create Frontend TransactionList Component
**Story ID:** STORY-04-13
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Build React component to display transactions in a table/list with filtering and pagination.

**Acceptance Criteria:**
- [ ] TransactionList.tsx component created
- [ ] MUI DataGrid or Table component used
- [ ] Columns: Date, Merchant, Account, Category, Amount, Actions
- [ ] Pagination controls (previous, next, page selector)
- [ ] Date formatted according to locale
- [ ] Amount formatted with currency symbol
- [ ] Negative amounts in red, positive in green
- [ ] Loading state while fetching data
- [ ] Empty state when no transactions
- [ ] Responsive: table on desktop, cards on mobile
- [ ] Accessibility: keyboard navigation, screen reader support

**Implementation Notes:**
- Use TanStack Query for data fetching and caching
- Use date-fns for date formatting
- Memoize expensive computations

**Testing:**
- Manual testing with various data sets
- Test pagination
- Test responsive layouts
- Test accessibility with keyboard

**Dependencies:**
- Story 4.12
- Epic 2: Frontend auth

---

### Story 4.14: Create Frontend TransactionForm Component (Create/Edit)
**Story ID:** STORY-04-14
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Build form component for creating and editing transactions.

**Acceptance Criteria:**
- [ ] TransactionForm.tsx modal component
- [ ] Fields: Date (date picker), Amount (number input), Merchant (text), Account (text), Category (dropdown), Notes (textarea)
- [ ] React Hook Form for form management
- [ ] Zod schema validation matching backend rules
- [ ] Amount validation: non-zero, decimal with 2 places
- [ ] Date picker with max date = today
- [ ] Category dropdown with standard categories
- [ ] Form submission with loading state
- [ ] Success shows toast notification and closes modal
- [ ] Errors displayed inline per field
- [ ] Form resets on close

**Implementation Notes:**
- Reuse form for both create and edit modes
- Pre-populate fields in edit mode
- Use MUI DatePicker and TextField components

**Testing:**
- Test form validation
- Test create vs edit mode
- Test error handling
- Test form reset

**Dependencies:**
- Story 4.13

---

### Story 4.15: Implement Frontend Transaction Filters
**Story ID:** STORY-04-15
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Add filtering UI to transaction list page.

**Acceptance Criteria:**
- [ ] Filter panel with collapsible drawer (desktop) or bottom sheet (mobile)
- [ ] Date range picker (start date, end date)
- [ ] Account dropdown (populated from user's transactions)
- [ ] Category dropdown (standard categories)
- [ ] Merchant search input (debounced)
- [ ] Apply Filters button triggers API call
- [ ] Clear Filters button resets to defaults
- [ ] Active filters displayed as chips above table
- [ ] Filter state synced to URL query params
- [ ] Filters persist on page reload

**Implementation Notes:**
- Debounce merchant search (300ms)
- Use URL query params for shareable filtered views
- Update URL without full page reload

**Testing:**
- Test each filter individually
- Test filter combinations
- Test URL sync
- Test mobile layout

**Dependencies:**
- Story 4.14

---

### Story 4.16: Create Frontend Transaction Summary Dashboard
**Story ID:** STORY-04-16
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Display transaction summary with visual indicators on dashboard.

**Acceptance Criteria:**
- [ ] Summary cards showing: Total Income, Total Expenses, Net Cash Flow, Transaction Count
- [ ] Date range selector (default: current month)
- [ ] Category breakdown chart (pie or bar chart using Recharts)
- [ ] Account breakdown list
- [ ] Summary updates when date range changes
- [ ] Loading skeleton while fetching
- [ ] Responsive layout (stacked on mobile)
- [ ] Currency formatting with user's currency preference

**Implementation Notes:**
- Use Recharts for visualizations
- Fetch summary data from /api/transactions/summary
- Cache summary data for 5 minutes

**Testing:**
- Test with various date ranges
- Test visual appearance
- Test chart interactions
- Test responsive breakpoints

**Dependencies:**
- Story 4.15

---

## Epic Acceptance Criteria

- ✅ Users can create, read, update, delete transactions
- ✅ Transaction list paginated (50 per page)
- ✅ Filters work correctly (date, category, merchant, account)
- ✅ Summary endpoint returns correct aggregations
- ✅ Duplicate detection prevents identical transactions within 5 minutes
- ✅ Events published for all transaction changes
- ✅ Unit test coverage >80%
- ✅ Integration tests pass
- ✅ Frontend transaction management fully functional
- ✅ Responsive design works on mobile and desktop

---

## Dependencies

**Blocks:**
- Epic 5: CSV Import (extends transaction functionality)
- Epic 6: AI Categorization (consumes TransactionCreated events)
- Epic 8: Budget Service (consumes transaction events for tracking)

**Depends On:**
- Epic 1: Foundation Setup
- Epic 2: User Service & Authentication
- Epic 3: API Gateway

---

## Notes

- Transaction service is core to the application - prioritize stability and performance
- Consider adding transaction categories as reference data (future enhancement)
- Multi-currency support deferred to Phase 2
- Batch operations (bulk delete) deferred to Phase 2
- Transaction attachments (receipts) deferred to Phase 2

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
