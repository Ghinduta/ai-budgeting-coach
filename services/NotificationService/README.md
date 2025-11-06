# Notification Service

Notification delivery and management microservice.

## Responsibilities

- Email notification sending (SMTP)
- In-app notification storage
- Notification preferences management
- Notification history tracking
- Email template rendering

## Technology

- ASP.NET Core 8 Web API
- Entity Framework Core 8
- PostgreSQL (notification_db)
- SMTP client (SendGrid/Gmail)
- MassTransit + RabbitMQ

## Database

- **Database Name:** notification_db
- **Tables:** Notifications, NotificationPreferences, EmailLog

## API Endpoints

- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete notification
- `GET /api/notifications/preferences` - Get notification preferences
- `PUT /api/notifications/preferences` - Update preferences

## Event Consumers

- `BudgetAlertTriggered` - Sends budget alert emails
- `InsightGenerated` - Sends insight notifications
