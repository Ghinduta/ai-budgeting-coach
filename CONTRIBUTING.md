# Contributing to AI Budgeting Coach

Thank you for your interest in contributing to the AI Budgeting Coach project! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ai-budgeting-coach.git
   cd ai-budgeting-coach
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/ai-budgeting-coach.git
   ```
4. **Set up your development environment** (see [README.md](README.md#quick-start))

## Development Process

### 1. Create a Branch

Create a branch for your work:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

### 2. Make Your Changes

- Follow our [coding standards](docs/architecture/coding-standards.md)
- Write clean, maintainable code
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

**Backend:**
```bash
dotnet test BudgetCoach.sln
dotnet format BudgetCoach.sln --verify-no-changes
```

**Frontend:**
```bash
cd frontend/web
npm test
npm run lint
npm run build
```

### 4. Commit Your Changes

We follow conventional commit messages:
```bash
git commit -m "feat: add transaction filtering by date range"
git commit -m "fix: resolve null reference in budget calculation"
git commit -m "docs: update API endpoint documentation"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Keep Your Fork Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### Backend (.NET / C#)

- **Style Guide**: Follow [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- **Architecture**: Clean Architecture with 3 layers (API, Core, Infrastructure)
- **Naming**:
  - PascalCase for classes, methods, properties
  - camelCase for local variables, parameters
  - Prefix interfaces with `I` (e.g., `IUserRepository`)
- **Async**: Use `async/await` for all I/O operations
- **Null Safety**: Use nullable reference types (`string?`)
- **Validation**: Use FluentValidation for input validation
- **Error Handling**: Use Result pattern, avoid throwing exceptions for business logic

See [docs/architecture/coding-standards.md](docs/architecture/coding-standards.md) for complete guidelines.

### Frontend (React / TypeScript)

- **Style Guide**: Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **TypeScript**: Enable strict mode, avoid `any` types
- **Components**: Use functional components with hooks
- **Naming**:
  - PascalCase for components (e.g., `UserProfile.tsx`)
  - camelCase for functions, variables
  - PascalCase for types/interfaces
- **State Management**: Use Zustand for global state, useState for local state
- **Server State**: Use TanStack Query for API data
- **Styling**: Use Material-UI components, sx prop for styling

See [docs/architecture/coding-standards.md](docs/architecture/coding-standards.md) for complete guidelines.

## Pull Request Process

1. **Ensure all tests pass** and code is properly formatted
2. **Update documentation** if you've changed APIs or added features
3. **Update the README.md** if needed
4. **Create a Pull Request** with a clear title and description:
   ```
   feat: Add transaction filtering by date range

   - Implement date range picker component
   - Add API endpoint for filtered transactions
   - Update transaction list to use date filters
   - Add unit tests for date filtering logic

   Closes #123
   ```
5. **Link related issues** using keywords like `Closes #123` or `Fixes #456`
6. **Request review** from maintainers
7. **Address feedback** by pushing new commits to your branch
8. **Squash commits** if requested before merging

### Pull Request Checklist

- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly documented)
- [ ] Commit messages follow conventional format
- [ ] PR description clearly explains the changes

## Reporting Bugs

When reporting bugs, please include:

1. **Clear title** - Short, descriptive summary
2. **Description** - What happened vs. what you expected
3. **Steps to reproduce**:
   1. Go to '...'
   2. Click on '...'
   3. See error
4. **Environment**:
   - OS: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
   - .NET Version: [e.g., 8.0.1]
   - Node Version: [e.g., 20.10.0]
   - Browser: [e.g., Chrome 120, Firefox 121]
5. **Logs/Screenshots** - Any relevant error messages or screenshots
6. **Possible solution** - If you have suggestions

## Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing issues** to avoid duplicates
2. **Provide context** - What problem does this solve?
3. **Describe the solution** - How should it work?
4. **Consider alternatives** - Are there other approaches?
5. **Note any drawbacks** - Potential challenges or trade-offs

Feature request template:
```markdown
**Problem:**
As a [user type], I want [goal] so that [reason].

**Proposed Solution:**
[Describe how you think this should work]

**Alternatives Considered:**
[Other approaches you've thought about]

**Additional Context:**
[Screenshots, mockups, examples from other apps]
```

## Development Guidelines

### Testing

- **Backend**: Write unit tests for business logic, integration tests for API endpoints
- **Frontend**: Write unit tests for utilities, integration tests for components
- **Coverage**: Aim for >80% code coverage for new code
- **Test Naming**: `[MethodName]_[Scenario]_[ExpectedBehavior]`

Example:
```csharp
[Fact]
public void CalculateTotal_WithValidTransactions_ReturnsSumOfAmounts()
{
    // Arrange, Act, Assert
}
```

### Documentation

- **Code Comments**: Use XML documentation comments for public APIs
- **README**: Keep README.md up to date
- **Architecture Docs**: Update docs/architecture/ when making structural changes
- **API Docs**: Document all API endpoints with OpenAPI/Swagger

### Database Changes

- **Migrations**: Always create EF Core migrations for schema changes
- **Backwards Compatibility**: Avoid breaking changes to existing data
- **Seed Data**: Update seed scripts if needed for development/testing

### Security

- **Never commit secrets** - Use .env files (in .gitignore)
- **Validate all inputs** - Use FluentValidation
- **Sanitize outputs** - Prevent XSS attacks
- **Use parameterized queries** - Prevent SQL injection
- **Follow OWASP guidelines** - [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## Questions?

If you have questions about contributing:

1. Check the [README.md](README.md)
2. Review [docs/architecture/](docs/architecture/)
3. Search existing [GitHub Issues](https://github.com/yourusername/ai-budgeting-coach/issues)
4. Open a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
