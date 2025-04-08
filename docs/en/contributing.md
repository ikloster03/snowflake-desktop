# Contributing to Snowflake Desktop

## Core Principles

The Snowflake Desktop project welcomes contributions from the developer community. We strive to maintain high standards of code quality, documentation, and user experience. This document describes the process for contributing to the project.

## Development Setup

### Environment Requirements

- Node.js (latest LTS version)
- pnpm (for package management)
- Rust (stable version)
- Tauri CLI

### Setting Up the Development Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/snowflake-desktop.git
   cd snowflake-desktop
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the development environment:
   ```bash
   pnpm tauri dev
   ```

## Workflow

### 1. Task Selection

- Review the list of open issues on GitHub
- If you plan to work on an existing issue, leave a comment to avoid duplicate work
- If you want to add new functionality, first create an issue for discussion

### 2. Branch Creation

Create a separate branch from `main` for each task:

```bash
git checkout -b feature/feature-name
# or
git checkout -b fix/fix-description
```

Use the following prefixes:

- `feature/` - for new features
- `fix/` - for fixes
- `docs/` - for documentation changes
- `refactor/` - for refactoring
- `test/` - for adding tests

### 3. Development

When developing, follow these principles:

- Follow the project's code style
- Write clean, maintainable code
- Add comments where necessary
- Update documentation when changing functionality

#### Commits

Use meaningful commit messages in the present tense:

```
feat: add character relationship visualization
fix: resolve issue with project loading
docs: update installation instructions
refactor: improve timeline performance
test: add unit tests for book module
```

### 4. Testing

Before submitting a Pull Request:

- Run existing tests:
  ```bash
  pnpm test
  ```
- Add tests for new functionality
- Ensure the application works on all supported platforms

### 5. Creating a Pull Request

1. Make sure your branch is up to date with `main`:

   ```bash
   git checkout main
   git pull
   git checkout your-branch
   git rebase main
   ```

2. Push your changes:

   ```bash
   git push origin your-branch
   ```

3. Create a Pull Request on GitHub
4. Fill out the PR template, describing the changes made
5. Link the PR to the relevant issue (if applicable)

### 6. Code Review

After creating a PR:

- Code will be checked by automated CI checks
- Other developers will review the code
- Make changes based on received comments if necessary

## Code Standards

### TypeScript / Vue 3

- Use Composition API
- Follow Vue Style Guide recommendations (priority A and B)
- Use TypeScript for all new components
- Define types for all parameters and return values

### Rust / Tauri

- Follow official Rust style guidelines
- Use Rust's type safety features
- Handle all potential errors
- Document public APIs

## Documentation Updates

When making code changes, please update the relevant documentation:

- For new features, update `current-features.md`
- For API changes, update the relevant sections of technical documentation
- For UI changes, update the user guide

## Code of Conduct

All project participants must adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Help

If you have questions:

- Ask them in Discussions on GitHub
- Use the Issues section for problem reports
- Contact the core developers through the provided contacts

---

Thank you for your interest in Snowflake Desktop! Your contributions help improve the project and make it more useful for writers.
