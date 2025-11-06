# AI Budgeting Coach - Technology Stack

**Version:** 1.0
**Date:** 2025-01-06
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Backend Technology Stack](#2-backend-technology-stack)
3. [Frontend Technology Stack](#3-frontend-technology-stack)
4. [Data & Messaging Layer](#4-data--messaging-layer)
5. [AI & External Services](#5-ai--external-services)
6. [Infrastructure & DevOps](#6-infrastructure--devops)
7. [Development Tools](#7-development-tools)
8. [Security & Monitoring](#8-security--monitoring)
9. [Version Matrix](#9-version-matrix)
10. [Technology Justification](#10-technology-justification)

---

## 1. Overview

### 1.1 Stack Philosophy

**Boring Technology Where Possible, Exciting Where Necessary**

The AI Budgeting Coach technology stack prioritizes:
- **Maturity** - Battle-tested technologies with strong communities
- **Performance** - Sub-500ms response times for 95% of requests
- **Developer Experience** - Tools that enhance productivity
- **Cost Efficiency** - Open-source first, managed services when beneficial
- **Learning Value** - Technologies that demonstrate modern architecture patterns

### 1.2 Architecture Style

**Event-Driven Microservices** with a **Monorepo** structure

- 6 backend microservices (.NET 8)
- 1 API Gateway (YARP)
- 1 frontend SPA (React 18 + TypeScript)
- Message-driven async communication (RabbitMQ)
- Database-per-service pattern (PostgreSQL)

---

## 2. Backend Technology Stack

### 2.1 Core Framework

#### .NET 8 (C# 12)

**Version:** .NET 8.0 LTS
**Website:** https://dotnet.microsoft.com/

**Why .NET 8:**
- ✅ **LTS Support** - Long-term support until November 2026
- ✅ **Performance** - Industry-leading performance benchmarks
- ✅ **Modern Language** - C# 12 with records, pattern matching, nullable reference types
- ✅ **Async/Await** - First-class async support throughout
- ✅ **Cross-Platform** - Runs on Linux, Windows, macOS
- ✅ **Strong Typing** - Compile-time safety reduces runtime errors
- ✅ **Ecosystem** - Comprehensive package ecosystem (NuGet)

**Key Features Used:**
- Minimal APIs for lightweight services
- Native JSON serialization (System.Text.Json)
- Dependency injection built-in
- Configuration system
- Health checks

**Alternatives Considered:**
- Node.js/Express - Less type safety, different ecosystem
- Java/Spring Boot - More verbose, heavier runtime
- Go - Less mature ORM, smaller ecosystem

---

### 2.2 Web Framework

#### ASP.NET Core Web API

**Version:** 8.0
**Website:** https://learn.microsoft.com/en-us/aspnet/core/

**Why ASP.NET Core:**
- ✅ **Built-in Features** - Routing, model binding, validation
- ✅ **Middleware Pipeline** - Flexible request processing
- ✅ **OpenAPI/Swagger** - Automatic API documentation
- ✅ **Performance** - Consistently top TechEmpower benchmarks
- ✅ **Cloud-Native** - Designed for containerization

**Package:**
```xml
<PackageReference Include="Microsoft.AspNetCore.App" />
```

---

### 2.3 API Gateway

#### YARP (Yet Another Reverse Proxy)

**Version:** 2.1+
**Website:** https://microsoft.github.io/reverse-proxy/

**Why YARP:**
- ✅ **.NET Native** - Same stack as services
- ✅ **High Performance** - Built on Kestrel
- ✅ **Dynamic Configuration** - Runtime route updates
- ✅ **Extensibility** - Custom middleware support
- ✅ **Load Balancing** - Built-in load balancing strategies

**Package:**
```xml
<PackageReference Include="Yarp.ReverseProxy" Version="2.1.0" />
```

**Configuration Example:**
```json
{
  "ReverseProxy": {
    "Routes": {
      "user-route": {
        "ClusterId": "user-service",
        "Match": { "Path": "/api/users/{**catch-all}" }
      }
    },
    "Clusters": {
      "user-service": {
        "Destinations": {
          "destination1": { "Address": "http://user-service:8080" }
        }
      }
    }
  }
}
```

**Alternatives Considered:**
- Nginx - Requires separate technology, configuration outside .NET
- Envoy - Overkill for MVP, complex configuration
- Ocelot - Less actively maintained

---

### 2.4 ORM & Data Access

#### Entity Framework Core 8

**Version:** 8.0+
**Website:** https://learn.microsoft.com/en-us/ef/core/

**Why EF Core 8:**
- ✅ **LINQ Integration** - Type-safe queries
- ✅ **Migrations** - Database schema version control
- ✅ **Async Support** - Full async/await support
- ✅ **Performance** - Compiled queries, query caching
- ✅ **PostgreSQL Support** - Excellent provider support
- ✅ **Change Tracking** - Automatic change detection

**Packages:**
```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
```

**Usage Example:**
```csharp
public class TransactionDbContext : DbContext
{
    public DbSet<Transaction> Transactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("transaction");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Date);
        });
    }
}
```

**Alternatives Considered:**
- Dapper - Micro-ORM, more manual work
- Raw ADO.NET - Too low-level, more boilerplate

---

### 2.5 Message Broker Client

#### MassTransit

**Version:** 8.2+
**Website:** https://masstransit.io/

**Why MassTransit:**
- ✅ **High-Level Abstraction** - Simplifies RabbitMQ usage
- ✅ **Message Patterns** - Pub/Sub, Request/Response, Sagas
- ✅ **Retry Logic** - Built-in retry and circuit breaker
- ✅ **Observability** - OpenTelemetry integration
- ✅ **Testing Support** - In-memory test harness

**Packages:**
```xml
<PackageReference Include="MassTransit" Version="8.2.0" />
<PackageReference Include="MassTransit.RabbitMQ" Version="8.2.0" />
```

**Configuration Example:**
```csharp
services.AddMassTransit(x =>
{
    x.AddConsumer<TransactionCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("rabbitmq", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ConfigureEndpoints(context);
    });
});
```

**Alternatives Considered:**
- RabbitMQ.Client - Lower-level, more boilerplate
- NServiceBus - Commercial license required

---

### 2.6 Validation

#### FluentValidation

**Version:** 11.9+
**Website:** https://docs.fluentvalidation.net/

**Why FluentValidation:**
- ✅ **Fluent API** - Readable validation rules
- ✅ **Separation of Concerns** - Validation logic separate from models
- ✅ **Async Validation** - Supports async validators
- ✅ **ASP.NET Integration** - Automatic model validation

**Package:**
```xml
<PackageReference Include="FluentValidation.AspNetCore" Version="11.9.0" />
```

**Usage Example:**
```csharp
public class CreateTransactionValidator : AbstractValidator<CreateTransactionDto>
{
    public CreateTransactionValidator()
    {
        RuleFor(x => x.Amount)
            .NotEqual(0).WithMessage("Amount cannot be zero");

        RuleFor(x => x.Merchant)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Date)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage("Transaction date cannot be in the future");
    }
}
```

---

### 2.7 Logging

#### Serilog

**Version:** 3.1+
**Website:** https://serilog.net/

**Why Serilog:**
- ✅ **Structured Logging** - JSON-formatted logs
- ✅ **Sinks** - Write to multiple destinations (Console, File, Elasticsearch)
- ✅ **Enrichment** - Add contextual information automatically
- ✅ **Performance** - Efficient and low-overhead

**Packages:**
```xml
<PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
<PackageReference Include="Serilog.Sinks.Console" Version="5.0.0" />
<PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />
```

**Configuration Example:**
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Service", "UserService")
    .WriteTo.Console(new JsonFormatter())
    .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

---

### 2.8 Authentication & Security

#### ASP.NET Core Identity + JWT

**Packages:**
```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
```

**Why This Stack:**
- ✅ **Built-in Identity** - User management, password hashing
- ✅ **JWT Standard** - Industry-standard tokens
- ✅ **BCrypt** - Strong password hashing (10 rounds)
- ✅ **Stateless** - No server-side session storage

**JWT Configuration:**
```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]))
        };
    });
```

---

### 2.9 Testing

#### xUnit + Moq + FluentAssertions

**Packages:**
```xml
<PackageReference Include="xUnit" Version="2.6.6" />
<PackageReference Include="Moq" Version="4.20.70" />
<PackageReference Include="FluentAssertions" Version="6.12.0" />
<PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
<PackageReference Include="Testcontainers" Version="3.7.0" />
```

**Why This Stack:**
- ✅ **xUnit** - Modern, extensible, async-friendly
- ✅ **Moq** - Simple mocking framework
- ✅ **FluentAssertions** - Readable assertions
- ✅ **Testcontainers** - Real database in integration tests

**Example:**
```csharp
[Fact]
public async Task GetUserById_UserExists_ReturnsUser()
{
    // Arrange
    var userId = "test-id";
    _mockRepository
        .Setup(r => r.GetByIdAsync(userId))
        .ReturnsAsync(new User { Id = userId });

    // Act
    var result = await _service.GetUserByIdAsync(userId);

    // Assert
    result.Should().NotBeNull();
    result.Id.Should().Be(userId);
}
```

---

## 3. Frontend Technology Stack

### 3.1 Core Framework

#### React 18.3+

**Version:** 18.3+
**Website:** https://react.dev/

**Why React 18:**
- ✅ **Concurrent Features** - Automatic batching, transitions
- ✅ **Component Model** - Reusable, composable components
- ✅ **Ecosystem** - Largest frontend ecosystem
- ✅ **TypeScript Support** - Excellent type definitions
- ✅ **Developer Tools** - React DevTools, profiler

**Package:**
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0"
}
```

**Alternatives Considered:**
- Vue.js - Smaller ecosystem, less enterprise adoption
- Angular - More opinionated, steeper learning curve
- Svelte - Smaller ecosystem, less mature

---

### 3.2 Type System

#### TypeScript 5.3+

**Version:** 5.3+
**Website:** https://www.typescriptlang.org/

**Why TypeScript:**
- ✅ **Type Safety** - Catch errors at compile time
- ✅ **IntelliSense** - Better IDE support
- ✅ **Refactoring** - Safe refactoring with confidence
- ✅ **Documentation** - Types as documentation
- ✅ **Modern JavaScript** - Latest ECMAScript features

**Package:**
```json
{
  "typescript": "^5.3.3"
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "jsx": "react-jsx"
  }
}
```

---

### 3.3 Build Tool

#### Vite 5+

**Version:** 5.0+
**Website:** https://vitejs.dev/

**Why Vite:**
- ✅ **Fast HMR** - Instant hot module replacement
- ✅ **Optimized Builds** - Rollup-based production builds
- ✅ **TypeScript Support** - Built-in TypeScript support
- ✅ **Modern** - ESM-first, optimized for modern browsers
- ✅ **Plugin Ecosystem** - Rich plugin ecosystem

**Package:**
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.1"
}
```

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

**Alternatives Considered:**
- Create React App - Deprecated, slower builds
- Webpack - More complex configuration
- Next.js - Overkill for SPA, SSR not needed

---

### 3.4 UI Component Library

#### Material-UI (MUI) 5.15+

**Version:** 5.15+
**Website:** https://mui.com/

**Why MUI:**
- ✅ **Comprehensive** - 50+ production-ready components
- ✅ **Accessible** - WCAG 2.1 compliant
- ✅ **Customizable** - Theming system
- ✅ **TypeScript** - Full TypeScript support
- ✅ **Mobile-First** - Responsive by default

**Packages:**
```json
{
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.11.3",
  "@emotion/styled": "^11.11.0"
}
```

**Usage Example:**
```typescript
import { Button, TextField, Box } from '@mui/material';

export function LoginForm() {
  return (
    <Box sx={{ p: 3 }}>
      <TextField label="Email" fullWidth />
      <TextField label="Password" type="password" fullWidth />
      <Button variant="contained" fullWidth>Login</Button>
    </Box>
  );
}
```

**Alternatives Considered:**
- Ant Design - More enterprise-focused, heavier
- Chakra UI - Less comprehensive component set
- Headless UI - Requires custom styling

---

### 3.5 State Management

#### Zustand 4.5+

**Version:** 4.5+
**Website:** https://zustand-demo.pmnd.rs/

**Why Zustand:**
- ✅ **Simple API** - Minimal boilerplate
- ✅ **Lightweight** - ~1KB gzipped
- ✅ **TypeScript** - Excellent TypeScript support
- ✅ **DevTools** - Redux DevTools integration
- ✅ **No Providers** - Direct store access

**Package:**
```json
{
  "zustand": "^4.5.0"
}
```

**Example:**
```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

**Alternatives Considered:**
- Redux Toolkit - More boilerplate, overkill for MVP
- Jotai - Atom-based, different paradigm
- Context API - Performance issues for frequent updates

---

### 3.6 Data Fetching

#### TanStack Query (React Query) 5.x

**Version:** 5.x
**Website:** https://tanstack.com/query/

**Why TanStack Query:**
- ✅ **Caching** - Intelligent caching and invalidation
- ✅ **Background Refetching** - Keep data fresh
- ✅ **Optimistic Updates** - Better UX
- ✅ **DevTools** - Query DevTools
- ✅ **TypeScript** - Full type safety

**Package:**
```json
{
  "@tanstack/react-query": "^5.17.0",
  "@tanstack/react-query-devtools": "^5.17.0"
}
```

**Example:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.get<Transaction[]>('/api/transactions')
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) =>
      apiService.post('/api/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
}
```

**Alternatives Considered:**
- SWR - Similar but less feature-rich
- Apollo Client - GraphQL-specific, overkill
- Custom fetch hooks - Too much manual work

---

### 3.7 Form Handling

#### React Hook Form 7.x

**Version:** 7.x
**Website:** https://react-hook-form.com/

**Why React Hook Form:**
- ✅ **Performance** - Uncontrolled components, minimal re-renders
- ✅ **Validation** - Built-in and custom validation
- ✅ **TypeScript** - Full type inference
- ✅ **Zod Integration** - Schema validation
- ✅ **Small Bundle** - ~9KB gzipped

**Packages:**
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.4"
}
```

**Example:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    // Handle login
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

**Alternatives Considered:**
- Formik - Slower, more re-renders
- Final Form - Less actively maintained

---

### 3.8 HTTP Client

#### Axios 1.6+

**Version:** 1.6+
**Website:** https://axios-http.com/

**Why Axios:**
- ✅ **Interceptors** - Request/response transformation
- ✅ **Automatic JSON** - Automatic JSON parsing
- ✅ **Error Handling** - Structured error handling
- ✅ **TypeScript Support** - Type-safe requests
- ✅ **Cancel Tokens** - Abort requests

**Package:**
```json
{
  "axios": "^1.6.5"
}
```

**Example:**
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

**Alternatives Considered:**
- Fetch API - No interceptors, more manual work
- ky - Newer, smaller ecosystem

---

### 3.9 Routing

#### React Router v6

**Version:** 6.21+
**Website:** https://reactrouter.com/

**Why React Router:**
- ✅ **Industry Standard** - Most popular React router
- ✅ **Nested Routes** - Hierarchical routing
- ✅ **Code Splitting** - Lazy load routes
- ✅ **TypeScript Support** - Type-safe routes

**Package:**
```json
{
  "react-router-dom": "^6.21.0"
}
```

**Example:**
```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'budgets', element: <Budgets /> }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
```

---

### 3.10 Testing

#### Vitest + Testing Library + Playwright

**Packages:**
```json
{
  "vitest": "^1.2.0",
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.2.0",
  "@testing-library/user-event": "^14.5.2",
  "playwright": "^1.41.0"
}
```

**Why This Stack:**
- ✅ **Vitest** - Fast, Vite-native test runner
- ✅ **Testing Library** - Best practices, accessibility-focused
- ✅ **Playwright** - Reliable E2E tests, cross-browser

**Example:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should login successfully', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });
  });
});
```

---

## 4. Data & Messaging Layer

### 4.1 Database

#### PostgreSQL 16

**Version:** 16+
**Website:** https://www.postgresql.org/

**Why PostgreSQL:**
- ✅ **ACID Compliance** - Strong data consistency
- ✅ **JSON Support** - JSONB for flexible schema
- ✅ **Performance** - Excellent query optimizer
- ✅ **Extensions** - pg_trgm for fuzzy search
- ✅ **Open Source** - No licensing costs

**Docker Image:**
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: budgetcoach
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  volumes:
    - postgres-data:/var/lib/postgresql/data
```

**Alternatives Considered:**
- MySQL - Less advanced features
- MongoDB - Not ideal for financial transactions
- SQL Server - Commercial license

---

### 4.2 Message Broker

#### RabbitMQ 3.12+

**Version:** 3.12+
**Website:** https://www.rabbitmq.com/

**Why RabbitMQ:**
- ✅ **Reliability** - Persistent messages, acknowledgments
- ✅ **Routing** - Flexible routing with exchanges
- ✅ **Management UI** - Built-in monitoring
- ✅ **Mature** - Battle-tested, 15+ years
- ✅ **Open Source** - No licensing costs

**Docker Image:**
```yaml
rabbitmq:
  image: rabbitmq:3.12-management-alpine
  environment:
    RABBITMQ_DEFAULT_USER: budgetcoach
    RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
  ports:
    - "15672:15672"  # Management UI
```

**Alternatives Considered:**
- Kafka - Overkill for MVP, more complex
- Azure Service Bus - Vendor lock-in, costs
- Redis Streams - Less mature for messaging

---

## 5. AI & External Services

### 5.1 AI Service

#### OpenAI GPT-4 Turbo

**Version:** gpt-4-turbo-preview
**Website:** https://platform.openai.com/

**Why OpenAI GPT-4 Turbo:**
- ✅ **Accuracy** - State-of-the-art NLP
- ✅ **Context Window** - 128K tokens
- ✅ **Speed** - Faster than GPT-4
- ✅ **Cost-Effective** - $10/1M input tokens
- ✅ **Structured Output** - JSON mode

**Package (.NET):**
```xml
<PackageReference Include="Azure.AI.OpenAI" Version="1.0.0-beta.12" />
```

**Usage:**
```csharp
var client = new OpenAIClient(apiKey);

var response = await client.GetChatCompletionsAsync(
    new ChatCompletionsOptions
    {
        DeploymentName = "gpt-4-turbo-preview",
        Messages = {
            new ChatRequestSystemMessage("You are a transaction categorizer."),
            new ChatRequestUserMessage($"Categorize: {merchantName}")
        },
        Temperature = 0.3f,
        MaxTokens = 100
    });
```

**Cost Estimate (MVP):**
- Transaction categorization: ~50 tokens/transaction
- Monthly cost (1000 transactions): ~$0.50
- Insights generation: ~500 tokens/insight
- Monthly cost (100 insights): ~$0.50
- **Total: ~$1-2/month for MVP**

**Alternatives Considered:**
- Azure AI Language - Limited capabilities
- Custom ML model - Time-consuming, less accurate
- Claude - Similar cost, less ecosystem

---

### 5.2 Email Service

#### SendGrid

**Plan:** Free tier (100 emails/day)
**Website:** https://sendgrid.com/

**Why SendGrid:**
- ✅ **Free Tier** - Sufficient for MVP
- ✅ **Deliverability** - High inbox placement
- ✅ **Templates** - Email templates
- ✅ **API** - Simple REST API
- ✅ **Analytics** - Open/click tracking

**Package (.NET):**
```xml
<PackageReference Include="SendGrid" Version="9.29.1" />
```

**Alternatives Considered:**
- Gmail SMTP - Rate limits, deliverability issues
- Mailgun - Similar, no clear advantage
- AWS SES - More complex setup

---

## 6. Infrastructure & DevOps

### 6.1 Containerization

#### Docker 24+

**Version:** 24+
**Website:** https://www.docker.com/

**Why Docker:**
- ✅ **Portability** - Run anywhere
- ✅ **Isolation** - Process isolation
- ✅ **Consistency** - Dev/prod parity
- ✅ **Standard** - Industry standard

**Dockerfile Example (.NET):**
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["UserService.API/UserService.API.csproj", "UserService.API/"]
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UserService.API.dll"]
```

---

### 6.2 Orchestration

#### Docker Compose 2.x

**Version:** 2.x
**Website:** https://docs.docker.com/compose/

**Why Docker Compose:**
- ✅ **Simple** - Single file configuration
- ✅ **Multi-Container** - Define all services
- ✅ **Development** - Perfect for local dev
- ✅ **Production-Ready** - Sufficient for MVP scale

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  api-gateway:
    build: ./services/ApiGateway
    ports:
      - "5000:8080"
    depends_on:
      - user-service
      - transaction-service

  user-service:
    build: ./services/UserService
    environment:
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=user_db
    depends_on:
      - postgres
      - rabbitmq

  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres-data:/var/lib/postgresql/data

  rabbitmq:
    image: rabbitmq:3.12-management-alpine
```

**Future:** Kubernetes for production scale

---

### 6.3 Reverse Proxy & SSL

#### Nginx 1.25+

**Version:** 1.25+
**Website:** https://nginx.org/

**Why Nginx:**
- ✅ **Performance** - High-performance proxy
- ✅ **SSL/TLS** - SSL termination
- ✅ **Caching** - Static file caching
- ✅ **Load Balancing** - Built-in load balancing

**Docker Image:**
```yaml
nginx:
  image: nginx:1.25-alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

### 6.4 CI/CD

#### GitHub Actions

**Website:** https://github.com/features/actions

**Why GitHub Actions:**
- ✅ **Integrated** - Built into GitHub
- ✅ **Free Tier** - 2000 minutes/month
- ✅ **Ecosystem** - Large action marketplace
- ✅ **Matrix Builds** - Test multiple versions

**Example Workflow:**
```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet test
```

---

## 7. Development Tools

### 7.1 Code Editor

**Primary:** Visual Studio 2022 / VS Code / JetBrains Rider

**Why:**
- ✅ **IntelliSense** - Code completion
- ✅ **Debugging** - Integrated debugger
- ✅ **Extensions** - Rich extension ecosystem

---

### 7.2 API Testing

**Postman / Insomnia / REST Client**

**Why:**
- ✅ **Collection Management** - Organize requests
- ✅ **Environment Variables** - Dev/staging/prod
- ✅ **Testing** - Automated API tests

---

### 7.3 Database Client

**pgAdmin / DBeaver**

**Why:**
- ✅ **Visual Query Builder** - Build queries visually
- ✅ **Schema Viewer** - Visualize database structure
- ✅ **Data Browser** - Browse and edit data

---

### 7.4 Container Management

**Docker Desktop**

**Why:**
- ✅ **GUI** - Visual container management
- ✅ **Logs** - Easy log viewing
- ✅ **Resources** - Monitor resource usage

---

## 8. Security & Monitoring

### 8.1 Metrics Collection

#### Prometheus

**Version:** Latest
**Website:** https://prometheus.io/

**Why Prometheus:**
- ✅ **Time-Series** - Time-series database
- ✅ **Pull Model** - Services expose metrics
- ✅ **Query Language** - PromQL for queries
- ✅ **Alerting** - Alert rules

---

### 8.2 Visualization

#### Grafana

**Version:** Latest
**Website:** https://grafana.com/

**Why Grafana:**
- ✅ **Dashboards** - Beautiful dashboards
- ✅ **Prometheus Integration** - Native support
- ✅ **Alerting** - Alert notifications
- ✅ **Open Source** - Free

---

### 8.3 SSL/TLS

#### Let's Encrypt

**Website:** https://letsencrypt.org/

**Why Let's Encrypt:**
- ✅ **Free** - No cost
- ✅ **Automated** - Automatic renewal
- ✅ **Trusted** - Trusted CA

**Tool:** Certbot

---

## 9. Version Matrix

| Technology | Version | Release Date | Support Until |
|------------|---------|--------------|---------------|
| .NET | 8.0 | Nov 2023 | Nov 2026 (LTS) |
| C# | 12 | Nov 2023 | - |
| React | 18.3+ | Mar 2022 | Active |
| TypeScript | 5.3+ | Nov 2023 | Active |
| PostgreSQL | 16 | Sep 2023 | Nov 2028 |
| RabbitMQ | 3.12 | Jun 2023 | Active |
| Node.js | 20 LTS | Oct 2023 | Apr 2026 |
| Docker | 24+ | May 2023 | Active |

---

## 10. Technology Justification

### 10.1 Backend: .NET 8

**Chosen Over:**
- Node.js/Express
- Java/Spring Boot
- Go

**Justification:**
1. **Performance** - Consistently top benchmarks
2. **Type Safety** - Compile-time error detection
3. **Productivity** - Excellent tooling and IDE support
4. **Async/Await** - First-class async support
5. **Ecosystem** - Mature package ecosystem
6. **LTS Support** - Enterprise-grade support
7. **Learning Value** - Demonstrates modern C# patterns

---

### 10.2 Frontend: React + TypeScript

**Chosen Over:**
- Vue.js
- Angular
- Svelte

**Justification:**
1. **Ecosystem** - Largest component library selection
2. **Type Safety** - TypeScript catches errors early
3. **Component Model** - Reusable, testable components
4. **Job Market** - Most in-demand frontend skill
5. **Developer Experience** - Excellent tooling
6. **Learning Value** - Industry-standard patterns

---

### 10.3 Database: PostgreSQL

**Chosen Over:**
- MySQL
- MongoDB
- SQL Server

**Justification:**
1. **Features** - Most advanced open-source RDBMS
2. **JSON Support** - JSONB for flexible data
3. **ACID** - Strong consistency for financial data
4. **Performance** - Excellent query optimizer
5. **Cost** - Open source, no licensing
6. **Extensions** - Rich extension ecosystem

---

### 10.4 Messaging: RabbitMQ

**Chosen Over:**
- Apache Kafka
- Azure Service Bus
- Redis Streams

**Justification:**
1. **Maturity** - 15+ years in production
2. **Simplicity** - Easier to operate than Kafka
3. **Routing** - Flexible message routing
4. **Management** - Built-in UI
5. **Cost** - Open source
6. **Scale** - Sufficient for MVP and beyond

---

### 10.5 AI: OpenAI GPT-4 Turbo

**Chosen Over:**
- Custom ML model
- Azure AI Language
- AWS Comprehend

**Justification:**
1. **Accuracy** - State-of-the-art results
2. **Time to Market** - No training required
3. **Cost** - ~$1-2/month for MVP
4. **Flexibility** - Multiple use cases (categorization, insights)
5. **Context** - Large context window for complex prompts

---

## Appendix A: Package Versions

### Backend (.NET 8)

```xml
<ItemGroup>
  <!-- Framework -->
  <PackageReference Include="Microsoft.AspNetCore.App" />

  <!-- API Gateway -->
  <PackageReference Include="Yarp.ReverseProxy" Version="2.1.0" />

  <!-- Data Access -->
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />

  <!-- Messaging -->
  <PackageReference Include="MassTransit" Version="8.2.0" />
  <PackageReference Include="MassTransit.RabbitMQ" Version="8.2.0" />

  <!-- Authentication -->
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
  <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />

  <!-- Validation -->
  <PackageReference Include="FluentValidation.AspNetCore" Version="11.9.0" />

  <!-- Logging -->
  <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  <PackageReference Include="Serilog.Sinks.Console" Version="5.0.0" />
  <PackageReference Include="Serilog.Sinks.File" Version="5.0.0" />

  <!-- AI -->
  <PackageReference Include="Azure.AI.OpenAI" Version="1.0.0-beta.12" />

  <!-- Email -->
  <PackageReference Include="SendGrid" Version="9.29.1" />

  <!-- Testing -->
  <PackageReference Include="xUnit" Version="2.6.6" />
  <PackageReference Include="Moq" Version="4.20.70" />
  <PackageReference Include="FluentAssertions" Version="6.12.0" />
  <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
  <PackageReference Include="Testcontainers" Version="3.7.0" />
</ItemGroup>
```

### Frontend (React + TypeScript)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.21.0",
    "typescript": "^5.3.3",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "axios": "^1.6.5",
    "date-fns": "^3.0.6",
    "recharts": "^2.10.4"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vitest": "^1.2.0",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.2.0",
    "@testing-library/user-event": "^14.5.2",
    "playwright": "^1.41.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "prettier": "^3.2.0"
  }
}
```

---

**End of Technology Stack Document**
