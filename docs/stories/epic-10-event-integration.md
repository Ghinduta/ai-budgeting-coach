# Epic 10: Event-Driven Integration

**Epic ID:** EPIC-10
**Priority:** P0 (Blocking)
**Status:** Not Started
**Estimated Duration:** 3-4 days
**Owner:** Dev Team
**Depends On:** Epic 1 (Foundation Setup)

---

## Epic Overview

Configure and implement the complete event-driven messaging infrastructure using RabbitMQ and MassTransit. This epic establishes reliable async communication between all microservices with proper error handling, retry policies, and monitoring.

**Goal:** Achieve reliable event-driven architecture with <1 second end-to-end latency and proper failure handling.

---

## Stories

### Story 10.1: Configure RabbitMQ Exchanges and Queues
**Story ID:** STORY-10-01
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Define and configure RabbitMQ topology (exchanges, queues, bindings) for all services.

**Acceptance Criteria:**
- [ ] Exchange: user.events (topic exchange)
- [ ] Exchange: transaction.events (topic exchange)
- [ ] Exchange: ai.events (topic exchange)
- [ ] Exchange: budget.events (topic exchange)
- [ ] Queues created for each consumer with proper naming convention
- [ ] Dead letter exchange (DLX) and dead letter queue (DLQ) configured
- [ ] Bindings configured with routing keys
- [ ] Queue durability enabled (persist through restarts)
- [ ] Message TTL configured (24 hours before DLQ)
- [ ] Topology documented in architecture diagram

**Implementation Notes:**
- Use MassTransit conventions for naming (consumer-based queues)
- Configure topology via code (MassTransit) not manual RabbitMQ setup
- Routing key pattern: {service}.{entity}.{action} (e.g., transaction.created, budget.alert.triggered)

**Testing:**
- Verify queues created on service startup
- Test message routing
- Verify DLQ configuration

**Dependencies:**
- Epic 1: RabbitMQ container running

---

### Story 10.2: Implement Shared Message Contracts Library
**Story ID:** STORY-10-02
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create shared library for all event message contracts to ensure consistency.

**Acceptance Criteria:**
- [ ] Shared.Contracts project created (class library)
- [ ] Event classes defined as records (immutable)
- [ ] All events include: CorrelationId, Timestamp, EventId (GUID)
- [ ] UserRegistered event contract
- [ ] UserProfileUpdated event contract
- [ ] TransactionCreated event contract
- [ ] TransactionUpdated event contract
- [ ] TransactionDeleted event contract
- [ ] TransactionCategorized event contract
- [ ] BudgetAlertTriggered event contract
- [ ] InsightGenerated event contract
- [ ] All services reference Shared.Contracts project
- [ ] JSON serialization configured

**Implementation Notes:**
Example contract:
```csharp
public record TransactionCreated(
    Guid TransactionId,
    Guid UserId,
    DateTime Date,
    decimal Amount,
    string Merchant,
    string Account,
    string? Category,
    Guid CorrelationId,
    DateTime Timestamp
);
```

**Testing:**
- Unit tests for contract serialization/deserialization
- Verify contracts compile in all services

**Dependencies:**
- Story 10.1

---

### Story 10.3: Configure MassTransit in All Services
**Story ID:** STORY-10-03
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Configure MassTransit message bus in each microservice with consistent settings.

**Acceptance Criteria:**
- [ ] MassTransit.RabbitMQ NuGet package in all services
- [ ] MassTransit configured in Program.cs with RabbitMQ transport
- [ ] Connection settings: host, port, username, password (from configuration)
- [ ] Consumer registration for each service
- [ ] Publisher configuration
- [ ] Endpoint naming conventions consistent
- [ ] Message serialization configured (System.Text.Json)
- [ ] Health checks configured for RabbitMQ connection
- [ ] Logging configured for message activities

**Implementation Notes:**
- Connection string from environment variables
- Configure message retry and error policies (next story)
- Use MassTransit's default naming conventions
- Configure concurrent message limit per consumer (5-10)

**Testing:**
- Verify connection to RabbitMQ on startup
- Test health check endpoint
- Test message publishing
- Test message consumption

**Dependencies:**
- Story 10.2

---

### Story 10.4: Implement Retry Policies (Exponential Backoff)
**Story ID:** STORY-10-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Configure message retry policies to handle transient failures gracefully.

**Acceptance Criteria:**
- [ ] Retry policy: 3 retries with exponential backoff
- [ ] Backoff intervals: 1 second, 5 seconds, 15 seconds
- [ ] Retry only for transient errors (database connection, network)
- [ ] Skip retry for validation errors (malformed messages)
- [ ] Maximum retry attempts per message configurable
- [ ] Failed messages after retries moved to DLQ
- [ ] Retry attempts logged with reason

**Implementation Notes:**
- Use MassTransit's built-in retry middleware
- Configure via UseMessageRetry in consumer configuration
- Distinguish between retriable and non-retriable exceptions
- Log retry attempts with correlation IDs

**Testing:**
- Test retry behavior with simulated failures
- Verify exponential backoff timing
- Verify messages move to DLQ after max retries
- Test with various exception types

**Dependencies:**
- Story 10.3

---

### Story 10.5: Implement Circuit Breakers (50% Failure Threshold)
**Story ID:** STORY-10-05
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Add circuit breaker pattern to prevent cascading failures.

**Acceptance Criteria:**
- [ ] Circuit breaker configured per consumer
- [ ] Threshold: 50% failure rate over 1-minute window
- [ ] Open circuit duration: 30 seconds
- [ ] Half-open state: test with single message
- [ ] Circuit state logged (open, half-open, closed)
- [ ] Metrics exposed for circuit breaker state
- [ ] Failed messages during open circuit moved to DLQ immediately

**Implementation Notes:**
- Use MassTransit's circuit breaker middleware
- Configure via UseCircuitBreaker
- Monitor circuit breaker state via health checks
- Alert when circuit opens

**Testing:**
- Test circuit opens after failure threshold
- Test circuit closes after recovery
- Test half-open state
- Verify metrics

**Dependencies:**
- Story 10.4

---

### Story 10.6: Implement Dead Letter Queues
**Story ID:** STORY-10-06
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Configure dead letter queues for failed messages requiring manual intervention.

**Acceptance Criteria:**
- [ ] DLQ exchange: dlx (direct exchange)
- [ ] DLQ queue: dlq (all failed messages)
- [ ] Messages include failure metadata: original queue, failure reason, retry count, exception details
- [ ] DLQ messages persist indefinitely (manual cleanup)
- [ ] DLQ accessible via RabbitMQ management UI
- [ ] Alert when DLQ depth exceeds threshold (10 messages)

**Implementation Notes:**
- Configure DLQ via MassTransit error transport
- Store full exception stack trace
- Include original message body for debugging

**Testing:**
- Test message routing to DLQ
- Verify metadata included
- Test DLQ monitoring

**Dependencies:**
- Story 10.5

---

### Story 10.7: Add Correlation IDs to All Events
**Story ID:** STORY-10-07
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Ensure all events include correlation IDs for distributed tracing.

**Acceptance Criteria:**
- [ ] Correlation ID generated by API Gateway for incoming requests
- [ ] Correlation ID propagated through all services
- [ ] Correlation ID included in all published events
- [ ] Correlation ID logged with all log entries
- [ ] Correlation ID accessible via message headers
- [ ] Correlation ID format: GUID

**Implementation Notes:**
- Use MassTransit's built-in correlation ID support
- Extract correlation ID from incoming messages
- Generate new correlation ID if not present
- Add correlation ID to Serilog log context

**Testing:**
- Test correlation ID propagation through multi-service flow
- Verify correlation ID in logs
- Test with API Gateway requests

**Dependencies:**
- Story 10.6
- Epic 3: API Gateway correlation ID implementation

---

### Story 10.8: Configure Event Logging (Serilog)
**Story ID:** STORY-10-08
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Configure comprehensive logging for all message activities.

**Acceptance Criteria:**
- [ ] Log message received: consumer, message type, correlation ID
- [ ] Log message processing started
- [ ] Log message processing completed: duration
- [ ] Log message failures: exception, correlation ID, retry count
- [ ] Log message sent to DLQ
- [ ] Log circuit breaker state changes
- [ ] Structured logging (JSON format)
- [ ] Log level configurable (default: Information)

**Implementation Notes:**
- Configure MassTransit diagnostics with Serilog
- Use log enrichers for context
- Include message type and correlation ID in all logs
- Configure log sinks (console, file)

**Testing:**
- Verify logs for successful message flow
- Verify logs for failed messages
- Test log formatting and structure

**Dependencies:**
- Story 10.7

---

### Story 10.9: Add Integration Tests for Complete Event Flows
**Story ID:** STORY-10-09
**Priority:** P1
**Estimated:** 5 hours

**Description:**
Create end-to-end integration tests for complete event-driven workflows.

**Acceptance Criteria:**
- [ ] Integration test: UserRegistered → NotificationPreferences created
- [ ] Integration test: TransactionCreated → AI categorizes → TransactionCategorized → Transaction updated
- [ ] Integration test: TransactionCreated → BudgetService updates spending → BudgetAlertTriggered → Notification created
- [ ] Integration test: InsightGenerated → Notification created
- [ ] Integration test: Failed message retry flow
- [ ] Integration test: Circuit breaker behavior
- [ ] Integration test: DLQ routing
- [ ] Tests use Testcontainers (PostgreSQL, RabbitMQ)
- [ ] All tests pass consistently

**Implementation Notes:**
- Create test harness for publishing events
- Wait for async processing (poll for results)
- Use realistic test data
- Test timeout: 30 seconds per test

**Testing:**
```bash
dotnet test --filter "Category=Integration&Category=Events"
```

**Dependencies:**
- Story 10.8

---

### Story 10.10: Setup RabbitMQ Monitoring in Grafana
**Story ID:** STORY-10-10
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Configure Grafana dashboard for monitoring RabbitMQ message flows.

**Acceptance Criteria:**
- [ ] Prometheus scrapes RabbitMQ metrics (via rabbitmq_exporter)
- [ ] Grafana dashboard shows: queue depths, message rates (in/out), consumer count, error rates
- [ ] Alert rules: DLQ depth > 10, queue depth > 1000, consumer lag > 5 minutes
- [ ] Dashboard accessible at Grafana UI
- [ ] Metrics refresh every 15 seconds
- [ ] Dashboard documented in README

**Implementation Notes:**
- Use rabbitmq_prometheus plugin or rabbitmq_exporter
- Configure Prometheus scrape job
- Import RabbitMQ community dashboard or create custom
- Set alert thresholds appropriately for MVP

**Testing:**
- Verify metrics collection
- Test dashboard visualization
- Trigger alerts manually
- Verify alert notifications

**Dependencies:**
- Story 10.9
- Epic 1: Prometheus and Grafana setup

---

## Epic Acceptance Criteria

- ✅ All services publish/consume events successfully
- ✅ Events follow at-least-once delivery guarantee
- ✅ Failed events moved to DLQ after 5 retries
- ✅ Circuit breakers prevent cascading failures
- ✅ Correlation IDs trace events across services
- ✅ Event processing latency <1 second (p95)
- ✅ Grafana dashboard shows queue depths and throughput
- ✅ Integration tests pass for complete event flows
- ✅ Zero message loss under normal operations

---

## Dependencies

**Blocks:**
- Epic 6: AI Categorization (requires event consumption)
- Epic 8: Budget Service (requires event consumption)
- Epic 9: Notification Service (requires event consumption)

**Depends On:**
- Epic 1: Foundation Setup (RabbitMQ container)

**Enables:**
- Loose coupling between services
- Async processing for scalability
- Resilient architecture

---

## Notes

- Event-driven architecture is complex - invest in testing and monitoring
- Message ordering not guaranteed by default (acceptable for MVP)
- Future: Implement saga pattern for distributed transactions
- Future: Add message versioning for schema evolution
- Future: Implement event sourcing for audit trail
- Document event flows in architecture diagrams
- Consider message compression for large payloads (future)
- Monitor message throughput during beta to validate performance assumptions

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
