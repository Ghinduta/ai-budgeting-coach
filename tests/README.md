# Tests

Automated test suites for the AI Budgeting Coach application.

## Test Types

### integration/
Integration tests for cross-service functionality using Testcontainers.

**Technology:**
- xUnit
- Testcontainers (PostgreSQL, RabbitMQ)
- WebApplicationFactory

**Tests:**
- Authentication flow tests
- Transaction CRUD with event processing
- CSV import end-to-end
- Budget alert triggering
- Complete event-driven flows

### e2e/
End-to-end browser tests using Playwright.

**Technology:**
- Playwright
- TypeScript

**Test Scenarios:**
- User registration and login
- Transaction management (create, edit, delete)
- CSV file upload and import
- Budget creation and tracking
- AI insights display
- Notification interactions

## Running Tests

```bash
# Backend integration tests
dotnet test tests/integration/

# Frontend E2E tests
cd tests/e2e
npm install
npm run test

# Run specific test suite
npm run test -- tests/auth.spec.ts
```

## Test Coverage

Target coverage:
- Unit tests: >80%
- Integration tests: All API endpoints
- E2E tests: Critical user paths
