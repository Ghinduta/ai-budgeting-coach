# AI Budgeting Coach - Coding Standards

**Version:** 1.0
**Date:** 2025-01-06
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [General Principles](#2-general-principles)
3. [C# / .NET Backend Standards](#3-c--net-backend-standards)
4. [TypeScript / React Frontend Standards](#4-typescript--react-frontend-standards)
5. [Database Standards](#5-database-standards)
6. [API Design Standards](#6-api-design-standards)
7. [Testing Standards](#7-testing-standards)
8. [Documentation Standards](#8-documentation-standards)
9. [Git & Version Control](#9-git--version-control)
10. [Code Review Guidelines](#10-code-review-guidelines)

---

## 1. Overview

### 1.1 Purpose

This document defines coding standards, conventions, and best practices for the AI Budgeting Coach project. All contributors must follow these standards to ensure code quality, maintainability, and consistency across the codebase.

### 1.2 Enforcement

- **Required:** All standards marked as MUST or REQUIRED
- **Recommended:** All standards marked as SHOULD or RECOMMENDED
- **Optional:** All standards marked as MAY or OPTIONAL

### 1.3 Tooling

**Automated Enforcement:**
- **Backend:** Roslyn Analyzers, StyleCop, SonarAnalyzer
- **Frontend:** ESLint, Prettier, TypeScript strict mode
- **Pre-commit Hooks:** Husky for automated checks
- **CI/CD:** GitHub Actions for build-time validation

---

## 2. General Principles

### 2.1 Core Values

1. **Readability First** - Code is read 10x more than written
2. **Simplicity Over Cleverness** - Prefer straightforward solutions
3. **Consistency** - Follow established patterns
4. **Testability** - Write code that's easy to test
5. **Performance Awareness** - Don't optimize prematurely, but be conscious
6. **Security by Default** - Always consider security implications

### 2.2 SOLID Principles

**MUST** follow SOLID principles in all object-oriented code:

- **S**ingle Responsibility Principle
- **O**pen/Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

### 2.3 DRY (Don't Repeat Yourself)

- **MUST NOT** duplicate logic across the codebase
- **SHOULD** extract common functionality into shared utilities
- **SHOULD** use inheritance, composition, or mixins appropriately

### 2.4 YAGNI (You Aren't Gonna Need It)

- **MUST NOT** implement features before they're needed
- **SHOULD** avoid premature abstraction
- **SHOULD** refactor when patterns emerge, not before

---

## 3. C# / .NET Backend Standards

### 3.1 Naming Conventions

#### 3.1.1 General Naming

```csharp
// ✅ CORRECT
public class UserService { }                    // PascalCase for classes
public interface IUserRepository { }            // I-prefix for interfaces
public enum TransactionType { }                 // PascalCase for enums
private readonly ILogger _logger;               // _camelCase for private fields
public string FirstName { get; set; }           // PascalCase for properties
public async Task<User> GetUserAsync() { }      // PascalCase for methods
const int MaxRetries = 3;                       // PascalCase for constants
```

#### 3.1.2 Method Naming

```csharp
// ✅ CORRECT - Use verbs for methods
public async Task<User> CreateUserAsync(CreateUserDto dto) { }
public User GetUserById(string userId) { }
public bool IsUserActive(string userId) { }
public void ValidateInput(string input) { }

// ❌ INCORRECT
public async Task<User> User(CreateUserDto dto) { }  // Missing verb
public User FindUser(string userId) { }              // Use Get for single items
```

### 3.2 File Organization

#### 3.2.1 One Class Per File

**MUST** have one primary type per file, matching the filename.

```
✅ UserService.cs contains public class UserService
❌ Services.cs contains UserService, TransactionService, etc.
```

#### 3.2.2 File Structure Order

```csharp
// 1. Using statements (sorted, System first)
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using BudgetCoach.Core.Interfaces;

// 2. Namespace
namespace BudgetCoach.Services.User;

// 3. Class/Interface definition
public class UserService : IUserService
{
    // 4. Constants
    private const int MaxLoginAttempts = 5;

    // 5. Private readonly fields (dependencies)
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserService> _logger;

    // 6. Constructor
    public UserService(
        IUserRepository userRepository,
        ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    // 7. Public methods
    public async Task<User> GetUserByIdAsync(string userId)
    {
        // Implementation
    }

    // 8. Private methods
    private bool ValidateUserId(string userId)
    {
        // Implementation
    }
}
```

### 3.3 Clean Architecture Pattern

#### 3.3.1 Layer Structure

```
UserService/
├── UserService.API/           # Controllers, middleware, DTOs
├── UserService.Core/          # Domain entities, interfaces, business logic
└── UserService.Infrastructure/ # Data access, external services
```

#### 3.3.2 Dependency Direction

**MUST** follow dependency rules:
- API layer → Core layer
- Infrastructure layer → Core layer
- Core layer → No dependencies (domain-centric)

```csharp
// ✅ CORRECT - Infrastructure depends on Core
namespace BudgetCoach.Infrastructure.Repositories;

using BudgetCoach.Core.Entities;
using BudgetCoach.Core.Interfaces;

public class UserRepository : IUserRepository
{
    // Implementation
}

// ❌ INCORRECT - Core depending on Infrastructure
namespace BudgetCoach.Core.Services;

using BudgetCoach.Infrastructure.Repositories; // ❌ NO!
```

### 3.4 Async/Await Best Practices

#### 3.4.1 Async Suffix

**MUST** suffix async methods with "Async"

```csharp
// ✅ CORRECT
public async Task<User> GetUserAsync(string userId) { }
public async Task<List<Transaction>> GetTransactionsAsync() { }

// ❌ INCORRECT
public async Task<User> GetUser(string userId) { }
```

#### 3.4.2 Avoid Async Void

**MUST NOT** use `async void` except for event handlers

```csharp
// ✅ CORRECT
public async Task ProcessTransactionAsync() { }

// ❌ INCORRECT
public async void ProcessTransaction() { }  // Can't be awaited, swallows exceptions
```

#### 3.4.3 ConfigureAwait

**SHOULD** use `ConfigureAwait(false)` in library code

```csharp
// ✅ CORRECT - In service/library code
var user = await _repository.GetUserAsync(userId).ConfigureAwait(false);

// ✅ CORRECT - In ASP.NET Core controllers (no need for ConfigureAwait)
var user = await _repository.GetUserAsync(userId);
```

### 3.5 Error Handling

#### 3.5.1 Custom Exceptions

**SHOULD** create domain-specific exceptions

```csharp
// ✅ CORRECT
public class UserNotFoundException : Exception
{
    public string UserId { get; }

    public UserNotFoundException(string userId)
        : base($"User with ID '{userId}' was not found.")
    {
        UserId = userId;
    }
}

// Usage
throw new UserNotFoundException(userId);
```

#### 3.5.2 Exception Handling Pattern

```csharp
// ✅ CORRECT
public async Task<User> GetUserAsync(string userId)
{
    if (string.IsNullOrWhiteSpace(userId))
    {
        throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));
    }

    try
    {
        var user = await _repository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new UserNotFoundException(userId);
        }
        return user;
    }
    catch (DbException ex)
    {
        _logger.LogError(ex, "Database error while retrieving user {UserId}", userId);
        throw new DataAccessException("Failed to retrieve user", ex);
    }
}
```

### 3.6 Logging Standards

#### 3.6.1 Structured Logging

**MUST** use structured logging with Serilog

```csharp
// ✅ CORRECT - Structured logging
_logger.LogInformation("User {UserId} logged in from {IpAddress}", userId, ipAddress);

// ❌ INCORRECT - String interpolation
_logger.LogInformation($"User {userId} logged in from {ipAddress}");
```

#### 3.6.2 Log Levels

```csharp
// Trace - Very detailed, development only
_logger.LogTrace("Entering method GetUserAsync with userId: {UserId}", userId);

// Debug - Diagnostic information
_logger.LogDebug("Cache hit for user {UserId}", userId);

// Information - General flow
_logger.LogInformation("User {UserId} created successfully", userId);

// Warning - Unexpected but handled
_logger.LogWarning("User {UserId} login attempt exceeded rate limit", userId);

// Error - Errors and exceptions
_logger.LogError(ex, "Failed to create user {Email}", email);

// Critical - Critical failures
_logger.LogCritical("Database connection lost");
```

### 3.7 Dependency Injection

#### 3.7.1 Constructor Injection

**MUST** use constructor injection for dependencies

```csharp
// ✅ CORRECT
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository repository,
        ILogger<UserService> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
}
```

#### 3.7.2 Service Registration

```csharp
// Startup.cs or Program.cs
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IUserService, UserService>();
services.AddSingleton<ICacheService, RedisCacheService>();
services.AddTransient<IEmailSender, EmailSender>();
```

### 3.8 LINQ Best Practices

```csharp
// ✅ CORRECT - Method syntax for complex queries
var activeUsers = users
    .Where(u => u.IsActive)
    .OrderBy(u => u.LastName)
    .ThenBy(u => u.FirstName)
    .Take(10)
    .ToList();

// ✅ CORRECT - Query syntax when joining
var result = from user in users
             join transaction in transactions on user.Id equals transaction.UserId
             where user.IsActive
             select new { user.Name, transaction.Amount };

// ❌ AVOID - Mixing syntax unnecessarily
var result = (from user in users select user).Where(u => u.IsActive);
```

### 3.9 Null Handling

```csharp
// ✅ CORRECT - Null-conditional operator
var email = user?.Email?.ToLower();

// ✅ CORRECT - Null-coalescing operator
var name = user?.Name ?? "Unknown";

// ✅ CORRECT - Null-coalescing assignment (C# 8+)
_cache ??= new Dictionary<string, object>();

// ✅ CORRECT - Pattern matching
if (user is { IsActive: true, Email: not null })
{
    // Use user.Email safely
}
```

### 3.10 Record Types (C# 9+)

**SHOULD** use records for DTOs and value objects

```csharp
// ✅ CORRECT - Immutable DTO
public record CreateUserDto(
    string Email,
    string Password,
    string FirstName,
    string LastName);

// ✅ CORRECT - Value object
public record Money(decimal Amount, string Currency)
{
    public Money Add(Money other)
    {
        if (Currency != other.Currency)
            throw new InvalidOperationException("Cannot add different currencies");

        return this with { Amount = Amount + other.Amount };
    }
}
```

---

## 4. TypeScript / React Frontend Standards

### 4.1 Naming Conventions

```typescript
// ✅ CORRECT
export interface User { }                      // PascalCase for interfaces/types
export type TransactionType = 'income' | 'expense';
export const MAX_TRANSACTIONS = 1000;          // SCREAMING_SNAKE_CASE for constants
const userId = '123';                          // camelCase for variables
function getUserById(id: string) { }           // camelCase for functions

// React components - PascalCase
export function UserProfile() { }
export const TransactionList: React.FC = () => { };
```

### 4.2 File Organization

#### 4.2.1 File Naming

```
✅ CORRECT
components/UserProfile.tsx           # PascalCase for components
hooks/useAuth.ts                     # camelCase with 'use' prefix for hooks
services/api.service.ts              # camelCase with .service suffix
types/user.types.ts                  # camelCase with .types suffix
utils/format.util.ts                 # camelCase with .util suffix

❌ INCORRECT
components/user-profile.tsx
components/userProfile.tsx
hooks/AuthHook.ts
```

#### 4.2.2 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Shared components
│   │   ├── dashboard/           # Feature-specific components
│   │   ├── transactions/
│   │   └── budgets/
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript types/interfaces
│   ├── utils/                   # Helper functions
│   ├── pages/                   # Page components (routing)
│   ├── layouts/                 # Layout components
│   └── App.tsx
```

### 4.3 TypeScript Standards

#### 4.3.1 Type Annotations

**MUST** use explicit types for function parameters and return types

```typescript
// ✅ CORRECT
function calculateTotal(amounts: number[]): number {
    return amounts.reduce((sum, amount) => sum + amount, 0);
}

async function fetchUser(userId: string): Promise<User> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
}

// ❌ INCORRECT - Missing return type
function calculateTotal(amounts: number[]) {
    return amounts.reduce((sum, amount) => sum + amount, 0);
}
```

#### 4.3.2 Interface vs Type

**SHOULD** prefer `interface` for object shapes, `type` for unions/intersections

```typescript
// ✅ CORRECT - Interface for object shape
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

// ✅ CORRECT - Type for union
export type TransactionType = 'income' | 'expense' | 'transfer';

// ✅ CORRECT - Type for intersection
export type AuthenticatedUser = User & {
    token: string;
    refreshToken: string;
};
```

#### 4.3.3 Avoid 'any'

**MUST NOT** use `any` type except in rare cases

```typescript
// ❌ INCORRECT
function processData(data: any) {
    return data.value;
}

// ✅ CORRECT - Use generic or unknown
function processData<T>(data: T): T {
    return data;
}

// ✅ CORRECT - Use unknown for truly unknown data
function parseJson(json: string): unknown {
    return JSON.parse(json);
}
```

### 4.4 React Component Standards

#### 4.4.1 Functional Components

**MUST** use functional components with hooks

```typescript
// ✅ CORRECT - Functional component
interface UserProfileProps {
    userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.firstName} {user.lastName}</h1>
        </div>
    );
}

// ❌ INCORRECT - Class component (avoid unless necessary)
class UserProfile extends React.Component { }
```

#### 4.4.2 Props Interface

**MUST** define props interface for all components

```typescript
// ✅ CORRECT
interface TransactionListProps {
    transactions: Transaction[];
    onTransactionClick: (transaction: Transaction) => void;
    isLoading?: boolean;  // Optional props marked with ?
}

export function TransactionList({
    transactions,
    onTransactionClick,
    isLoading = false  // Default value
}: TransactionListProps) {
    // Component implementation
}
```

#### 4.4.3 Component File Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user.types';

// 2. Constants
const MAX_DISPLAY_NAME_LENGTH = 50;

// 3. Types/Interfaces
interface UserProfileProps {
    userId: string;
}

// 4. Helper functions (if needed)
function formatDisplayName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.slice(0, MAX_DISPLAY_NAME_LENGTH);
}

// 5. Main component
export function UserProfile({ userId }: UserProfileProps) {
    // Hooks
    const { user } = useAuth();
    const [profile, setProfile] = useState<User | null>(null);

    // Effects
    useEffect(() => {
        // Effect logic
    }, [userId]);

    // Event handlers
    const handleEdit = () => {
        // Handler logic
    };

    // Render
    return (
        <Box>
            {/* JSX */}
        </Box>
    );
}
```

### 4.5 Custom Hooks

**MUST** prefix custom hooks with "use"

```typescript
// ✅ CORRECT
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth logic
    }, []);

    return { user, loading, setUser };
}

// Usage
const { user, loading } = useAuth();
```

### 4.6 State Management (Zustand)

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { User } from '@/types/user.types';

interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    logout: () => set({ user: null, token: null }),
}));

// Usage in component
const { user, setUser, logout } = useAuthStore();
```

### 4.7 API Service Layer

```typescript
// services/api.service.ts
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            timeout: 10000,
        });

        // Request interceptor
        this.client.interceptors.request.use((config) => {
            const token = useAuthStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    useAuthStore.getState().logout();
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string): Promise<T> {
        const response = await this.client.get<T>(url);
        return response.data;
    }

    async post<T>(url: string, data: unknown): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return response.data;
    }
}

export const apiService = new ApiService();
```

### 4.8 Error Handling

```typescript
// ✅ CORRECT - Try-catch with proper error handling
async function fetchTransactions() {
    try {
        const transactions = await apiService.get<Transaction[]>('/transactions');
        setTransactions(transactions);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Failed to fetch transactions';
            toast.error(message);
        } else {
            toast.error('An unexpected error occurred');
        }
        console.error('Error fetching transactions:', error);
    }
}
```

---

## 5. Database Standards

### 5.1 Table Naming

```sql
-- ✅ CORRECT - Singular, lowercase with underscores
CREATE TABLE user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL
);

CREATE TABLE transaction (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL
);

-- ❌ INCORRECT
CREATE TABLE Users ( );       -- Plural
CREATE TABLE User ( );        -- PascalCase
CREATE TABLE user-data ( );   -- Hyphens
```

### 5.2 Column Naming

```sql
-- ✅ CORRECT - lowercase with underscores
CREATE TABLE user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- ❌ INCORRECT
CREATE TABLE user (
    Id UUID PRIMARY KEY,          -- PascalCase
    Email VARCHAR(255),           -- PascalCase
    firstName VARCHAR(100)        -- camelCase
);
```

### 5.3 Indexes

**MUST** create indexes on:
- Foreign keys
- Frequently queried columns
- Columns used in WHERE, JOIN, ORDER BY

```sql
-- ✅ CORRECT
CREATE INDEX idx_transaction_user_id ON transaction(user_id);
CREATE INDEX idx_transaction_date ON transaction(date);
CREATE INDEX idx_transaction_category ON transaction(category);

-- Composite index for common query
CREATE INDEX idx_transaction_user_date ON transaction(user_id, date DESC);
```

### 5.4 Migrations

**MUST** use Entity Framework migrations for schema changes

```bash
# Create migration
dotnet ef migrations add AddCategoryConfidenceToTransaction -p UserService.Infrastructure

# Apply migration
dotnet ef database update -p UserService.Infrastructure
```

---

## 6. API Design Standards

### 6.1 REST API Conventions

#### 6.1.1 HTTP Methods

```
GET     /api/users           # List users
GET     /api/users/{id}      # Get single user
POST    /api/users           # Create user
PUT     /api/users/{id}      # Update user (full replacement)
PATCH   /api/users/{id}      # Partial update
DELETE  /api/users/{id}      # Delete user
```

#### 6.1.2 Response Status Codes

```
200 OK                  # Successful GET, PUT, PATCH
201 Created             # Successful POST
204 No Content          # Successful DELETE
400 Bad Request         # Validation error
401 Unauthorized        # Missing or invalid token
403 Forbidden           # Valid token but insufficient permissions
404 Not Found           # Resource doesn't exist
409 Conflict            # Duplicate resource
422 Unprocessable       # Business rule violation
500 Internal Server     # Server error
```

### 6.2 Request/Response Format

```csharp
// Request DTO
public record CreateTransactionRequest(
    DateTime Date,
    decimal Amount,
    string Merchant,
    string Account,
    string? Category = null,
    string? Notes = null);

// Response DTO
public record TransactionResponse(
    string Id,
    DateTime Date,
    decimal Amount,
    string Merchant,
    string Account,
    string? Category,
    int? CategoryConfidence,
    DateTime CreatedAt);

// Error Response
public record ErrorResponse(
    string Message,
    string? Detail = null,
    Dictionary<string, string[]>? Errors = null);
```

### 6.3 Pagination

```csharp
public record PagedResponse<T>(
    List<T> Data,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);

// Controller
[HttpGet]
public async Task<PagedResponse<TransactionResponse>> GetTransactions(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 50)
{
    // Implementation
}
```

---

## 7. Testing Standards

### 7.1 Test Naming

```csharp
// Pattern: MethodName_Scenario_ExpectedBehavior

// ✅ CORRECT
[Fact]
public async Task GetUserById_UserExists_ReturnsUser()
{
    // Arrange
    var userId = "test-user-id";

    // Act
    var result = await _userService.GetUserByIdAsync(userId);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(userId, result.Id);
}

[Fact]
public async Task GetUserById_UserDoesNotExist_ThrowsNotFoundException()
{
    // Arrange, Act, Assert
}
```

### 7.2 Test Structure (AAA Pattern)

```csharp
[Fact]
public async Task CreateUser_ValidInput_CreatesUserSuccessfully()
{
    // Arrange - Setup test data and mocks
    var dto = new CreateUserDto("test@example.com", "password", "John", "Doe");
    _mockRepository
        .Setup(r => r.CreateAsync(It.IsAny<User>()))
        .ReturnsAsync((User u) => u);

    // Act - Execute the method under test
    var result = await _userService.CreateUserAsync(dto);

    // Assert - Verify the results
    Assert.NotNull(result);
    Assert.Equal(dto.Email, result.Email);
    _mockRepository.Verify(r => r.CreateAsync(It.IsAny<User>()), Times.Once);
}
```

### 7.3 Frontend Testing

```typescript
// Component test with Testing Library
describe('UserProfile', () => {
    it('should display user information when loaded', async () => {
        // Arrange
        const mockUser = { id: '1', firstName: 'John', lastName: 'Doe' };
        vi.mocked(fetchUser).mockResolvedValue(mockUser);

        // Act
        render(<UserProfile userId="1" />);

        // Assert
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(await screen.findByText('John Doe')).toBeInTheDocument();
    });
});
```

---

## 8. Documentation Standards

### 8.1 Code Comments

```csharp
// ✅ CORRECT - XML documentation for public APIs
/// <summary>
/// Retrieves a user by their unique identifier.
/// </summary>
/// <param name="userId">The unique identifier of the user.</param>
/// <returns>The user if found.</returns>
/// <exception cref="UserNotFoundException">Thrown when user is not found.</exception>
public async Task<User> GetUserByIdAsync(string userId)
{
    // Implementation
}

// ✅ CORRECT - Inline comments for complex logic
// Calculate compound interest using A = P(1 + r/n)^(nt)
var futureValue = principal * Math.Pow(1 + rate / periodsPerYear, periodsPerYear * years);

// ❌ INCORRECT - Obvious comments
var total = 0;  // Set total to zero
```

### 8.2 README Files

**MUST** include README.md in each service folder with:
- Service purpose
- Setup instructions
- Environment variables
- API endpoints
- Running tests

---

## 9. Git & Version Control

### 9.1 Commit Messages

**MUST** follow Conventional Commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

```bash
# ✅ CORRECT
feat(user-service): add password reset functionality
fix(transaction-service): resolve duplicate import issue
docs(readme): update setup instructions
refactor(ai-service): extract OpenAI client to separate class

# ❌ INCORRECT
Updated code
Fixed bug
WIP
asdf
```

### 9.2 Branch Naming

```
feature/user-authentication
feature/csv-import
fix/transaction-duplicate-bug
chore/update-dependencies
docs/api-documentation
```

### 9.3 Pull Request Guidelines

**MUST** include in PR description:
- Summary of changes
- Related issue/story number
- Testing performed
- Screenshots (for UI changes)

---

## 10. Code Review Guidelines

### 10.1 Review Checklist

**Functionality:**
- [ ] Code works as intended
- [ ] Edge cases handled
- [ ] Error handling appropriate

**Code Quality:**
- [ ] Follows coding standards
- [ ] No code duplication
- [ ] SOLID principles applied
- [ ] Appropriate abstractions

**Testing:**
- [ ] Unit tests included
- [ ] Test coverage adequate (>80%)
- [ ] Tests are meaningful

**Security:**
- [ ] No sensitive data in code
- [ ] Input validation present
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed

**Performance:**
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] Proper indexing used

### 10.2 Review Tone

- Be respectful and constructive
- Ask questions rather than making demands
- Praise good work
- Focus on the code, not the person
- Provide specific suggestions

```
✅ "Consider using a dictionary here for O(1) lookups instead of iterating"
✅ "Nice use of the repository pattern here!"
❌ "This is terrible code"
❌ "Why didn't you just use X?"
```

---

## Appendix A: Tool Configuration

### ESLint Configuration (.eslintrc.json)

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### EditorConfig (.editorconfig)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{cs,csproj}]
indent_style = space
indent_size = 4

[*.{ts,tsx,js,jsx,json}]
indent_style = space
indent_size = 2
```

---

**End of Coding Standards Document**
