# Getting Started

This guide will help you set up the Recipe Manager SPA development environment.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Git
- PostgreSQL >= 14.0

## Initial Setup

1. **Clone the Repository**

```bash
git clone <repository-url>
cd Recipe-Manager-SPA
```

1. **Install Dependencies**

```bash
npm install
```

1. **Environment Setup**

Copy the example environment files:

```bash
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env
```

Configure your environment variables:

- `packages/server/.env`:
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Secret for JWT tokens
  - `PORT`: Server port (default: 3000)

- `packages/client/.env`:
  - `VITE_API_URL`: Backend API URL
  - `VITE_APP_PORT`: Frontend port (default: 5173)

1. **Database Setup**

```bash
# Navigate to server package
cd packages/server

# Run migrations
npm run prisma:migrate

# Seed initial data (optional)
npm run prisma:seed
```

## Development Workflow

1. **Start Development Servers**

```bash
# From project root
npm run dev
```

This will start:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- API Documentation: <http://localhost:3000/api-docs>

1. **Check Status**

Before starting work, always check your status:

```bash
npm run status
```

1. **Create Feature Branch**

```bash
npm run branch:checkout feature/your-feature-name
```

1. **Running Tests**

```bash
# Run all tests
npm run test

# Run specific package tests
npm run test --workspace=packages/client
npm run test --workspace=packages/server
npm run test --workspace=packages/e2e
```

1. **Building for Production**

```bash
npm run build
```

## IDE Setup

### VSCode

1. Install recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features

2. Use workspace settings:
   - Enable format on save
   - Use project ESLint configuration
   - Enable TypeScript strict mode

### Environment Troubleshooting

Common issues and solutions:

1. **Port Conflicts**
   - Check if ports 3000 or 5173 are in use
   - Modify ports in .env files if needed

2. **Database Connection**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in server .env
   - Ensure database exists

3. **Node Version**
   - Use `nvm use` to switch to correct version
   - Install required version if missing

## Next Steps

- Review the [Architecture Documentation](./architecture.md)
- Read the [Development Guide](./development.md)
- Check [Contributing Guidelines](../CONTRIBUTING.md)
