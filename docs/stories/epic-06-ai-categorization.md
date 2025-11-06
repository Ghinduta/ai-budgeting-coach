# Epic 6: AI Service - Categorization

**Epic ID:** EPIC-06
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 4-5 days
**Owner:** Dev Team
**Depends On:** Epic 4 (Transaction Service), Epic 10 (Event Integration)

---

## Epic Overview

Implement AI-powered automatic transaction categorization using OpenAI GPT API. The service listens for TransactionCreated events, categorizes transactions with confidence scores, caches results, and publishes categorization events back to the system.

**Goal:** Achieve >80% AI categorization accuracy with transparent confidence scoring and user override capabilities.

---

## Stories

### Story 6.1: Implement AI Service Clean Architecture
**Story ID:** STORY-06-01
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create the three-layer Clean Architecture structure for AI Service.

**Acceptance Criteria:**
- [ ] AIService.API project created (ASP.NET Core Web API)
- [ ] AIService.Core project created (class library)
- [ ] AIService.Infrastructure project created (class library)
- [ ] Project references configured
- [ ] NuGet packages installed (OpenAI SDK, EF Core, MassTransit, Serilog)
- [ ] Solution compiles successfully
- [ ] Folder structure matches other services

**Implementation Notes:**
- OpenAI SDK: `OpenAI` or `Azure.AI.OpenAI` NuGet package
- Follow same patterns as UserService and TransactionService

**Testing:**
- Verify compilation
- Check project references

**Dependencies:**
- Epic 1: Foundation Setup

---

### Story 6.2: Create AIInsight Entity and CategorizationCache Entity
**Story ID:** STORY-06-02
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Define domain entities for AI insights and categorization caching.

**Acceptance Criteria:**
- [ ] AIInsight entity: Id, UserId, InsightType (enum: Weekly, Monthly, Alert, Custom), InsightText, Priority (Low/Medium/High), Metadata (JSON), GeneratedAt, ExpiresAt, DismissedAt
- [ ] CategorizationCache entity: Id, MerchantName (normalized), Category, Confidence, CachedAt, ExpiresAt (30 days TTL), UsageCount
- [ ] Enums defined: InsightType, InsightPriority
- [ ] Value objects for Category (standard categories)
- [ ] Indexes for efficient querying

**Implementation Notes:**
- MerchantName normalized: lowercase, trim, remove special characters
- Cache shared across all users (anonymized)
- Metadata stored as JSON for flexibility

**Testing:**
- Unit tests for entity validation
- Test merchant name normalization

**Dependencies:**
- Story 6.1

---

### Story 6.3: Implement OpenAI Client Wrapper
**Story ID:** STORY-06-03
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create abstraction layer for OpenAI API integration to allow provider swapping.

**Acceptance Criteria:**
- [ ] IOpenAIClient interface in Core/Interfaces
- [ ] OpenAIClient implementation in Infrastructure/AI
- [ ] Configuration: API key from environment variables
- [ ] Configuration: Model selection (gpt-4-turbo, gpt-3.5-turbo)
- [ ] Configuration: Temperature, max tokens
- [ ] Retry policy: 3 retries with exponential backoff
- [ ] Timeout: 30 seconds per request
- [ ] Error handling: API errors, rate limits, timeouts
- [ ] Logging: request/response, tokens used, duration
- [ ] Cost tracking: estimate cost per request

**Implementation Notes:**
- Use OpenAI SDK client library
- Configure retry policy with Polly
- Log token usage for cost monitoring (NFR18)
- Handle 429 (rate limit) responses gracefully

**Testing:**
- Unit tests with mocked HTTP client
- Integration test with real API (use test API key)
- Test retry logic
- Test timeout handling

**Dependencies:**
- Story 6.2

---

### Story 6.4: Create Categorization Prompt Template
**Story ID:** STORY-06-04
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Design and test prompt engineering for transaction categorization.

**Acceptance Criteria:**
- [ ] Prompt template includes: merchant name, standard categories list, confidence score instruction
- [ ] Standard categories defined: Groceries, Dining, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Housing, Income, Transfers, Other
- [ ] Prompt requests: category name and confidence (0-100)
- [ ] Response format: JSON { "category": "string", "confidence": number }
- [ ] Prompt tested with various merchant names
- [ ] Prompt handles edge cases: unknown merchants, ambiguous names
- [ ] Prompt stored in configuration (not hardcoded)

**Implementation Notes:**
Example prompt:
```
Categorize the following merchant name into exactly one category from this list:
- Groceries
- Dining
- Transportation
- Entertainment
- Shopping
- Bills & Utilities
- Healthcare
- Housing
- Income
- Transfers
- Other

Merchant: "{merchantName}"

Respond with only a JSON object containing the category and your confidence score (0-100):
{"category": "CategoryName", "confidence": 85}
```

**Testing:**
- Test with 20+ merchant names
- Verify JSON parsing
- Check confidence scores are reasonable
- Validate category always from list

**Dependencies:**
- Story 6.3

---

### Story 6.5: Implement TransactionCreatedConsumer (RabbitMQ)
**Story ID:** STORY-06-05
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create RabbitMQ consumer to listen for TransactionCreated events and trigger categorization.

**Acceptance Criteria:**
- [ ] TransactionCreatedConsumer class implements IConsumer<TransactionCreated>
- [ ] Registered with MassTransit in Program.cs
- [ ] Consumes events from transaction.events exchange
- [ ] Extracts merchant name from event
- [ ] Checks categorization cache first
- [ ] If not cached, calls categorization service
- [ ] Updates transaction via event (publishes TransactionCategorized)
- [ ] Handles consumer failures gracefully (retry policy)
- [ ] Logs processing with correlation IDs

**Implementation Notes:**
- Configure consumer concurrency (5 concurrent messages)
- Use retry policy: 3 retries with exponential backoff
- Move to error queue after retries exhausted
- Idempotency: check if transaction already categorized

**Testing:**
- Unit tests with mocked dependencies
- Integration test: publish event → verify categorization
- Test retry logic
- Test error queue

**Dependencies:**
- Story 6.4
- Epic 10: RabbitMQ configuration

---

### Story 6.6: Implement Categorization Logic with Confidence Scoring
**Story ID:** STORY-06-06
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Core business logic for categorizing transactions with confidence assessment.

**Acceptance Criteria:**
- [ ] CategorizationService class in Core/Services
- [ ] CategorizeTransaction method: input merchant name, output category + confidence
- [ ] Check cache for merchant (normalized name)
- [ ] If cached and confidence >=70%, return cached result
- [ ] If not cached or low confidence, call OpenAI
- [ ] Parse OpenAI response (JSON)
- [ ] Validate category is from standard list
- [ ] Only apply category if confidence >=70% (configurable threshold)
- [ ] If confidence <70%, leave transaction uncategorized for manual review
- [ ] Update cache with new categorization
- [ ] Log categorization attempts for analytics

**Implementation Notes:**
- Merchant name normalization: lowercase, trim, remove punctuation
- Cache hit rate should be >50% after initial period
- Consider fuzzy matching for cache lookups (future enhancement)
- Confidence threshold configurable via appsettings (default 70)

**Testing:**
- Unit tests for categorization logic
- Test cache hit scenarios
- Test cache miss scenarios
- Test low confidence handling
- Test with various merchant names

**Dependencies:**
- Story 6.5

---

### Story 6.7: Implement Categorization Caching (30-Day TTL)
**Story ID:** STORY-06-07
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Implement caching mechanism to reduce API costs and improve performance.

**Acceptance Criteria:**
- [ ] Cache stored in CategorizationCache table
- [ ] Cache keyed by normalized merchant name
- [ ] TTL: 30 days from last use
- [ ] Cache updated on each use (refresh TTL)
- [ ] UsageCount incremented on cache hit
- [ ] Cache pruning job: delete entries older than 30 days (daily job)
- [ ] Cache statistics: hit rate, total entries, storage size
- [ ] Cache shared across all users (privacy-safe: only merchant names)

**Implementation Notes:**
- Use EF Core for cache storage
- Index on MerchantName for fast lookups
- Consider in-memory cache (Redis) for hot entries (future optimization)
- Background job for cache cleanup (Hangfire or HostedService)

**Testing:**
- Test cache storage and retrieval
- Test TTL expiration
- Test cache pruning
- Verify cache hit improves performance

**Dependencies:**
- Story 6.6

---

### Story 6.8: Implement Event Publisher for TransactionCategorized
**Story ID:** STORY-06-08
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Publish events after categorizing transactions for other services to consume.

**Acceptance Criteria:**
- [ ] TransactionCategorized event defined: TransactionId, UserId, Category, Confidence, Source (AI/User), Timestamp, CorrelationId
- [ ] Event published to RabbitMQ exchange: ai.events
- [ ] Event published after successful categorization
- [ ] Event includes original correlation ID for tracing
- [ ] Publishing failures logged but don't block categorization
- [ ] Event consumed by TransactionService to update transaction record

**Implementation Notes:**
- Use MassTransit Publish method
- Event contract in shared/Contracts
- Include correlation ID from original TransactionCreated event

**Testing:**
- Unit tests with mocked publisher
- Integration test: categorize → verify event published
- Test event consumption by TransactionService

**Dependencies:**
- Story 6.7

---

### Story 6.9: Configure OpenAI API Key and Rate Limiting
**Story ID:** STORY-06-09
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Configure API credentials and implement rate limiting to control costs.

**Acceptance Criteria:**
- [ ] OpenAI API key stored in environment variables (never in code)
- [ ] API key validated on service startup
- [ ] Rate limiting: max 50 requests per minute (OpenAI tier limit)
- [ ] Rate limiting: max 10,000 tokens per minute
- [ ] Queue requests when rate limit reached (wait and retry)
- [ ] Cost cap: alert if monthly spending exceeds $50 (NFR18)
- [ ] Usage metrics logged: requests, tokens, estimated cost
- [ ] Dashboard showing AI usage statistics (admin only)

**Implementation Notes:**
- Use token bucket algorithm for rate limiting
- Estimate cost: GPT-4 Turbo: $0.01/1K input tokens, $0.03/1K output tokens
- Log usage to database for tracking
- Alert via logging system when approaching limits

**Testing:**
- Test rate limiting triggers correctly
- Test queuing and retry logic
- Verify cost estimation accuracy
- Test with realistic load (100+ categorizations)

**Dependencies:**
- Story 6.8

---

### Story 6.10: Add Unit Tests for Categorization Service (75%+ Coverage)
**Story ID:** STORY-06-10
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create comprehensive unit test suite for AI Service core logic.

**Acceptance Criteria:**
- [ ] AIService.Tests project created
- [ ] Tests for CategorizationService
- [ ] Tests for cache logic (hit/miss scenarios)
- [ ] Tests for confidence threshold logic
- [ ] Tests for merchant name normalization
- [ ] Tests for OpenAI response parsing
- [ ] Tests for error handling (API failures)
- [ ] Mocks for IOpenAIClient, ICategorizationRepository
- [ ] Code coverage >75% for Core layer

**Implementation Notes:**
- Mock OpenAI responses with realistic JSON
- Test edge cases: empty merchant names, special characters
- Test concurrent categorization requests

**Testing:**
```bash
dotnet test --collect:"XPlat Code Coverage"
```

**Dependencies:**
- Story 6.9

---

### Story 6.11: Add Integration Tests for Event-Driven Categorization Flow
**Story ID:** STORY-06-11
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create end-to-end integration tests for complete categorization workflow.

**Acceptance Criteria:**
- [ ] Integration test with Testcontainers (PostgreSQL, RabbitMQ)
- [ ] Test: Publish TransactionCreated → AI categorizes → TransactionCategorized published
- [ ] Test: Cache hit scenario
- [ ] Test: Low confidence scenario (transaction left uncategorized)
- [ ] Test: OpenAI API failure handling
- [ ] Test: Event retry logic
- [ ] All tests pass consistently
- [ ] Tests clean up data and messages

**Implementation Notes:**
- Mock OpenAI API for integration tests (use test doubles)
- Use realistic test data
- Verify events consumed correctly

**Testing:**
```bash
dotnet test --filter "Category=Integration&Category=AI"
```

**Dependencies:**
- Story 6.10

---

### Story 6.12: Create Frontend Category Confidence Indicators
**Story ID:** STORY-06-12
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Display AI confidence scores visually in transaction list.

**Acceptance Criteria:**
- [ ] Category displayed with confidence badge
- [ ] Badge colors: green (80-100%), yellow (70-79%), gray (<70% or null)
- [ ] Badge shows percentage: "Dining 92%"
- [ ] Uncategorized transactions show "Uncategorized" with warning icon
- [ ] Tooltip explains confidence score on hover
- [ ] Click badge to override category (opens dropdown)
- [ ] Visual distinction between AI-categorized and user-categorized

**Implementation Notes:**
- Use MUI Chip component for badges
- Color scheme: success (green), warning (yellow), default (gray)
- Icon library: MUI icons

**Testing:**
- Test visual appearance with various confidence levels
- Test tooltip
- Test responsive design
- Test accessibility (color + text/icons)

**Dependencies:**
- Story 6.11
- Epic 4: Frontend transaction list

---

### Story 6.13: Implement Manual Category Override in Frontend
**Story ID:** STORY-06-13
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Allow users to manually override AI category suggestions.

**Acceptance Criteria:**
- [ ] Click category badge opens inline dropdown
- [ ] Dropdown lists all standard categories
- [ ] Selecting category updates transaction immediately (API call)
- [ ] Manual override sets confidence to 100% and source to "User"
- [ ] Updated category reflected in UI immediately
- [ ] Bulk override: select multiple transactions, assign category to all
- [ ] Undo last override option (future enhancement)
- [ ] Override tracked for AI accuracy metrics

**Implementation Notes:**
- Use optimistic updates (update UI before API confirms)
- Revert on API error
- Show success toast notification
- Use PUT /api/transactions/{id} endpoint

**Testing:**
- Test manual override flow
- Test bulk override
- Test error handling
- Test undo functionality

**Dependencies:**
- Story 6.12

---

## Epic Acceptance Criteria

- ✅ AI categorizes transactions into 10 standard categories
- ✅ Confidence scores provided (0-100)
- ✅ Categorization results cached by merchant name
- ✅ Auto-categorization only applied if confidence >=70%
- ✅ TransactionCategorized events published successfully
- ✅ OpenAI API calls batched (max 50/min)
- ✅ Unit test coverage >75%
- ✅ Frontend displays AI categories with confidence badges
- ✅ Users can manually override categories
- ✅ Cost monitoring in place (target <$50/month)

---

## Dependencies

**Blocks:**
- None directly, but enhances user experience

**Depends On:**
- Epic 4: Transaction Service (creates transactions)
- Epic 10: Event Integration (RabbitMQ messaging)

**Enables:**
- Reduced manual effort for users
- Foundation for Epic 7 (AI insights)

---

## Notes

- AI categorization is a key differentiator - prioritize accuracy over speed
- Monitor API costs closely during beta testing
- Consider building ML model with user overrides as training data (Phase 2)
- Future: Multi-language support for merchant names
- Future: Learn from user overrides to improve cache
- Future: Category suggestions based on transaction history patterns
- Document standard categories and examples in user guide

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
