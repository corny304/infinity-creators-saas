# Contributing to Infinity Creators

Thank you for your interest in contributing to Infinity Creators! We welcome contributions from the community and are grateful for your support.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

---

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code.

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** - Descriptive summary of the issue
- **Steps to reproduce** - Detailed steps to reproduce the behavior
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Screenshots** - If applicable, add screenshots
- **Environment** - OS, browser, Node.js version, etc.
- **Additional context** - Any other relevant information

**Bug Report Template:**

```markdown
## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Screenshots
[If applicable]

## Environment
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120]
- Node.js: [e.g., 22.0.0]
- Project Version: [e.g., 1.0.0]

## Additional Context
[Any other relevant information]
```

### ✨ Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** - Descriptive summary of the enhancement
- **Use case** - Why this enhancement would be useful
- **Proposed solution** - How you envision this working
- **Alternatives** - Any alternative solutions you've considered
- **Additional context** - Mockups, examples, or references

**Feature Request Template:**

```markdown
## Feature Description
[Clear description of the feature]

## Use Case
[Why this feature would be useful]

## Proposed Solution
[How you envision this working]

## Alternatives Considered
[Any alternative solutions]

## Additional Context
[Mockups, examples, or references]
```

### 💻 Contributing Code

We welcome code contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Write or update tests**
5. **Run tests** (`pnpm test`)
6. **Commit your changes** (follow commit message guidelines)
7. **Push to your fork** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

---

## Development Setup

### Prerequisites

- **Node.js** 22.x or higher
- **pnpm** 9.x or higher
- **MySQL** database (or use Manus-provided database)
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)
- **Stripe Account** - [Sign up](https://stripe.com)
- **SendGrid API Key** - [Get it here](https://sendgrid.com)

### Installation

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/infinity-creators-saas.git
   cd infinity-creators-saas
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   On Manus Platform:
   - Most variables are auto-configured
   - Add manual secrets via Management UI → Settings → Secrets
   
   For local development:
   - Copy environment variables from ENV_VARIABLES.md
   - Add them via Manus Management UI or create `.env` file (not recommended)

4. **Set up database**
   ```bash
   # Push schema to database
   pnpm db:push

   # Seed script templates
   node scripts/seed-of-templates.mjs

   # (Optional) Seed affiliate links
   node scripts/seed-affiliate-links.mjs
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

### Development Workflow

```bash
# Run development server
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build for production
pnpm build

# Preview production build
pnpm preview

# Database operations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
```

---

## Pull Request Process

### Before Submitting

1. **Check existing PRs** - Avoid duplicate work
2. **Create an issue first** - Discuss major changes before implementing
3. **Follow code style** - Use ESLint and Prettier
4. **Write tests** - Maintain or improve test coverage (>90%)
5. **Update documentation** - Update README, CHANGELOG, or other docs if needed
6. **Test locally** - Ensure all tests pass (`pnpm test`)
7. **Build successfully** - Ensure build completes (`pnpm build`)

### PR Checklist

- [ ] My code follows the project's code style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

### PR Template

```markdown
## Description
[Clear description of what this PR does]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issue
Closes #[issue number]

## How Has This Been Tested?
[Describe the tests you ran]

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** - CI/CD runs tests and linting
2. **Code review** - Maintainers review your code
3. **Feedback** - Address any requested changes
4. **Approval** - Once approved, your PR will be merged
5. **Merge** - Maintainers will merge your PR into main branch

---

## Code Style Guidelines

### TypeScript

- **Use TypeScript** - All code must be type-safe
- **Avoid `any`** - Use proper types or `unknown` instead
- **Prefer interfaces** - Use interfaces for object shapes
- **Use const assertions** - For literal types

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = {
  id: "123",
  name: "Alice",
  email: "alice@example.com",
};

// ❌ Bad
const user: any = {
  id: "123",
  name: "Alice",
  email: "alice@example.com",
};
```

### React

- **Functional components** - Use function components, not class components
- **Hooks** - Use React hooks for state and side effects
- **Avoid inline functions** - Extract to `useCallback` for performance
- **Proper dependencies** - Always specify correct dependency arrays

```typescript
// ✅ Good
const MyComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  return <button onClick={handleClick}>Count: {count}</button>;
};

// ❌ Bad
const MyComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
```

### Naming Conventions

- **Files** - PascalCase for components (`UserProfile.tsx`), camelCase for utilities (`formatDate.ts`)
- **Components** - PascalCase (`UserProfile`, `DashboardLayout`)
- **Functions** - camelCase (`handleClick`, `fetchUserData`)
- **Constants** - UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_BASE_URL`)
- **Types/Interfaces** - PascalCase (`User`, `ApiResponse`)

### Formatting

- **ESLint** - Follow the project's ESLint configuration
- **Prettier** - Code is auto-formatted on commit
- **Indentation** - 2 spaces (not tabs)
- **Line length** - Max 100 characters
- **Semicolons** - Always use semicolons
- **Quotes** - Double quotes for strings

---

## Testing Requirements

### Test Coverage

- **Maintain or improve** - Test coverage must be ≥90%
- **All new features** - Must include tests
- **Bug fixes** - Should include regression tests

### Writing Tests

```typescript
// Example test structure
import { describe, it, expect, beforeEach } from "vitest";

describe("UserService", () => {
  beforeEach(() => {
    // Setup code
  });

  it("should create a new user", async () => {
    // Arrange
    const userData = { name: "Alice", email: "alice@example.com" };
    
    // Act
    const user = await createUser(userData);
    
    // Assert
    expect(user.name).toBe("Alice");
    expect(user.email).toBe("alice@example.com");
  });

  it("should throw error for duplicate email", async () => {
    // Arrange
    const userData = { name: "Alice", email: "alice@example.com" };
    await createUser(userData);
    
    // Act & Assert
    await expect(createUser(userData)).rejects.toThrow("Email already exists");
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test referral.test.ts

# Run tests with coverage
pnpm test --coverage
```

---

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Code style changes (formatting, missing semicolons, etc.)
- **refactor** - Code refactoring (no functional changes)
- **perf** - Performance improvements
- **test** - Adding or updating tests
- **chore** - Maintenance tasks (dependency updates, build config, etc.)

### Examples

```bash
# Feature
feat(generator): add template selection dropdown

# Bug fix
fix(auth): resolve session expiration issue

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(api): simplify credit deduction logic

# Performance
perf(database): optimize query for user transactions

# Test
test(referral): add tests for credit reward system

# Chore
chore(deps): update dependencies to latest versions
```

### Scope

Use the following scopes:

- **auth** - Authentication and authorization
- **generator** - Script generation features
- **dashboard** - Dashboard UI and features
- **pricing** - Pricing page and Stripe integration
- **referral** - Referral system
- **credits** - Credit system
- **templates** - Script templates
- **api** - API and tRPC procedures
- **database** - Database schema and queries
- **ui** - UI components and styling
- **docs** - Documentation
- **deps** - Dependencies
- **config** - Configuration files

---

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** - Check if the issue already exists
2. **Check documentation** - Review README, DEPLOYMENT.md, ENV_VARIABLES.md
3. **Try latest version** - Ensure you're using the latest version
4. **Reproduce the issue** - Verify the issue is reproducible

### Issue Labels

- **bug** - Something isn't working
- **enhancement** - New feature or request
- **documentation** - Improvements or additions to documentation
- **good first issue** - Good for newcomers
- **help wanted** - Extra attention is needed
- **question** - Further information is requested
- **wontfix** - This will not be worked on
- **duplicate** - This issue or pull request already exists
- **invalid** - This doesn't seem right

---

## Feature Requests

We welcome feature requests! Before submitting:

1. **Check roadmap** - See if it's already planned (CHANGELOG.md)
2. **Search existing requests** - Avoid duplicates
3. **Provide context** - Explain the use case and value
4. **Be specific** - Describe the feature in detail

---

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Email** - support@infinitycreators.com

### Getting Help

- **Documentation** - README.md, DEPLOYMENT.md, ENV_VARIABLES.md
- **Manus Support** - https://help.manus.im
- **GitHub Issues** - Create an issue with the `question` label

---

## Recognition

Contributors will be recognized in:

- **README.md** - Contributors section
- **CHANGELOG.md** - Version release notes
- **GitHub Contributors** - Automatic recognition

---

## License

By contributing to Infinity Creators, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

If you have any questions about contributing, please:

1. Check the documentation (README.md, DEPLOYMENT.md)
2. Search existing issues and discussions
3. Create a new issue with the `question` label
4. Email us at support@infinitycreators.com

---

**Thank you for contributing to Infinity Creators! 🚀**

**Maintained by**: Infinity Creators Team  
**Powered by**: Manus Platform
