# Development Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

## Quick Start

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd recipe-manager
   ```

2. **Install dependencies:**

   ```bash
   # Install all dependencies
   npm install
   
   # Or install individually
   cd apps/frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables:**

   ```bash
   # Copy example files
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/backend/.env.example apps/backend/.env
   
   # Edit the .env files with your configuration
   ```

4. **Set up database:**

   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d postgres
   
   # Run migrations
   cd apps/backend
   npx prisma migrate dev
   
   # Seed the database
   npm run db:seed
   ```

5. **Start development servers:**

   ```bash
   # Terminal 1 - Backend
   cd apps/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd apps/frontend
   npm run dev
   ```

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests

## Project Structure

See PROJECT_PLAN.md for detailed project structure information.

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env

2. **Port conflicts:**
   - Default ports: Frontend (5173), Backend (3001)
   - Change ports in configuration if needed

3. **CORS issues:**
   - Ensure FRONTEND_URL is set correctly in backend .env
   - Check ALLOWED_ORIGINS configuration
