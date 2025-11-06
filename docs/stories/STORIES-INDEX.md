# AI Budgeting Coach - Stories Index

This document provides an index of all development stories organized by epic.

---

## Epic Status Overview

| Epic | Title | Priority | Duration | Status | Stories | File |
|------|-------|----------|----------|--------|---------|------|
| 1 | Foundation Setup | P0 | 3-5 days | In Progress | 8 | [epic-01-foundation-setup.md](epic-01-foundation-setup.md) |
| 2 | User Service & Authentication | P0 | 5-7 days | Not Started | 16 | [epic-02-user-service-authentication.md](epic-02-user-service-authentication.md) |
| 3 | API Gateway | P0 | 2-3 days | Not Started | 9 | [epic-03-api-gateway.md](epic-03-api-gateway.md) |
| 4 | Transaction Service - CRUD | P1 | 4-6 days | Not Started | 16 | [epic-04-transaction-crud.md](epic-04-transaction-crud.md) |
| 5 | Transaction Service - CSV Import | P1 | 5-7 days | Not Started | 14 | [epic-05-csv-import.md](epic-05-csv-import.md) |
| 6 | AI Service - Categorization | P1 | 4-5 days | Not Started | 13 | [epic-06-ai-categorization.md](epic-06-ai-categorization.md) |
| 7 | AI Service - Insights | P2 | 4-5 days | Not Started | 13 | [epic-07-ai-insights.md](epic-07-ai-insights.md) |
| 8 | Budget Service | P1 | 4-5 days | Not Started | 16 | [epic-08-budget-service.md](epic-08-budget-service.md) |
| 9 | Notification Service | P1 | 4-5 days | Not Started | 17 | [epic-09-notification-service.md](epic-09-notification-service.md) |
| 10 | Event-Driven Integration | P0 | 3-4 days | Not Started | 10 | [epic-10-event-integration.md](epic-10-event-integration.md) |
| 11 | Frontend Polish & UX | P2 | 4-5 days | Not Started | 13 | [epic-11-frontend-polish.md](epic-11-frontend-polish.md) |
| 12 | Testing & Quality | P1 | 5-7 days | Not Started | 10 | [epic-12-testing-quality.md](epic-12-testing-quality.md) |
| 13 | Deployment & DevOps | P1 | 4-5 days | Not Started | 12 | [epic-13-deployment-devops.md](epic-13-deployment-devops.md) |
| 14 | Documentation & Beta Prep | P2 | 3-4 days | Not Started | 10 | [epic-14-documentation-beta.md](epic-14-documentation-beta.md) |

**Total:** 14 epics, ~170 stories, 60-75 days estimated

---

## Current Sprint Focus

**Sprint 1:** Epic 1 (Foundation Setup) - Week 1
- Story 1.1: ✅ Create Monorepo Structure (COMPLETED)
- Story 1.2: Extract Development Standards
- Story 1.3: Create .NET Solution and Projects
- Story 1.4: Setup Docker Compose
- Story 1.5: Create CI/CD Pipeline Skeleton
- Story 1.6: Create Development Scripts
- Story 1.7: Setup Frontend React App
- Story 1.8: Create Documentation

---

## Epic Dependencies Graph

```
Epic 1 (Foundation)
    ↓
    ├── Epic 2 (User Service) ────┐
    │                              ↓
    ├── Epic 3 (API Gateway) ──────┤
    │                              ↓
    ├── Epic 10 (Event Integration)
    │                              ↓
    ├── Epic 4 (Transaction CRUD)  ↓
    ├── Epic 5 (CSV Import)        ↓
    ├── Epic 6 (AI Categorization) ↓
    ├── Epic 7 (AI Insights)       ↓
    ├── Epic 8 (Budget Service)    ↓
    └── Epic 9 (Notifications)     ↓
                                   ↓
        Epic 11 (Frontend Polish)  ↓
                                   ↓
        Epic 12 (Testing & Quality)
                                   ↓
        Epic 13 (Deployment)
                                   ↓
        Epic 14 (Documentation & Beta)
```

---

## Story Naming Convention

Stories follow the pattern: `STORY-{Epic#}-{Story#}`

**Examples:**
- `STORY-01-01` - Create Monorepo Structure
- `STORY-02-01` - Implement User Service Clean Architecture
- `STORY-04-13` - Create frontend TransactionList component

---

## Story Status

- **Not Started** - No work begun
- **In Progress** - Currently being implemented
- **Blocked** - Waiting on dependency or decision
- **In Review** - Code complete, awaiting review
- **Done** - Accepted and merged

---

## Quick Links

- [Implementation Plan](../implementation-plan.md) - Full project plan
- [Architecture Document](../architecture.md) - Technical architecture
- [PRD](../prd.md) - Product requirements

---

**Last Updated:** 2025-01-05
