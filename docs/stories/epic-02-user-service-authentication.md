# Epic 2: User Service & Authentication

**Epic ID:** EPIC-02
**Priority:** P0 (Blocking)
**Status:** Not Started
**Estimated Duration:** 5-7 days
**Owner:** Dev Team
**Depends On:** Epic 1 (Foundation Setup)

---

## Epic Overview

Implement the User Service microservice with complete authentication functionality including user registration, login, JWT token management, and profile management. This is the foundation for all authenticated features in the application.

**Goal:** Enable users to register, login, and manage their profiles with secure JWT-based authentication.

---

## Stories

### Story 2.1: Implement User Service Clean Architecture Structure
**Priority:** P0 | **Estimated:** 2 hours

Create the three-layer Clean Architecture structure for User Service.

**Tasks:**
- Create UserService.API project (ASP.NET Core Web API)
- Create UserService.Core project (class library)
- Create UserService.Infrastructure project (class library)
- Configure project references (API → Core, Infrastructure → Core)
- Add required NuGet packages to each project

**Acceptance Criteria:**
- [ ] All three projects compile successfully
- [ ] Project references configured correctly
- [ ] NuGet packages installed (EF Core, MassTransit, Serilog, etc.)

---

### Story 2.2: Create User Entity and RefreshToken Entity
**Priority:** P0 | **Estimated:** 1 hour

Define domain entities for User and RefreshToken.

**Tasks:**
- Create `User.cs` in UserService.Core/Entities
- Create `RefreshToken.cs` in UserService.Core/Entities
- Define properties matching database schema
- Add navigation properties

**Acceptance Criteria:**
- [ ] User entity includes: Id, Email, PasswordHash, FirstName, LastName, Currency, timestamps
- [ ] RefreshToken entity includes: Id, UserId, Token, ExpiresAt, CreatedAt, RevokedAt
- [ ] Navigation properties configured
- [ ] Entities follow naming conventions from coding standards

---

### Story 2.3: Implement UserDbContext with EF Core
**Priority:** P0 | **Estimated:** 2 hours

Create Entity Framework Core DbContext for User Service.

**Tasks:**
- Create `UserDbContext.cs` in Infrastructure/Data
- Configure entity mappings using Fluent API
- Add DbSet properties for Users and RefreshTokens
- Configure indexes and constraints
- Implement soft delete query filter

**Acceptance Criteria:**
- [ ] DbContext inherits from DbContext
- [ ] Fluent API configurations in OnModelCreating
- [ ] Unique index on Email (with soft delete filter)
- [ ] Foreign key relationship configured (User ↔ RefreshTokens)
- [ ] Query filter for soft deletes (DeletedAt IS NULL)

---

### Story 2.4: Implement Password Hashing Service (BCrypt)
**Priority:** P0 | **Estimated:** 1 hour

Create secure password hashing service using BCrypt.

**Tasks:**
- Install BCrypt.Net-Next NuGet package
- Create `IPasswordHasher` interface in Core/Interfaces
- Create `PasswordHasher` implementation in Infrastructure/Security
- Implement Hash() and Verify() methods
- Add password strength validation

**Acceptance Criteria:**
- [ ] Hash() method uses BCrypt with work factor 12
- [ ] Verify() method validates password against hash
- [ ] Password validation enforces: 8+ chars, uppercase, lowercase, number
- [ ] Common passwords rejected
- [ ] Unit tests cover all validation scenarios

---

### Story 2.5: Implement JWT Token Generator Service
**Priority:** P0 | **Estimated:** 2 hours

Create JWT token generation service for access and refresh tokens.

**Tasks:**
- Create `ITokenGenerator` interface in Core/Interfaces
- Create `JwtTokenGenerator` implementation in Infrastructure/Security
- Implement GenerateAccessToken() (1 hour expiry)
- Implement GenerateRefreshToken() (7 days expiry)
- Add JWT configuration to appsettings.json

**Acceptance Criteria:**
- [ ] Access tokens include claims: Sub, Email, Jti, Iat, FirstName, LastName
- [ ] Access tokens expire after 1 hour
- [ ] Refresh tokens are cryptographically random (64 bytes)
- [ ] Refresh tokens expire after 7 days
- [ ] JWT secret key configurable via appsettings
- [ ] Tokens signed with HS256 algorithm

---

### Story 2.6: Create UsersController with Authentication Endpoints
**Priority:** P0 | **Estimated:** 3 hours

Implement REST API controller for user authentication.

**Tasks:**
- Create `UsersController.cs` in API/Controllers
- Implement POST /api/users/register endpoint
- Implement POST /api/users/login endpoint
- Implement POST /api/users/refresh endpoint
- Implement GET /api/users/profile endpoint
- Implement PUT /api/users/profile endpoint
- Add authorization attributes

**Acceptance Criteria:**
- [ ] Register endpoint creates new user with hashed password
- [ ] Login endpoint returns access + refresh tokens
- [ ] Refresh endpoint validates and issues new access token
- [ ] Profile endpoints require [Authorize] attribute
- [ ] All endpoints return appropriate HTTP status codes
- [ ] DTOs used for request/response (no direct entity exposure)

---

### Story 2.7: Implement Input Validation (FluentValidation)
**Priority:** P0 | **Estimated:** 2 hours

Add request validation using FluentValidation.

**Tasks:**
- Install FluentValidation.AspNetCore NuGet package
- Create `RegisterRequestValidator.cs` in API/Validators
- Create `LoginRequestValidator.cs` in API/Validators
- Configure FluentValidation in Program.cs
- Add validation rules for all request DTOs

**Acceptance Criteria:**
- [ ] Email format validated
- [ ] Password strength requirements enforced
- [ ] Required fields validated
- [ ] Validation errors return 400 Bad Request with details
- [ ] Validators registered in DI container

---

### Story 2.8: Create User Database Migrations
**Priority:** P0 | **Estimated:** 1 hour

Generate and apply EF Core migrations for user database.

**Tasks:**
- Run `dotnet ef migrations add InitialCreate`
- Review generated migration code
- Update migration if needed
- Create database initialization script
- Document migration commands

**Acceptance Criteria:**
- [ ] Migration creates Users table with correct schema
- [ ] Migration creates RefreshTokens table with foreign key
- [ ] Indexes created (Email unique, UserId)
- [ ] Migration can be applied cleanly to empty database
- [ ] Migration documented in README

---

### Story 2.9: Implement Event Publisher for UserRegistered Event
**Priority:** P0 | **Estimated:** 2 hours

Publish events when users register or update profiles.

**Tasks:**
- Create UserEvents.cs in shared/Contracts
- Define UserRegistered event record
- Define UserProfileUpdated event record
- Create `EventPublisher` in Infrastructure/MessageBus
- Configure MassTransit in Program.cs
- Publish events after database commits

**Acceptance Criteria:**
- [ ] UserRegistered event includes: UserId, Email, FirstName, LastName, Currency, Timestamp
- [ ] Events published to RabbitMQ exchange: user.events
- [ ] Events only published after successful database transaction
- [ ] Correlation IDs included in event metadata
- [ ] Event publishing failures logged

---

### Story 2.10: Add Unit Tests for UserService (80%+ Coverage)
**Priority:** P1 | **Estimated:** 4 hours

Create comprehensive unit test suite for User Service.

**Tasks:**
- Create UserService.Tests project (xUnit)
- Install Moq, FluentAssertions NuGet packages
- Write tests for AuthenticationService
- Write tests for UserService
- Write tests for PasswordHasher
- Write tests for JwtTokenGenerator
- Achieve >80% code coverage

**Acceptance Criteria:**
- [ ] Tests cover happy path scenarios
- [ ] Tests cover error scenarios (user not found, invalid credentials, etc.)
- [ ] Tests use AAA pattern (Arrange, Act, Assert)
- [ ] Mocks used for dependencies (repository, event publisher)
- [ ] FluentAssertions used for readable assertions
- [ ] Code coverage report shows >80% for Core layer

---

### Story 2.11: Add Integration Tests for Authentication Flow
**Priority:** P1 | **Estimated:** 3 hours

Create integration tests for complete authentication workflows.

**Tasks:**
- Create integration test project with WebApplicationFactory
- Setup Testcontainers for PostgreSQL
- Write test for registration flow
- Write test for login flow
- Write test for token refresh flow
- Write test for profile update

**Acceptance Criteria:**
- [ ] Tests use real PostgreSQL database (Testcontainers)
- [ ] Tests verify database state after operations
- [ ] Tests verify JWT tokens are valid
- [ ] Tests clean up data between runs
- [ ] All integration tests pass consistently

---

### Story 2.12: Create Frontend Login Page (React + MUI)
**Priority:** P0 | **Estimated:** 3 hours

Build user login page with Material-UI.

**Tasks:**
- Create LoginPage.tsx in features/auth/pages
- Create LoginForm.tsx component
- Add form validation (React Hook Form + Zod)
- Implement login submission
- Handle success/error states
- Add "Forgot Password" link (placeholder)
- Add "Sign Up" link

**Acceptance Criteria:**
- [ ] Login form includes email and password fields
- [ ] Form validation shows errors
- [ ] Loading state during submission
- [ ] Success redirects to dashboard
- [ ] Errors displayed to user
- [ ] Responsive on mobile and desktop

---

### Story 2.13: Create Frontend Register Page
**Priority:** P0 | **Estimated:** 3 hours

Build user registration page.

**Tasks:**
- Create RegisterPage.tsx in features/auth/pages
- Create RegisterForm.tsx component
- Add form validation (email, password, name, currency)
- Implement registration submission
- Handle success/error states
- Add "Already have account" link

**Acceptance Criteria:**
- [ ] Form includes: email, password, firstName, lastName, currency
- [ ] Password strength indicator shown
- [ ] Currency dropdown (USD, RON, EUR)
- [ ] Form validation matches backend requirements
- [ ] Success redirects to dashboard
- [ ] Errors displayed clearly

---

### Story 2.14: Implement Frontend Auth Store (Zustand)
**Priority:** P0 | **Estimated:** 2 hours

Create global authentication state management.

**Tasks:**
- Create authStore.ts in features/auth/stores
- Define auth state (user, tokens, isAuthenticated)
- Implement login action
- Implement logout action
- Implement token persistence (localStorage)
- Add middleware for state persistence

**Acceptance Criteria:**
- [ ] Store persists to localStorage
- [ ] Store hydrates on app startup
- [ ] Login action updates user and tokens
- [ ] Logout action clears all state
- [ ] State reactive across components

---

### Story 2.15: Create Axios Interceptor for JWT Token Refresh
**Priority:** P0 | **Estimated:** 2 hours

Implement automatic token refresh on 401 responses.

**Tasks:**
- Create axiosInstance.ts in api/
- Add request interceptor (attach access token)
- Add response interceptor (handle 401)
- Implement token refresh logic
- Update auth store on successful refresh
- Logout on refresh failure

**Acceptance Criteria:**
- [ ] Access token automatically attached to requests
- [ ] 401 responses trigger refresh token flow
- [ ] Original request retried after token refresh
- [ ] Only one refresh request at a time (prevent race conditions)
- [ ] Logout if refresh token expired
- [ ] User redirected to login on logout

---

### Story 2.16: Implement ProtectedRoute Component
**Priority:** P0 | **Estimated:** 1 hour

Create route wrapper for authenticated pages.

**Tasks:**
- Create ProtectedRoute.tsx in features/auth/components
- Check authentication state
- Redirect to login if not authenticated
- Pass through to children if authenticated

**Acceptance Criteria:**
- [ ] Unauthenticated users redirected to /login
- [ ] Authenticated users see protected content
- [ ] Redirect preserves intended destination
- [ ] Works with React Router 6

---

## Epic Acceptance Criteria

- ✅ Users can register with email/password
- ✅ Users can login and receive JWT tokens
- ✅ Access tokens expire after 1 hour
- ✅ Refresh tokens expire after 7 days
- ✅ Token refresh flow works automatically
- ✅ Password requirements enforced (8+ chars, upper, lower, number)
- ✅ Unit test coverage >80%
- ✅ Integration tests pass for auth flow
- ✅ Frontend login/register functional with error handling
- ✅ Protected routes work correctly

---

## Dependencies

**Blocks:**
- Epic 3: API Gateway (requires auth endpoints to route)
- Epic 4: Transaction Service (requires user authentication)
- All other epics requiring authentication

**Depends On:**
- Epic 1: Foundation Setup

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
