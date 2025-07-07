# Recipe Manager SPA

A modern, full-stack Single Page Application for managing recipes, built with TypeScript, React, and Node.js.

## 📚 Documentation Index

- [Getting Started](./docs/getting-started.md) - Setup and run the project
- [Architecture](./docs/architecture.md) - System design and structure
- [Development Guide](./docs/development.md) - Development workflow and guidelines
- [Branch Management](./docs/branch-management.md) - Git workflow and branch strategy
- [Testing](./docs/testing.md) - Testing strategy and guidelines
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Contributing](./CONTRIBUTING.md) - How to contribute to the project

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## 📦 Project Structure

```plaintext
Recipe-Manager-SPA/
├── packages/
│   ├── client/          # React frontend
│   ├── server/          # Express backend
│   ├── shared/          # Shared types and utilities
│   └── e2e/             # End-to-end tests
├── scripts/             # Development and utility scripts
├── docs/               # Documentation
└── package.json        # Root package.json for workspace management
```

## 🛠 Available Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build all packages
- `npm run test` - Run all tests
- `npm run lint` - Lint all packages
- `npm run status` - Check repository status
- `npm run branch:checkout` - Create/checkout feature branch
- `npm run branch:update` - Update current branch
- `npm run push` - Push changes with checks
- `npm run pr` - Create pull request

## 🔍 Status Check System

The project includes an automated status check system that helps maintain code quality and proper development workflow. To check your current status:

```bash
npm run status
```

This will show:

- Current branch
- Uncommitted changes
- Unpushed commits
- Development branch status

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details
