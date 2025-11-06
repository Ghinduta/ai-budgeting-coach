# Epic 9: Notification Service

**Epic ID:** EPIC-09
**Priority:** P1 (High)
**Status:** Not Started
**Estimated Duration:** 4-5 days
**Owner:** Dev Team
**Depends On:** Epic 8 (Budget Service), Epic 7 (AI Insights)

---

## Epic Overview

Implement the Notification Service for delivering in-app and email notifications to users. The service consumes events from Budget and AI services, stores notification history, and provides user preference management.

**Goal:** Deliver timely, relevant notifications via email and in-app channels with user control over preferences.

---

## Stories

### Story 9.1: Implement Notification Service Clean Architecture
**Story ID:** STORY-09-01
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create the three-layer Clean Architecture structure for Notification Service.

**Acceptance Criteria:**
- [ ] NotificationService.API project created
- [ ] NotificationService.Core project created
- [ ] NotificationService.Infrastructure project created
- [ ] Project references configured
- [ ] NuGet packages installed (EF Core, MassTransit, MailKit/SendGrid, Serilog)
- [ ] Solution compiles successfully

**Implementation Notes:**
- MailKit for SMTP or SendGrid SDK for email service
- Follow same structure as other services

**Testing:**
- Verify compilation
- Check project references

**Dependencies:**
- Epic 1: Foundation Setup

---

### Story 9.2: Create Notification, NotificationPreferences, EmailLog Entities
**Story ID:** STORY-09-02
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Define domain entities for notifications and user preferences.

**Acceptance Criteria:**
- [ ] Notification entity: Id, UserId, Type (enum: BudgetAlert, Insight, System), Title, Message, Priority (enum), RelatedEntityType, RelatedEntityId, IsRead, CreatedAt, ReadAt
- [ ] NotificationPreferences entity: Id, UserId, EmailEnabled, InAppEnabled, BudgetAlertsEnabled, InsightsEnabled, WeeklySummaryEnabled, CreatedAt, UpdatedAt
- [ ] EmailLog entity: Id, NotificationId, RecipientEmail, Subject, Status (enum: Pending, Sent, Failed), SentAt, FailureReason, RetryCount
- [ ] Enums: NotificationType, Priority (Low/Medium/High/Urgent), EmailStatus
- [ ] Default preferences: all enabled

**Implementation Notes:**
- Store preferences per user
- EmailLog for delivery tracking and debugging
- Priority affects notification prominence in UI

**Testing:**
- Unit tests for entity validation
- Test default preferences

**Dependencies:**
- Story 9.1

---

### Story 9.3: Implement NotificationDbContext with EF Core
**Story ID:** STORY-09-03
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Create Entity Framework Core DbContext for Notification Service.

**Acceptance Criteria:**
- [ ] NotificationDbContext inherits from DbContext
- [ ] DbSet properties for Notifications, NotificationPreferences, EmailLogs
- [ ] Fluent API configurations
- [ ] Index on (UserId, CreatedAt DESC) for notification list
- [ ] Index on (UserId, IsRead) for unread count
- [ ] Index on UserId for preferences
- [ ] Foreign key relationships configured
- [ ] No soft delete (hard delete old notifications after 90 days)

**Implementation Notes:**
- Configure cascade delete where appropriate
- Add check constraints for data integrity

**Testing:**
- Verify indexes in migration
- Test query performance

**Dependencies:**
- Story 9.2

---

### Story 9.4: Create NotificationsController and PreferencesController
**Story ID:** STORY-09-04
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Implement REST API controllers for notification management and preferences.

**Acceptance Criteria:**
- [ ] GET /api/notifications - List notifications (paginated, filterable)
- [ ] GET /api/notifications/unread-count - Get unread count
- [ ] PATCH /api/notifications/{id}/read - Mark as read
- [ ] PATCH /api/notifications/mark-all-read - Mark all as read
- [ ] DELETE /api/notifications/{id} - Delete notification
- [ ] GET /api/notifications/preferences - Get user preferences
- [ ] PUT /api/notifications/preferences - Update preferences
- [ ] All endpoints require [Authorize]
- [ ] DTOs for request/response
- [ ] Authorization: users can only access their own notifications

**Implementation Notes:**
- Default page size: 20 notifications
- Filter options: type, priority, read/unread
- Return NotificationResponse DTOs

**Testing:**
- Test all endpoints
- Test authorization
- Test pagination and filtering

**Dependencies:**
- Story 9.3

---

### Story 9.5: Implement SMTP Email Sender (SendGrid/Gmail)
**Story ID:** STORY-09-05
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create email sending service with SMTP configuration.

**Acceptance Criteria:**
- [ ] IEmailSender interface in Core/Interfaces
- [ ] EmailSender implementation in Infrastructure/Email
- [ ] Configuration: SMTP host, port, username, password (from env variables)
- [ ] Support for HTML email templates
- [ ] Async sending (non-blocking)
- [ ] Retry logic: 3 attempts with exponential backoff
- [ ] Timeout: 30 seconds per attempt
- [ ] Error handling and logging
- [ ] Email delivery status tracking (EmailLog)

**Implementation Notes:**
- Use MailKit for SMTP (flexible) or SendGrid SDK (easier)
- Configure TLS/SSL for security
- Template engine: Scriban or Razor for email templates
- Log all email attempts to EmailLog table

**Testing:**
- Unit tests with mocked SMTP client
- Integration test: send test email (use test SMTP service like Ethereal)
- Test retry logic
- Test timeout handling

**Dependencies:**
- Story 9.4

---

### Story 9.6: Implement Email Templates (Budget Alerts, Insights)
**Story ID:** STORY-09-06
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Create HTML email templates for different notification types.

**Acceptance Criteria:**
- [ ] Budget alert email template: subject, greeting, alert details, call-to-action, unsubscribe link
- [ ] AI insight email template: subject, greeting, insight text, WHY/HOW sections, CTA
- [ ] Weekly summary email template: subject, greeting, summary stats, top insights, CTA
- [ ] Templates responsive (mobile-friendly)
- [ ] Templates branded (logo, colors, footer)
- [ ] Templates use user's first name for personalization
- [ ] Templates include app name and tagline
- [ ] Unsubscribe link goes to notification preferences page

**Implementation Notes:**
- Store templates in Infrastructure/Email/Templates folder
- Use template variables: {{userName}}, {{alertCategory}}, {{spentAmount}}, {{limitAmount}}, etc.
- Test templates in email clients (Gmail, Outlook, mobile)
- Follow email best practices (text version, alt text for images)

**Testing:**
- Manual testing: send to various email clients
- Visual testing: verify rendering
- Test personalization variables

**Dependencies:**
- Story 9.5

---

### Story 9.7: Implement BudgetAlertTriggeredConsumer
**Story ID:** STORY-09-07
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create RabbitMQ consumer for budget alert events.

**Acceptance Criteria:**
- [ ] BudgetAlertTriggeredConsumer class
- [ ] Consumes BudgetAlertTriggered events from budget.events exchange
- [ ] Checks user notification preferences
- [ ] If InAppEnabled: creates Notification record
- [ ] If EmailEnabled and BudgetAlertsEnabled: sends email
- [ ] Email subject: "Budget Alert: {Category} spending at {percentage}%"
- [ ] Email body uses budget alert template
- [ ] Handles consumer failures (retry policy)
- [ ] Idempotent: check if notification already created

**Implementation Notes:**
- Query user preferences before processing
- Use email template with alert details
- Link to budget page in email CTA

**Testing:**
- Unit tests with mocked dependencies
- Integration test: publish event → notification created → email sent
- Test preference filtering

**Dependencies:**
- Story 9.6
- Epic 8: BudgetAlertTriggered event
- Epic 10: RabbitMQ configuration

---

### Story 9.8: Implement InsightGeneratedConsumer
**Story ID:** STORY-09-08
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Create RabbitMQ consumer for AI insight events.

**Acceptance Criteria:**
- [ ] InsightGeneratedConsumer class
- [ ] Consumes InsightGenerated events from ai.events exchange
- [ ] Checks user notification preferences
- [ ] If InAppEnabled: creates Notification record (only for High/Medium priority insights)
- [ ] If EmailEnabled and InsightsEnabled: sends email (High priority only)
- [ ] Email subject: "New Financial Insight: {insightHeadline}"
- [ ] Email body uses insight template with WHY/HOW sections
- [ ] Handles consumer failures
- [ ] Idempotent

**Implementation Notes:**
- Filter by priority: in-app for High/Medium, email for High only
- Use insight template
- Link to insights page in email CTA

**Testing:**
- Unit tests
- Integration test: publish event → notification created
- Test priority filtering

**Dependencies:**
- Story 9.7
- Epic 7: InsightGenerated event

---

### Story 9.9: Implement In-App Notification Creation
**Story ID:** STORY-09-09
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Core service for creating in-app notifications.

**Acceptance Criteria:**
- [ ] NotificationService class in Core/Services
- [ ] CreateNotification method: input event data, output Notification entity
- [ ] Generates title and message based on notification type
- [ ] Sets priority based on event details
- [ ] Stores RelatedEntityType and RelatedEntityId for deep linking
- [ ] Deduplicates: check for existing notification with same related entity
- [ ] Trims old notifications: delete notifications older than 90 days

**Implementation Notes:**
- Background job for cleaning old notifications (daily)
- Format notification messages consistently
- Use string templates for message generation

**Testing:**
- Unit tests for notification creation
- Test deduplication
- Test message formatting

**Dependencies:**
- Story 9.8

---

### Story 9.10: Implement Notification Preferences Management
**Story ID:** STORY-09-10
**Priority:** P0
**Estimated:** 2 hours

**Description:**
Service for managing user notification preferences.

**Acceptance Criteria:**
- [ ] PreferencesService class
- [ ] GetPreferences method: returns user preferences or creates default if not exists
- [ ] UpdatePreferences method: validates and saves preference changes
- [ ] Default preferences: all notifications enabled
- [ ] Preferences persisted per user
- [ ] Preferences cached (1 hour TTL) for performance

**Implementation Notes:**
- Create default preferences on user registration (listen to UserRegistered event)
- Use memory cache for frequently accessed preferences
- Validate preference changes

**Testing:**
- Unit tests for preferences management
- Test default creation
- Test caching

**Dependencies:**
- Story 9.9

---

### Story 9.11: Create Database Migrations
**Story ID:** STORY-09-11
**Priority:** P0
**Estimated:** 1 hour

**Description:**
Generate and apply EF Core migrations for notification database.

**Acceptance Criteria:**
- [ ] Migration creates Notifications table
- [ ] Migration creates NotificationPreferences table
- [ ] Migration creates EmailLogs table
- [ ] All indexes created
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
- Story 9.3

---

### Story 9.12: Add Unit Tests for Notification Service
**Story ID:** STORY-09-12
**Priority:** P1
**Estimated:** 4 hours

**Description:**
Create comprehensive unit tests for notification service logic.

**Acceptance Criteria:**
- [ ] Tests for notification creation
- [ ] Tests for email sending logic
- [ ] Tests for preference management
- [ ] Tests for event consumers
- [ ] Tests for email template rendering
- [ ] Tests for deduplication
- [ ] Code coverage >80% for Core layer

**Implementation Notes:**
- Mock email sender
- Mock repositories
- Test with various notification types

**Testing:**
```bash
dotnet test --collect:"XPlat Code Coverage"
```

**Dependencies:**
- Story 9.11

---

### Story 9.13: Add Integration Tests for Email Sending
**Story ID:** STORY-09-13
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Create integration tests for email delivery workflows.

**Acceptance Criteria:**
- [ ] Integration test: create notification → email sent
- [ ] Integration test: verify email template rendering
- [ ] Integration test: test retry logic on failure
- [ ] Integration test: test preference filtering
- [ ] Use test SMTP service (Ethereal or similar)
- [ ] Verify EmailLog entries created
- [ ] Tests clean up data

**Implementation Notes:**
- Use Testcontainers for dependencies
- Use test email service that doesn't send real emails
- Verify email content

**Testing:**
```bash
dotnet test --filter "Category=Integration&Category=Notification"
```

**Dependencies:**
- Story 9.12

---

### Story 9.14: Create Frontend NotificationBell Component
**Story ID:** STORY-09-14
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Build notification bell icon in app header with unread count badge.

**Acceptance Criteria:**
- [ ] Bell icon in app header (top-right)
- [ ] Badge showing unread count (red badge with number)
- [ ] Click bell opens notification panel
- [ ] Badge updates in real-time (poll every 30 seconds or use WebSocket)
- [ ] Bell icon color changes if unread notifications exist
- [ ] Accessible: keyboard navigation, ARIA labels

**Implementation Notes:**
- Use MUI Badge and IconButton components
- Poll /api/notifications/unread-count endpoint
- Use TanStack Query with refetch interval

**Testing:**
- Test visual appearance
- Test badge updates
- Test click behavior
- Test accessibility

**Dependencies:**
- Story 9.13
- Epic 2: Frontend auth

---

### Story 9.15: Create Frontend NotificationList Component
**Story ID:** STORY-09-15
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Build notification panel/drawer showing list of notifications.

**Acceptance Criteria:**
- [ ] Notification panel slides out from top-right
- [ ] Lists notifications (most recent first)
- [ ] Each notification shows: icon (by type), title, message (truncated), time ago, read status
- [ ] Unread notifications highlighted (bold text, background color)
- [ ] Click notification: mark as read, navigate to related page (if applicable)
- [ ] "Mark all as read" button at top
- [ ] "Clear all" button (deletes all read notifications)
- [ ] Pagination: load more on scroll (infinite scroll)
- [ ] Empty state: "No notifications yet"
- [ ] Loading state while fetching

**Implementation Notes:**
- Use MUI Drawer or Popover
- Use TanStack Query for data fetching
- Implement infinite scroll with IntersectionObserver
- Format timestamps with date-fns (relative time)

**Testing:**
- Test notification display
- Test mark as read
- Test navigation
- Test pagination
- Test responsive design

**Dependencies:**
- Story 9.14

---

### Story 9.16: Create Frontend NotificationPreferences Page
**Story ID:** STORY-09-16
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Build settings page for managing notification preferences.

**Acceptance Criteria:**
- [ ] Preferences page in Settings section
- [ ] Toggle switches for: Email Notifications, In-App Notifications, Budget Alerts, AI Insights, Weekly Summary
- [ ] Preferences saved on toggle (optimistic update)
- [ ] Success feedback when saved
- [ ] Current preferences loaded on page load
- [ ] Explanation text for each preference type
- [ ] "Disable All" quick action
- [ ] Responsive design

**Implementation Notes:**
- Use MUI Switch components
- Use React Hook Form for state management
- API calls on each toggle change

**Testing:**
- Test preference updates
- Test disable all
- Test loading state

**Dependencies:**
- Story 9.15

---

### Story 9.17: Implement Real-Time Notification Updates
**Story ID:** STORY-09-17
**Priority:** P2
**Estimated:** 3 hours

**Description:**
Add real-time updates for new notifications without full page refresh.

**Acceptance Criteria:**
- [ ] Poll /api/notifications/unread-count every 30 seconds
- [ ] Poll /api/notifications when panel is open (every 10 seconds)
- [ ] Show toast notification for High/Urgent priority notifications
- [ ] Toast includes: icon, title, message preview, "View" button
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Click toast opens notification panel and navigates to item
- [ ] Stop polling when user is idle (no activity for 5 minutes)

**Implementation Notes:**
- Use TanStack Query with refetchInterval
- Use MUI Snackbar for toasts
- Detect user idle state with event listeners
- WebSocket implementation deferred to Phase 2

**Testing:**
- Test polling behavior
- Test toast notifications
- Test idle detection

**Dependencies:**
- Story 9.16

---

## Epic Acceptance Criteria

- ✅ Email notifications sent for budget alerts
- ✅ In-app notifications stored in database
- ✅ Users can view notification history
- ✅ Users can mark notifications as read
- ✅ Users can customize notification preferences
- ✅ Email templates professional and clear
- ✅ Frontend notification bell shows unread count
- ✅ Notification list paginated and filterable
- ✅ Unit test coverage >80%
- ✅ Integration tests pass for email sending

---

## Dependencies

**Blocks:**
- None (end of notification delivery chain)

**Depends On:**
- Epic 8: Budget Service (publishes BudgetAlertTriggered events)
- Epic 7: AI Insights (publishes InsightGenerated events)
- Epic 10: Event Integration (RabbitMQ messaging)

**Enables:**
- User engagement through timely notifications
- Retention through weekly summaries (future)

---

## Notes

- Notification delivery is critical for user engagement
- Test email rendering across clients (Gmail, Outlook, Apple Mail)
- Future: Push notifications for mobile web (Progressive Web App)
- Future: SMS notifications (Twilio integration)
- Future: Weekly summary emails with curated insights
- Future: Notification scheduling (daily digest instead of immediate)
- Monitor email delivery rates and bounces
- Implement proper unsubscribe flow (legal requirement)

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
