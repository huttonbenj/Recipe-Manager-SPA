# Branch Management

This document outlines the git workflow and branch management strategy for the Recipe Manager SPA.

## Branch Structure

```
main
  └── develop
       ├── feature/feature-name
       ├── bugfix/bug-description
       ├── hotfix/urgent-fix
       └── release/version-number
```

### Branch Types

1. **main**
   - Production code
   - Protected branch
   - Only accepts merges from release branches and hotfixes

2. **develop**
   - Main development branch
   - Protected branch
   - Source for feature branches
   - Integration branch for features

3. **feature/***
   - New features
   - Created from: develop
   - Merges to: develop
   - Naming: `feature/feature-name`

4. **bugfix/***
   - Non-critical bug fixes
   - Created from: develop
   - Merges to: develop
   - Naming: `bugfix/bug-description`

5. **hotfix/***
   - Critical production fixes
   - Created from: main
   - Merges to: main and develop
   - Naming: `hotfix/urgent-fix`

6. **release/***
   - Release preparation
   - Created from: develop
   - Merges to: main and develop
   - Naming: `release/version-number`

## Automated Branch Management

### Status Check System

```bash
npm run status
```

Shows:
- Current branch
- Uncommitted changes
- Unpushed commits
- Branch status relative to develop

### Branch Commands

1. **Create/Checkout Feature Branch**
   ```bash
   npm run branch:checkout feature/my-feature
   ```

2. **Update Current Branch**
   ```bash
   npm run branch:update
   ```

3. **Push Changes**
   ```bash
   npm run push
   ```

4. **Create Pull Request**
   ```bash
   npm run pr
   ```

### Protection Rules

1. **Protected Branches**
   - main
   - develop
   - release/*

2. **Requirements**
   - Clean working directory
   - All tests passing
   - Linting checks passing
   - Code review approval
   - Up-to-date with base branch

## Workflow Examples

### Feature Development

```bash
# 1. Create feature branch
npm run branch:checkout feature/new-recipe-form

# 2. Check status before work
npm run status

# 3. Make changes and commit
git add .
git commit -m "feat(recipes): implement new recipe form [RECIPE-123]"

# 4. Update and push
npm run push

# 5. Create PR
npm run pr
```

### Hotfix Process

```bash
# 1. Create hotfix branch
npm run branch:checkout hotfix/fix-auth-issue

# 2. Make fix and commit
git add .
git commit -m "fix(auth): resolve token validation issue [RECIPE-911]"

# 3. Push and create PR
npm run push
npm run pr
```

### Release Process

```bash
# 1. Create release branch
npm run branch:checkout release/1.2.0

# 2. Update version and changelog
git add .
git commit -m "chore(release): prepare 1.2.0 [RECIPE-REL]"

# 3. Push and create PR
npm run push
npm run pr
```

## Best Practices

1. **Branch Naming**
   - Use descriptive names
   - Include ticket numbers
   - Follow type prefixes

2. **Commits**
   - Use conventional commits
   - Include ticket numbers
   - Keep focused and atomic

3. **Updates**
   - Regularly update from develop
   - Resolve conflicts promptly
   - Keep branches short-lived

4. **Pull Requests**
   - Include description
   - Reference tickets
   - Add tests
   - Request reviews

## Troubleshooting

### Common Issues

1. **Behind Develop**
   ```bash
   npm run branch:update
   ```

2. **Conflict Resolution**
   ```bash
   git fetch origin develop
   git merge develop
   # Resolve conflicts
   git commit
   ```

3. **Wrong Branch**
   ```bash
   # Check status
   npm run status
   
   # Create correct branch
   npm run branch:checkout correct/branch-name
   ```

### Status Check Errors

1. **Uncommitted Changes**
   - Review changes
   - Commit or stash

2. **Behind Develop**
   - Update branch
   - Resolve conflicts

3. **Protected Branch**
   - Create feature branch
   - Follow PR process