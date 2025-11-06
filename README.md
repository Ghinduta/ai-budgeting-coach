# AI Budgeting Coach

An intelligent personal finance management system that uses AI to categorize transactions, provide spending insights, and help users achieve their financial goals.

[![Backend CI](https://github.com/yourusername/ai-budgeting-coach/workflows/Backend%20CI/badge.svg)](https://github.com/yourusername/ai-budgeting-coach/actions)
[![Frontend CI](https://github.com/yourusername/ai-budgeting-coach/workflows/Frontend%20CI/badge.svg)](https://github.com/yourusername/ai-budgeting-coach/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **CSV Transaction Import**: Upload bank statements and automatically import transactions
- **AI-Powered Categorization**: OpenAI integration for intelligent transaction categorization
- **Smart Budget Tracking**: Set budgets by category and receive alerts when nearing limits
- **Real-Time Insights**: View spending patterns, trends, and AI-generated recommendations
- **Email Notifications**: Automated alerts for budget thresholds and important events
- **Secure Authentication**: JWT-based authentication with secure user management

## Architecture

This project follows a **microservices architecture** with event-driven communication:

```
ai-budgeting-coach/
├── backend/services/        # 6 microservices (User, Transaction, AI, Budget, Notification, API Gateway)
├── frontend/web/           # React + TypeScript SPA
├── infrastructure/         # Docker Compose, database scripts, monitoring configs
└── docs/                   # Architecture docs, stories, and standards
```

For detailed architecture documentation, see:
- [Tech Stack](docs/architecture/tech-stack.md)
- [Source Tree](docs/architecture/source-tree.md)
- [Coding Standards](docs/architecture/coding-standards.md)

## Tech Stack

### Backend
- **.NET 8** with C# 12 (ASP.NET Core Web APIs)
- **PostgreSQL 16** (database-per-service pattern)
- **RabbitMQ 3.12** with MassTransit (event bus)
- **Entity Framework Core 8** (ORM)
- **FluentValidation** (input validation)
- **Serilog** (structured logging)

### Frontend
- **React 18** with TypeScript 5
- **Vite** (build tool)
- **Material-UI (MUI) 5** (component library)
- **Zustand** (state management)
- **TanStack Query** (server state)
- **React Router v6** (routing)

### Infrastructure
- **Docker & Docker Compose** (containerization)
- **Prometheus & Grafana** (monitoring)
- **GitHub Actions** (CI/CD)

### AI Integration
- **OpenAI API** (GPT-4 for transaction categorization and insights)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads)

### API Keys Required
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **SendGrid API Key** (optional for email) - [Get one here](https://sendgrid.com/pricing/)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-budgeting-coach.git
cd ai-budgeting-coach
```

### 2. Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
# OPENAI_API_KEY=your-key-here
# SENDGRID_API_KEY=your-key-here (optional)
```

### 3. Start Infrastructure Services

**Linux/macOS:**
```bash
./infrastructure/scripts/setup-dev.sh
```

**Windows:**
```powershell
.\infrastructure\scripts\setup-dev.ps1
```

This will start:
- PostgreSQL (localhost:5432)
- RabbitMQ (localhost:5672, UI at http://localhost:15672)
- Prometheus (http://localhost:9090)
- Grafana (http://localhost:3000)

### 4. Build Backend Services

```bash
# Restore dependencies and build
dotnet restore BudgetCoach.sln
dotnet build BudgetCoach.sln --configuration Release

# Run a service (example: User Service)
cd backend/services/UserService/UserService.API
dotnet run
```

### 5. Build Frontend Application

```bash
cd frontend/web
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

## Service URLs

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| PostgreSQL | localhost:5432 | budgetcoach / budgetcoach |
| RabbitMQ AMQP | localhost:5672 | guest / guest |
| RabbitMQ Management UI | http://localhost:15672 | guest / guest |
| Prometheus | http://localhost:9090 | (no auth) |
| Grafana | http://localhost:3000 | admin / admin |

## Development

### Running Tests

**Backend:**
```bash
dotnet test BudgetCoach.sln --configuration Release
```

**Frontend:**
```bash
cd frontend/web
npm test
```

### Code Quality

**Backend Linting:**
```bash
dotnet format BudgetCoach.sln
```

**Frontend Linting:**
```bash
cd frontend/web
npm run lint
npm run lint:fix
```

### Database Migrations

```bash
# Create a new migration (example for User Service)
cd backend/services/UserService/UserService.Infrastructure
dotnet ef migrations add MigrationName --startup-project ../UserService.API

# Apply migrations
dotnet ef database update --startup-project ../UserService.API
```

## Project Structure

```
ai-budgeting-coach/
├── backend/
│   ├── services/
│   │   ├── UserService/           # User management and authentication
│   │   ├── TransactionService/    # Transaction CRUD and CSV import
│   │   ├── AIService/             # OpenAI categorization and insights
│   │   ├── BudgetService/         # Budget tracking and alerts
│   │   ├── NotificationService/   # Email and push notifications
│   │   └── APIGateway/            # YARP reverse proxy
│   └── shared/
│       ├── Contracts/             # Shared DTOs and interfaces
│       └── EventBus/              # MassTransit event definitions
├── frontend/
│   └── web/                       # React SPA
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   ├── features/          # Feature-based modules
│       │   ├── services/          # API clients
│       │   └── stores/            # Zustand stores
│       └── public/
├── infrastructure/
│   ├── postgres/                  # Database initialization scripts
│   ├── prometheus/                # Prometheus configuration
│   └── scripts/                   # Development setup scripts
├── docs/
│   ├── architecture/              # Architecture documentation
│   └── stories/                   # User stories and requirements
├── .github/
│   └── workflows/                 # CI/CD pipelines
├── docker-compose.yml
├── BudgetCoach.sln
└── README.md
```

## Documentation

- [Architecture Overview](docs/architecture/)
- [Tech Stack Details](docs/architecture/tech-stack.md)
- [Coding Standards](docs/architecture/coding-standards.md)
- [Development Scripts](infrastructure/scripts/README.md)
- [User Stories](docs/stories/)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards (see [docs/architecture/coding-standards.md](docs/architecture/coding-standards.md))
4. Write tests for new functionality
5. Ensure all tests pass and code is linted
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support:
- Open an issue on GitHub
- Review the [documentation](docs/)
- Check the [development scripts README](infrastructure/scripts/README.md)

## Roadmap

### MVP (Epic 1-6)
- [x] Foundation setup (Epic 1)
- [ ] User authentication (Epic 2)
- [ ] Transaction management (Epic 3)
- [ ] AI categorization (Epic 4)
- [ ] Budget tracking (Epic 5)
- [ ] Notifications (Epic 6)

### Future Enhancements
- Mobile app (React Native)
- Advanced analytics and visualizations
- Multi-currency support
- Bank API integration (Plaid)
- Recurring transaction detection
- Financial goal planning

## Acknowledgments

- Built with [.NET 8](https://dotnet.microsoft.com/)
- UI powered by [Material-UI](https://mui.com/)
- AI capabilities by [OpenAI](https://openai.com/)
- Monitoring with [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/)
