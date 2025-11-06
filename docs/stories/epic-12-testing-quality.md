# Epic 12: Testing & Quality

**Epic ID:** EPIC-12
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 5-7 days
**Owner:** Dev Team
**Depends On:** All implementation epics (3-11)

---

## Epic Overview

Establish comprehensive testing coverage across all layers with unit tests, integration tests, E2E tests, performance tests, and security audits. This epic ensures code quality and reliability before production deployment.

**Goal:** Achieve >80% unit test coverage, comprehensive integration tests, E2E tests for critical flows, and pass security audit.

---

## Stories

### Story 12.1: Achieve 80%+ Unit Test Coverage for All Services
**Story ID:** STORY-12-01
**Priority:** P0
**Estimated:** 8 hours

**Description:**
Write or expand unit tests to achieve target coverage across all microservices.

**Acceptance Criteria:**
- [ ] UserService.Core: >80% coverage
- [ ] TransactionService.Core: >80% coverage
- [ ] AIService.Core: >80% coverage
- [ ] BudgetService.Core: >80% coverage
- [ ] NotificationService.Core: >80% coverage
- [ ] All critical business logic covered
- [ ] Edge cases and error scenarios tested
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Tests are fast (<5s total per service)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Code coverage reports generated

**Implementation Notes:**
- Focus on Core layer (business logic)
- Use Moq for mocking dependencies
- Use FluentAssertions for readable assertions
- Generate coverage with `dotnet test --collect:"XPlat Code Coverage"`
- Use Coverlet for coverage analysis

**Testing:**
```bash
dotnet test --collect:"XPlat Code Coverage"
dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:**/coverage.cobertura.xml -targetdir:coverage-report -reporttypes:Html
```

**Dependencies:**
- All service implementation epics

---

### Story 12.2: Create Comprehensive Integration Test Suite
**Story ID:** STORY-12-02
**Priority:** P0
**Estimated:** 10 hours

**Description:**
Create integration tests covering all API endpoints and inter-service communication.

**Acceptance Criteria:**
- [ ] All API endpoints tested (UserService, TransactionService, AIService, BudgetService, NotificationService)
- [ ] Tests use Testcontainers (PostgreSQL, RabbitMQ)
- [ ] Tests verify database state after operations
- [ ] Tests verify events published and consumed
- [ ] Tests verify API response formats
- [ ] Tests verify authorization (users can't access others' data)
- [ ] Tests clean up data between runs
- [ ] All tests pass consistently (no flaky tests)
- [ ] Integration tests complete in <3 minutes total

**Implementation Notes:**
- Use WebApplicationFactory for API testing
- Share Testcontainers across test classes for speed
- Create test utilities for common operations (create user, create transaction, etc.)
- Use realistic test data

**Testing:**
```bash
dotnet test --filter "Category=Integration"
```

**Dependencies:**
- Story 12.1

---

### Story 12.3: Implement E2E Tests for Critical User Flows (Playwright)
**Story ID:** STORY-12-03
**Priority:** P0
**Estimated:** 8 hours

**Description:**
Create end-to-end tests for critical user journeys using Playwright.

**Acceptance Criteria:**
- [ ] E2E test: User registration → login → dashboard
- [ ] E2E test: Login → add manual transaction → verify in list
- [ ] E2E test: Login → CSV import → column mapping → verify transactions imported
- [ ] E2E test: Login → set budget → add transaction → verify budget updated
- [ ] E2E test: Login → view AI insights → dismiss insight
- [ ] E2E test: Login → notification bell → mark notification as read
- [ ] Tests run on Chromium, Firefox, WebKit (cross-browser)
- [ ] Tests use page object model for maintainability
- [ ] Tests capture screenshots on failure
- [ ] Tests complete in <5 minutes total

**Implementation Notes:**
- Use Playwright for E2E testing
- Run tests against local Docker Compose stack
- Create page objects for common pages (LoginPage, DashboardPage, etc.)
- Use test data seeding for consistent state
- Configure CI to run E2E tests

**Testing:**
```bash
cd frontend/web
npx playwright test
npx playwright show-report  # View results
```

**Dependencies:**
- Story 12.2
- Epic 11: Frontend polish (stable UI)

---

### Story 12.4: Setup Test Data Seeding Scripts
**Story ID:** STORY-12-04
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create scripts to seed databases with realistic test data.

**Acceptance Criteria:**
- [ ] Seed script for UserService: creates test users
- [ ] Seed script for TransactionService: creates 500+ transactions per user
- [ ] Seed script for BudgetService: creates budgets for test users
- [ ] Seed script for AIService: creates sample insights
- [ ] Seed script for NotificationService: creates sample notifications
- [ ] Seed data realistic (various merchants, categories, amounts)
- [ ] Seed scripts idempotent (can run multiple times safely)
- [ ] Seed scripts executable via CLI: `dotnet run --seed`
- [ ] Seed scripts documented in README

**Implementation Notes:**
- Use Bogus library for fake data generation
- Create seed data service in each project
- Include various scenarios (budgets exceeded, insights pending, etc.)
- Use consistent test user credentials (test@example.com / Test123!)

**Testing:**
- Run seed scripts on clean database
- Verify data created correctly
- Test application with seeded data

**Dependencies:**
- Story 12.3

---

### Story 12.5: Create Performance Tests (k6 Load Testing)
**Story ID:** STORY-12-05
**Priority:** P1
**Estimated:** 5 hours

**Description:**
Create load tests to verify performance requirements (NFR4: <500ms p95).

**Acceptance Criteria:**
- [ ] k6 installed and configured
- [ ] Load test scenarios: user registration, login, transaction CRUD, CSV import, budget operations
- [ ] Test parameters: 10 virtual users, 5-minute duration
- [ ] Metrics tracked: response time (p95, p99), throughput, error rate
- [ ] Performance targets: p95 <500ms, p99 <1000ms, error rate <1%
- [ ] Load tests run against local Docker Compose stack
- [ ] Load test results exported (JSON, HTML report)
- [ ] CI integration (run load tests on demand)

**Implementation Notes:**
- Use k6 for load testing (https://k6.io)
- Create k6 scripts in tests/performance/
- Test realistic user scenarios (think time between requests)
- Monitor system resources (CPU, memory, database connections)

**Testing:**
```bash
k6 run tests/performance/transaction-crud.js
k6 run tests/performance/csv-import.js
```

**Dependencies:**
- Story 12.4

---

### Story 12.6: Run Security Audit (OWASP Checklist)
**Story ID:** STORY-12-06
**Priority:** P1
**Estimated:** 6 hours

**Description:**
Perform security audit against OWASP Top 10 and fix high-priority vulnerabilities.

**Acceptance Criteria:**
- [ ] OWASP Top 10 checklist completed
- [ ] SQL injection: verify parameterized queries (EF Core handles this)
- [ ] XSS: verify React escaping, CSP headers configured
- [ ] CSRF: verify anti-forgery tokens on state-changing requests
- [ ] Authentication: verify JWT validation, password hashing (BCrypt)
- [ ] Authorization: verify users can't access others' data
- [ ] Sensitive data: verify secrets in environment variables, not code
- [ ] HTTPS enforced (even in development)
- [ ] Security headers configured (CSP, X-Frame-Options, X-Content-Type-Options)
- [ ] Dependency vulnerabilities scanned (npm audit, dotnet list package --vulnerable)
- [ ] No high/critical vulnerabilities remaining

**Implementation Notes:**
- Use OWASP ZAP or Burp Suite for automated scanning
- Manual testing for business logic flaws
- Review code for common vulnerabilities
- Document security measures in architecture doc

**Testing:**
- Run OWASP ZAP scan
- Run npm audit and dotnet list package --vulnerable
- Manual penetration testing
- Review security headers (securityheaders.com)

**Dependencies:**
- Story 12.5

---

### Story 12.7: Fix All High-Priority Vulnerabilities
**Story ID:** STORY-12-07
**Priority:** P0
**Estimated:** 8 hours

**Description:**
Address all high and critical security vulnerabilities discovered in audit.

**Acceptance Criteria:**
- [ ] All critical vulnerabilities fixed
- [ ] All high vulnerabilities fixed
- [ ] Vulnerable dependencies updated or replaced
- [ ] Fixes verified with re-scan
- [ ] Security fixes documented
- [ ] No known critical/high vulnerabilities remaining

**Implementation Notes:**
- Prioritize critical > high > medium > low
- Update dependencies where possible
- Apply workarounds if updates not available
- Document any accepted risks (medium/low) with justification

**Testing:**
- Re-run security scans after fixes
- Verify fixes don't break functionality (regression testing)

**Dependencies:**
- Story 12.6

---

### Story 12.8: Implement Automated Test Runs in CI/CD
**Story ID:** STORY-12-08
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Configure CI/CD pipeline to run tests automatically on every commit.

**Acceptance Criteria:**
- [ ] GitHub Actions workflow runs unit tests on every push
- [ ] GitHub Actions workflow runs integration tests on every push to main
- [ ] E2E tests run on pull requests (optional: manual trigger)
- [ ] Pipeline fails if tests fail (blocks merge)
- [ ] Test results displayed in PR comments
- [ ] Code coverage report uploaded to Codecov or similar
- [ ] Slack/email notification on test failures
- [ ] Workflow runs in <10 minutes

**Implementation Notes:**
- Extend existing CI workflows from Epic 1
- Use matrix strategy for parallel test execution
- Cache dependencies for speed (NuGet, npm)
- Use Testcontainers in CI

**Testing:**
- Trigger workflow manually
- Verify tests run and results reported
- Test failure scenario (introduce failing test)

**Dependencies:**
- Story 12.7
- Epic 1: CI/CD skeleton

---

### Story 12.9: Create Test Coverage Reports
**Story ID:** STORY-12-09
**Priority:** P1
**Estimated:** 2 hours

**Description:**
Generate and publish test coverage reports for visibility.

**Acceptance Criteria:**
- [ ] Coverage reports generated for all services
- [ ] Coverage reports uploaded to Codecov, Coveralls, or similar
- [ ] Coverage badge added to README
- [ ] Coverage trends tracked over time
- [ ] Coverage thresholds enforced (80% minimum)
- [ ] CI fails if coverage drops below threshold

**Implementation Notes:**
- Use Coverlet for .NET coverage
- Use Codecov GitHub Action for uploads
- Configure coverage thresholds in codecov.yml
- Display coverage in PR comments

**Testing:**
- Generate coverage report locally
- Verify upload to coverage service
- Test threshold enforcement

**Dependencies:**
- Story 12.8

---

### Story 12.10: Setup Mutation Testing (Stryker)
**Story ID:** STORY-12-10
**Priority:** P2
**Estimated:** 4 hours

**Description:**
Implement mutation testing to verify test quality (tests actually catch bugs).

**Acceptance Criteria:**
- [ ] Stryker.NET installed and configured
- [ ] Mutation testing runs for Core layer
- [ ] Mutation score target: >70%
- [ ] Report generated showing surviving mutants
- [ ] CI integration (manual trigger, not every build)
- [ ] Results reviewed and tests improved

**Implementation Notes:**
- Use Stryker.NET for .NET mutation testing
- Run mutation tests locally (takes longer than unit tests)
- Focus on critical business logic
- Improve tests to kill more mutants

**Testing:**
```bash
dotnet tool install -g dotnet-stryker
dotnet stryker --project TransactionService.Core.csproj
```

**Dependencies:**
- Story 12.9

---

## Epic Acceptance Criteria

- ✅ Unit test coverage >80% for Core layers
- ✅ Integration tests cover all API endpoints
- ✅ E2E tests cover critical user flows (registration, login, transaction CRUD, CSV import, budget creation)
- ✅ Load tests verify <500ms p95 response time
- ✅ No high/critical security vulnerabilities
- ✅ CI/CD pipeline fails on test failures
- ✅ Code coverage badge in README
- ✅ All tests run in <10 minutes total

---

## Dependencies

**Blocks:**
- Epic 13: Deployment (tests must pass before deploying)

**Depends On:**
- All implementation epics (3-11)

**Enables:**
- Confidence in code quality
- Safe refactoring
- Regression prevention

---

## Notes

- Testing is investment in long-term maintainability
- Prioritize testing critical paths over 100% coverage
- Flaky tests worse than no tests - fix or remove
- E2E tests are expensive - keep focused on critical flows
- Security is ongoing - re-audit after major changes
- Consider property-based testing (FsCheck) for complex logic (future)
- Monitor test execution time - slow tests discourage running them
- Document testing strategy in architecture doc

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
