# Epic 3: API Gateway

**Epic ID:** EPIC-03
**Priority:** P0 (Blocking)
**Status:** Not Started
**Estimated Duration:** 2-3 days
**Owner:** Dev Team
**Depends On:** Epic 1 (Foundation Setup), Epic 2 (User Service & Authentication)

---

## Epic Overview

Implement the API Gateway service using YARP (Yet Another Reverse Proxy) to provide a single entry point for all frontend requests. The gateway handles routing, JWT validation, rate limiting, CORS, request logging, and exception handling.

**Goal:** Provide a unified API surface with security, routing, and cross-cutting concerns handled centrally.

---

## Stories

### Story 3.1: Create API Gateway Project with YARP
**Story ID:** STORY-03-01
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create the API Gateway project and configure YARP reverse proxy with basic routing to all microservices.

**Acceptance Criteria:**
- [ ] API Gateway project created as ASP.NET Core Web API
- [ ] YARP (Yarp.ReverseProxy) NuGet package installed
- [ ] appsettings.json configured with reverse proxy routes
- [ ] Routes defined for all services: /api/users/*, /api/transactions/*, /api/budgets/*, /api/ai/*, /api/notifications/*
- [ ] Service endpoints configured (development: localhost ports, production: service names)
- [ ] Gateway compiles and runs successfully
- [ ] Test request routed to UserService successfully

**Implementation Notes:**
- YARP configuration in appsettings.json under "ReverseProxy" section
- Define clusters for each backend service
- Define routes with path matching patterns
- Service discovery uses direct HTTP URLs for MVP (no service mesh)

**Testing:**
- Manual testing with Postman/curl
- Verify routing to each service
- Check 404 for unmapped routes

**Dependencies:**
- Epic 1: Foundation Setup
- Epic 2: User Service running

---

### Story 3.2: Configure YARP Routes for All Microservices
**Story ID:** STORY-03-02
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Define complete routing configuration for all 6 microservices with proper path prefixes and health check endpoints.

**Acceptance Criteria:**
- [ ] UserService routes: /api/users/* → http://localhost:5001
- [ ] TransactionService routes: /api/transactions/* → http://localhost:5002
- [ ] AIService routes: /api/ai/* → http://localhost:5003
- [ ] BudgetService routes: /api/budgets/* → http://localhost:5004
- [ ] NotificationService routes: /api/notifications/* → http://localhost:5005
- [ ] Health check endpoint /health aggregates backend service statuses
- [ ] Route priorities configured to prevent conflicts
- [ ] Catch-all route returns 404 with helpful message

**Implementation Notes:**
- Use YARP transforms to add/remove headers as needed
- Configure timeouts per route (default 30s, longer for CSV import)
- Document route patterns in README

**Testing:**
- Test each route prefix
- Verify health check aggregation
- Test 404 handling

**Dependencies:**
- Story 3.1

---

### Story 3.3: Implement JWT Validation Middleware
**Story ID:** STORY-03-03
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Add JWT token validation middleware to verify all authenticated requests before forwarding to backend services.

**Acceptance Criteria:**
- [ ] Microsoft.AspNetCore.Authentication.JwtBearer NuGet package installed
- [ ] JWT authentication configured in Program.cs
- [ ] JWT secret key loaded from configuration (matching UserService)
- [ ] Middleware validates JWT signature, expiration, and claims
- [ ] Invalid tokens return 401 Unauthorized with error details
- [ ] Expired tokens return 401 with "Token expired" message
- [ ] Valid tokens forwarded to backend services
- [ ] Authorization header passed through to downstream services
- [ ] Public endpoints excluded from validation: /api/users/register, /api/users/login, /health

**Implementation Notes:**
- Configure JwtBearerOptions with issuer, audience, secret key
- Use [AllowAnonymous] attribute for public endpoints
- Extract user ID from JWT claims and add to request headers (X-User-Id)
- Log authentication failures with correlation IDs

**Testing:**
- Test with valid JWT token
- Test with expired token
- Test with invalid signature
- Test with missing token
- Test public endpoints without token

**Dependencies:**
- Story 3.2

---

### Story 3.4: Implement Rate Limiting Middleware
**Story ID:** STORY-03-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Add rate limiting to prevent abuse and protect backend services from overload.

**Acceptance Criteria:**
- [ ] AspNetCoreRateLimit NuGet package installed
- [ ] General rate limit: 10 requests per second per IP
- [ ] Login endpoint rate limit: 5 requests per minute per IP
- [ ] Register endpoint rate limit: 3 requests per minute per IP
- [ ] CSV import rate limit: 2 requests per minute per user
- [ ] Rate limit exceeded returns 429 Too Many Requests
- [ ] Response includes Retry-After header
- [ ] Rate limit counters stored in memory (in-memory cache)
- [ ] Whitelist option for health checks (no rate limiting)

**Implementation Notes:**
- Configure IpRateLimiting in appsettings.json
- Define endpoint rules for different rate limits
- Use sliding window algorithm
- Add rate limit headers to responses (X-Rate-Limit-*)

**Testing:**
- Test general rate limit by rapid requests
- Test login rate limit specifically
- Verify 429 response and headers
- Verify whitelist works for health checks

**Dependencies:**
- Story 3.3

---

### Story 3.5: Implement Request Logging Middleware with Correlation IDs
**Story ID:** STORY-03-05
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Add comprehensive request/response logging with correlation IDs for distributed tracing.

**Acceptance Criteria:**
- [ ] Serilog configured with structured logging
- [ ] Correlation ID generated for each request (GUID)
- [ ] Correlation ID added to request headers (X-Correlation-Id)
- [ ] Correlation ID passed to backend services
- [ ] Request logs include: timestamp, method, path, correlation ID, user ID (if authenticated), IP address
- [ ] Response logs include: status code, duration, correlation ID
- [ ] Errors logged with full details and correlation ID
- [ ] Correlation ID included in error responses
- [ ] Logs written to console and file (./logs/api-gateway-{Date}.log)

**Implementation Notes:**
- Use Serilog.AspNetCore package
- Configure Serilog in Program.cs
- Create custom middleware for correlation ID injection
- Enrich logs with correlation ID using Serilog enrichers

**Testing:**
- Verify correlation ID generated and logged
- Verify correlation ID in response headers
- Check log files for structured output
- Trace request through multiple services using correlation ID

**Dependencies:**
- Story 3.4

---

### Story 3.6: Implement Exception Handling Middleware
**Story ID:** STORY-03-06
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Add centralized exception handling to return consistent error responses and log errors properly.

**Acceptance Criteria:**
- [ ] Global exception handler middleware catches all unhandled exceptions
- [ ] Error responses use consistent format: { "error": { "code": "string", "message": "string", "correlationId": "string", "details": {} } }
- [ ] 500 Internal Server Error for unhandled exceptions
- [ ] 502 Bad Gateway for backend service failures
- [ ] 504 Gateway Timeout for backend timeouts
- [ ] Error details excluded in production (only in development)
- [ ] All errors logged with stack traces
- [ ] Sensitive information never exposed in error messages

**Implementation Notes:**
- Create custom middleware class
- Use IExceptionHandler (ASP.NET Core 8)
- Map exception types to HTTP status codes
- Include correlation ID in all error responses

**Testing:**
- Trigger various exceptions deliberately
- Verify error response format
- Check error logging
- Verify no sensitive data in responses

**Dependencies:**
- Story 3.5

---

### Story 3.7: Configure CORS for Frontend Origin
**Story ID:** STORY-03-07
**Priority:** P0
**Estimated:** 1 hour

**Description:**
Configure Cross-Origin Resource Sharing (CORS) to allow frontend application to make requests to API Gateway.

**Acceptance Criteria:**
- [ ] CORS middleware configured in Program.cs
- [ ] Development: Allow http://localhost:5173 (Vite dev server)
- [ ] Production: Allow production frontend domain (configurable via appsettings)
- [ ] Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- [ ] Allowed headers: Content-Type, Authorization, X-Correlation-Id
- [ ] Exposed headers: X-Correlation-Id, X-Rate-Limit-*
- [ ] Credentials allowed (for cookies if needed)
- [ ] Preflight requests handled correctly

**Implementation Notes:**
- Use named CORS policy
- Configure allowed origins from appsettings.json
- Support multiple origins (dev + production)

**Testing:**
- Test OPTIONS preflight request
- Test actual request from frontend
- Verify CORS headers in response
- Test blocked origins return CORS error

**Dependencies:**
- Story 3.6

---

### Story 3.8: Add Health Check Endpoint
**Story ID:** STORY-03-08
**Priority:** P1
**Estimated:** 2 hours

**Description:**
Implement comprehensive health check endpoint that verifies API Gateway and all backend services are healthy.

**Acceptance Criteria:**
- [ ] Health check endpoint at GET /health
- [ ] Returns 200 OK if all services healthy
- [ ] Returns 503 Service Unavailable if any service unhealthy
- [ ] Response includes status for each backend service
- [ ] Response format: { "status": "Healthy|Degraded|Unhealthy", "services": { "UserService": "Healthy", ... }, "timestamp": "ISO8601" }
- [ ] Health checks use HTTP HEAD requests to backend /health endpoints
- [ ] Timeout configured (5s per service)
- [ ] Failed health checks logged
- [ ] Cached for 30 seconds to prevent overload

**Implementation Notes:**
- Use Microsoft.Extensions.Diagnostics.HealthChecks
- Add health checks for each backend service
- Configure caching policy
- Add readiness vs liveness endpoints if needed

**Testing:**
- Test when all services healthy
- Test when one service down
- Test timeout handling
- Verify caching works

**Dependencies:**
- Story 3.7

---

### Story 3.9: Create API Gateway Dockerfile
**Story ID:** STORY-03-09
**Priority:** P1
**Estimated:** 1 hour

**Description:**
Create Dockerfile for containerizing API Gateway service.

**Acceptance Criteria:**
- [ ] Dockerfile created in ApiGateway/ directory
- [ ] Multi-stage build (build + runtime)
- [ ] Base image: mcr.microsoft.com/dotnet/aspnet:8.0
- [ ] Build image: mcr.microsoft.com/dotnet/sdk:8.0
- [ ] Port 5000 exposed
- [ ] Environment variables supported for configuration
- [ ] Non-root user configured for security
- [ ] Image builds successfully
- [ ] Container runs and serves traffic

**Implementation Notes:**
- Follow .NET Docker best practices
- Optimize layer caching
- Minimize image size
- Document build and run commands

**Testing:**
```bash
docker build -t api-gateway:latest .
docker run -p 5000:5000 api-gateway:latest
curl http://localhost:5000/health
```

**Dependencies:**
- Story 3.8

---

## Epic Acceptance Criteria

- ✅ API Gateway routes requests to all microservices
- ✅ JWT tokens validated before forwarding requests
- ✅ Rate limiting applied and returns 429 when exceeded
- ✅ All requests logged with correlation IDs
- ✅ CORS configured for localhost:5173 (dev) and production domain
- ✅ Health check endpoint returns service status
- ✅ Exception handling returns consistent error format
- ✅ Dockerfile builds and container runs successfully

---

## Dependencies

**Blocks:**
- Epic 4: Transaction Service (requires gateway routing)
- Epic 6: AI Service (requires gateway routing)
- Epic 8: Budget Service (requires gateway routing)
- Epic 9: Notification Service (requires gateway routing)

**Depends On:**
- Epic 1: Foundation Setup
- Epic 2: User Service & Authentication

---

## Notes

- API Gateway is critical infrastructure - must be stable before other services
- Keep gateway lightweight - avoid business logic
- Consider adding request/response size limits
- Future: Add circuit breaker pattern for backend service failures
- Future: Add caching layer for frequently accessed data

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
