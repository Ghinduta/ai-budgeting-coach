# Epic 1: Foundation Setup

**Epic ID:** EPIC-01
**Priority:** P0 (Blocking)
**Status:** Ready
**Estimated Duration:** 3-5 days
**Owner:** Dev Team

---

## Epic Overview

Establish the foundational infrastructure and project structure for the AI Budgeting Coach application. This epic creates the monorepo structure, sets up the development environment with Docker Compose, and extracts development standards into accessible documentation files.

**Goal:** Enable all developers to run the complete stack locally and begin feature development.

---

## Stories

### Story 1.1: Create Monorepo Structure

**Story ID:** STORY-01-01
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Create the complete monorepo folder structure according to the architecture document specifications, including all service projects, shared libraries, frontend application, infrastructure files, and documentation folders.

**Acceptance Criteria:**
- [ ] Root folder structure matches architecture spec (services/, frontend/, shared/, infrastructure/, tests/, docs/)
- [ ] All 6 microservice folders created with Clean Architecture structure (API, Core, Infrastructure)
- [ ] Shared folders created (Contracts/, Common/, Types/)
- [ ] Frontend web folder created
- [ ] Infrastructure folder created with docker/, scripts/, monitoring/ subfolders
- [ ] Tests folder created with integration/ and e2e/ subfolders
- [ ] All folders contain README.md placeholders
- [ ] .gitignore file configured for .NET and Node.js
- [ ] .editorconfig file created for consistent formatting

**Implementation Notes:**
- Reference: `docs/architecture.md` Section 11 (Unified Project Structure)
- Use exact folder names from architecture document
- Create README.md in each major folder explaining its purpose

**Testing:**
- Manual verification of folder structure
- Ensure no typos in folder names

**Files to Create:**
```
ai-budgeting-coach/
├── .gitignore
├── .editorconfig
├── README.md
├── services/
│   ├── ApiGateway/
│   ├── UserService/
│   │   ├── UserService.API/
│   │   ├── UserService.Core/
│   │   └── UserService.Infrastructure/
│   ├── TransactionService/
│   │   ├── TransactionService.API/
│   │   ├── TransactionService.Core/
│   │   └── TransactionService.Infrastructure/
│   ├── AIService/
│   │   ├── AIService.API/
│   │   ├── AIService.Core/
│   │   └── AIService.Infrastructure/
│   ├── BudgetService/
│   │   ├── BudgetService.API/
│   │   ├── BudgetService.Core/
│   │   └── BudgetService.Infrastructure/
│   └── NotificationService/
│       ├── NotificationService.API/
│       ├── NotificationService.Core/
│       └── NotificationService.Infrastructure/
├── shared/
│   ├── Contracts/
│   ├── Common/
│   └── Types/
├── frontend/
│   └── web/
├── infrastructure/
│   ├── docker/
│   ├── scripts/
│   └── monitoring/
├── tests/
│   ├── integration/
│   └── e2e/
└── docs/
    ├── architecture/
    └── stories/
```

---

### Story 1.2: Extract Development Standards to Separate Files

**Story ID:** STORY-01-02
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Extract the coding standards, technology stack details, and source tree structure from the architecture document into separate markdown files for easier reference during development.

**Acceptance Criteria:**
- [ ] `docs/architecture/coding-standards.md` created with backend and frontend standards
- [ ] `docs/architecture/tech-stack.md` created with complete technology table
- [ ] `docs/architecture/source-tree.md` created with monorepo structure
- [ ] Files referenced correctly in `.bmad-core/core-config.yaml` devLoadAlwaysFiles
- [ ] Each file has clear sections and formatting
- [ ] Code examples preserved from architecture document
- [ ] Files are independently readable (no cross-references required)

**Implementation Notes:**
- Extract Section 3 (Technology Stack) → `tech-stack.md`
- Extract Section 11 (Unified Project Structure) → `source-tree.md`
- Extract Section 15 (Coding Standards) → `coding-standards.md`
- Keep original architecture.md intact, these are reference copies
- Add table of contents to each extracted file

**Testing:**
- Read through each file for completeness
- Verify all code examples render correctly
- Check that devLoadAlwaysFiles paths are correct

**Files to Create:**
- `docs/architecture/coding-standards.md`
- `docs/architecture/tech-stack.md`
- `docs/architecture/source-tree.md`

---

### Story 1.3: Create .NET Solution and Project Files

**Story ID:** STORY-01-03
**Priority:** P0
**Estimated:** 4 hours

**Description:**
Create the .NET solution file and all C# project files for the 6 microservices and shared libraries. Configure project references and dependencies according to Clean Architecture principles.

**Acceptance Criteria:**
- [ ] `AIBudgetCoach.sln` created at root level
- [ ] All service project files (.csproj) created with .NET 8 target framework
- [ ] Project references configured (API → Core, Infrastructure → Core)
- [ ] Shared.Common.csproj created with common utilities
- [ ] All projects compile successfully with `dotnet build`
- [ ] Solution structure visible in Visual Studio/Rider
- [ ] NuGet packages specified for each project type
- [ ] All projects use consistent SDK and language version

**Implementation Notes:**
- Use `dotnet new` CLI to scaffold projects
- API projects: `dotnet new webapi`
- Core projects: `dotnet new classlib`
- Infrastructure projects: `dotnet new classlib`
- Reference: `docs/architecture.md` Section 10 (Backend Architecture)

**NuGet Packages by Project Type:**

**API Projects:**
- Microsoft.AspNetCore.OpenApi (8.0.x)
- Swashbuckle.AspNetCore (6.5.x)
- Serilog.AspNetCore (8.0.x)
- FluentValidation.AspNetCore (11.3.x)
- AutoMapper.Extensions.Microsoft.DependencyInjection (12.0.x)

**Core Projects:**
- No external dependencies (Pure domain logic)

**Infrastructure Projects:**
- Microsoft.EntityFrameworkCore (8.0.x)
- Npgsql.EntityFrameworkCore.PostgreSQL (8.0.x)
- MassTransit.RabbitMQ (8.1.x)

**Testing:**
```bash
dotnet restore AIBudgetCoach.sln
dotnet build AIBudgetCoach.sln
```

**Files to Create:**
- `AIBudgetCoach.sln`
- All `.csproj` files (19 total: 6 API + 6 Core + 6 Infrastructure + 1 Shared)

---

### Story 1.4: Setup Docker Compose Development Environment

**Story ID:** STORY-01-04
**Priority:** P0
**Estimated:** 5 hours

**Description:**
Create Docker Compose configuration for local development environment including PostgreSQL, RabbitMQ, Prometheus, and Grafana. Ensure all infrastructure services start successfully and are accessible.

**Acceptance Criteria:**
- [ ] `infrastructure/docker/docker-compose.yml` created for development
- [ ] PostgreSQL 16 container configured with 6 databases
- [ ] `infrastructure/docker/init-databases.sql` script creates all databases
- [ ] RabbitMQ 3.12 container configured with management UI
- [ ] Prometheus container configured with basic scrape config
- [ ] Grafana container configured with admin credentials
- [ ] `.env.example` file created with required environment variables
- [ ] `docker-compose up -d` starts all services successfully
- [ ] PostgreSQL accessible at localhost:5432
- [ ] RabbitMQ management UI accessible at localhost:15672
- [ ] Prometheus UI accessible at localhost:9090
- [ ] Grafana UI accessible at localhost:3001
- [ ] Health checks configured for all services
- [ ] Volumes configured for data persistence

**Implementation Notes:**
- Reference: `docs/architecture.md` Section 11.4 (Docker Compose Configuration)
- Use official Docker images (postgres:16-alpine, rabbitmq:3.12-management-alpine, etc.)
- Configure proper networking between containers
- Set reasonable resource limits for local development

**Environment Variables:**
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
```

**Testing:**
```bash
cd infrastructure/docker
docker-compose up -d
docker-compose ps  # All services should be "Up" and "healthy"
psql -h localhost -U postgres -c "\l"  # Should list 6 databases
```

**Files to Create:**
- `infrastructure/docker/docker-compose.yml`
- `infrastructure/docker/init-databases.sql`
- `infrastructure/docker/.env.example`
- `infrastructure/docker/README.md` (setup instructions)

---

### Story 1.5: Create GitHub Actions CI/CD Pipeline Skeleton

**Story ID:** STORY-01-05
**Priority:** P1
**Estimated:** 3 hours

**Description:**
Setup basic GitHub Actions workflows for continuous integration including build, test, and lint checks. Prepare foundation for future CD pipeline.

**Acceptance Criteria:**
- [ ] `.github/workflows/backend-ci.yml` created
- [ ] `.github/workflows/frontend-ci.yml` created
- [ ] Backend workflow builds all .NET projects
- [ ] Frontend workflow builds React app
- [ ] Workflows trigger on push to main and pull requests
- [ ] Build status badge added to README.md
- [ ] Workflow runs successfully on GitHub Actions
- [ ] Secrets documented in README for future use

**Implementation Notes:**
- Reference: `docs/architecture.md` Section 12.6 (CI/CD Pipeline)
- Use official GitHub Actions (actions/checkout, actions/setup-dotnet, actions/setup-node)
- Keep workflows simple initially, expand with tests later
- Use matrix strategy for testing multiple .NET versions if desired

**Backend Workflow Steps:**
1. Checkout code
2. Setup .NET 8 SDK
3. Restore dependencies
4. Build solution
5. (Tests placeholder for later)

**Frontend Workflow Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Lint code
5. Build application
6. (Tests placeholder for later)

**Testing:**
- Create a test commit to trigger workflows
- Verify workflows complete successfully
- Check build logs for errors

**Files to Create:**
- `.github/workflows/backend-ci.yml`
- `.github/workflows/frontend-ci.yml`

---

### Story 1.6: Create Development Scripts

**Story ID:** STORY-01-06
**Priority:** P2
**Estimated:** 2 hours

**Description:**
Create utility scripts to simplify common development tasks like starting infrastructure, running migrations, and seeding test data.

**Acceptance Criteria:**
- [ ] `infrastructure/scripts/setup-dev.sh` created (starts Docker services)
- [ ] `infrastructure/scripts/setup-dev.ps1` created (Windows PowerShell version)
- [ ] `infrastructure/scripts/run-migrations.sh` created (placeholder)
- [ ] `infrastructure/scripts/seed-data.sh` created (placeholder)
- [ ] All scripts have executable permissions
- [ ] Scripts include helpful output messages
- [ ] README documents how to use each script

**Implementation Notes:**
- Keep scripts simple and well-commented
- Use set -e to exit on error (bash)
- Check for prerequisites (Docker installed, etc.)
- Provide clear error messages

**setup-dev.sh functionality:**
- Check Docker is running
- Navigate to infrastructure/docker
- Run docker-compose up -d
- Wait for health checks
- Print access URLs

**Testing:**
- Run each script on clean environment
- Verify error handling
- Test on both macOS/Linux and Windows (if PowerShell)

**Files to Create:**
- `infrastructure/scripts/setup-dev.sh`
- `infrastructure/scripts/setup-dev.ps1`
- `infrastructure/scripts/run-migrations.sh`
- `infrastructure/scripts/seed-data.sh`
- `infrastructure/scripts/README.md`

---

### Story 1.7: Setup Frontend React Application

**Story ID:** STORY-01-07
**Priority:** P0
**Estimated:** 3 hours

**Description:**
Initialize the React application with Vite, TypeScript, and Material-UI. Configure project structure according to feature-based architecture.

**Acceptance Criteria:**
- [ ] React app initialized with `npm create vite@latest`
- [ ] TypeScript configured with strict mode
- [ ] Material-UI (MUI) installed and configured
- [ ] Zustand installed for state management
- [ ] TanStack Query installed for data fetching
- [ ] React Router installed for routing
- [ ] Axios installed for HTTP client
- [ ] Vite config includes path aliases (@/, @features/, @shared/, @api/)
- [ ] Feature-based folder structure created
- [ ] `npm run dev` starts development server
- [ ] Basic App.tsx with routing skeleton
- [ ] MUI theme configured with custom palette

**Implementation Notes:**
- Reference: `docs/architecture.md` Section 9 (Frontend Architecture)
- Use TypeScript template: `npm create vite@latest frontend/web -- --template react-ts`
- Install all dependencies in one command for speed
- Configure Vite proxy for API Gateway (localhost:5000)

**Dependencies to Install:**
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install zustand @tanstack/react-query
npm install react-router-dom axios
npm install date-fns recharts
npm install react-hook-form zod @hookform/resolvers
```

**Dev Dependencies:**
```bash
npm install -D @types/node
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Testing:**
```bash
cd frontend/web
npm install
npm run dev  # Should start at localhost:3000
npm run build  # Should build successfully
```

**Files to Create:**
- `frontend/web/package.json`
- `frontend/web/vite.config.ts`
- `frontend/web/tsconfig.json`
- `frontend/web/index.html`
- `frontend/web/src/main.tsx`
- `frontend/web/src/App.tsx`
- `frontend/web/src/theme/index.ts`
- Feature folders (auth/, transactions/, budgets/, insights/, notifications/, dashboard/)

---

### Story 1.8: Create Root README and Documentation

**Story ID:** STORY-01-08
**Priority:** P2
**Estimated:** 2 hours

**Description:**
Create comprehensive README.md at root level with project overview, setup instructions, and links to documentation. Update CONTRIBUTING.md with development guidelines.

**Acceptance Criteria:**
- [ ] Root `README.md` created with project description
- [ ] Setup instructions documented (prerequisites, installation, running locally)
- [ ] Architecture diagram included or linked
- [ ] Technology stack summary included
- [ ] Links to architecture.md and implementation-plan.md
- [ ] Build status badges added (placeholders if workflows not running yet)
- [ ] License file created (MIT)
- [ ] CONTRIBUTING.md created with development workflow
- [ ] Code of Conduct added

**Implementation Notes:**
- Use clear markdown formatting with sections
- Include quick start commands
- Link to more detailed documentation in docs/ folder
- Keep README concise but informative

**README Sections:**
1. Project title and description
2. Features (bulleted list)
3. Architecture overview (with diagram link)
4. Tech stack
5. Prerequisites
6. Quick start
7. Documentation links
8. Contributing
9. License

**Testing:**
- Verify all links work
- Render README on GitHub to check formatting
- Follow setup instructions on clean machine

**Files to Create:**
- `README.md`
- `CONTRIBUTING.md`
- `LICENSE`
- `CODE_OF_CONDUCT.md`

---

## Epic Acceptance Criteria

- ✅ All stories completed and reviewed
- ✅ Monorepo structure matches architecture specification
- ✅ Docker Compose starts all infrastructure services successfully
- ✅ .NET solution builds without errors
- ✅ React application runs in development mode
- ✅ CI/CD pipelines execute successfully
- ✅ Development standards extracted and accessible
- ✅ README documentation complete and accurate
- ✅ No high-priority issues or blockers
- ✅ All team members can run stack locally

---

## Epic Dependencies

**Blocks:**
- Epic 2: User Service & Authentication
- Epic 3: API Gateway
- All other epics

**Depends On:**
- None (foundational epic)

---

## Notes

- This epic establishes the foundation for all future development
- Take time to get this right - it will save time later
- Test thoroughly before moving to Epic 2
- Ensure all team members can successfully run the stack locally before proceeding

---

**Created:** 2025-01-05
**Last Updated:** 2025-01-05
