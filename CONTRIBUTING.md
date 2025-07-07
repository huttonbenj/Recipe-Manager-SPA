# Contributing to Recipe Manager SPA

## Branching Strategy

We follow a simplified GitFlow branching model:

### Main Branches

- `main` - Production branch. Always stable and deployable.
- `develop` - Main development branch. All feature branches merge here first.

### Supporting Branches

1. **Feature Branches**
   - Branch from: `develop`
   - Merge back into: `develop`
   - Naming: `feature/[description]` (e.g., `feature/user-auth`)
   - For new features and non-emergency bug fixes

2. **Release Branches**
   - Branch from: `develop`
   - Merge back into: `main` and `develop`
   - Naming: `release/[version]` (e.g., `release/1.0.0`)
   - For preparing new production releases

3. **Hotfix Branches**
   - Branch from: `main`
   - Merge back into: `main` and `develop`
   - Naming: `hotfix/[description]` (e.g., `hotfix/login-fix`)
   - For emergency fixes to production

## Branch Workflow

1. Create a feature branch from develop:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature
   ```

2. Make your changes, commit regularly:

   ```bash
   git add .
   git commit -m "type: description"
   ```

3. Keep your branch updated:

   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. Push your changes:

   ```bash
   git push origin feature/your-feature
   ```

5. Create a Pull Request to merge into develop

## Commit Message Format

We follow the Conventional Commits specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example:

```bash
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
```

## Code Review Process

1. All changes must be made via Pull Requests
2. PRs require at least one approval
3. All checks (tests, linting) must pass
4. Commits should be squashed when merging to develop

## Development Setup

[See README.md for development environment setup]
