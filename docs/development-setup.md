# Development Setup Guide

## Prerequisites

- **Node.js**: v18.0+ (recommended: v20+)
- **npm**: v8.0+ (comes with Node.js)
- **Git**: Latest version
- **PostgreSQL**: v13+ (for production) - SQLite used for development/testing

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Recipe-Manager-SPA

# Install all dependencies (monorepo)
npm install
```

### 2. Environment Setup

#### Backend Environment

Create `apps/backend/.env`:

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite for development
NODE_ENV="development"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
FRONTEND_URL="http://localhost:5173"

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR="uploads"

# Logging
LOG_LEVEL="info"
```

#### Frontend Environment

Create `apps/frontend/.env`:

```env
# API Configuration
VITE_API_URL="http://localhost:3001"

# Development
VITE_NODE_ENV="development"
```

### 3. Database Setup

```bash
# Navigate to backend
cd apps/backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npm run seed
```

### 4. Start Development Servers

```bash
# From project root - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:backend   # Backend only (port 3001)
npm run dev:frontend  # Frontend only (port 5173)
```

Access the application:

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

## Project Structure

```text
Recipe-Manager-SPA/
├── apps/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── controllers/        # Route handlers
│   │   │   ├── services/          # Business logic
│   │   │   ├── middleware/        # Express middleware
│   │   │   ├── routes/            # API routes
│   │   │   ├── prisma/            # Database schema & migrations
│   │   │   ├── types/             # TypeScript definitions
│   │   │   └── utils/             # Helper utilities
│   │   ├── tests/                 # Test suites
│   │   └── uploads/               # File uploads directory
│   └── frontend/                   # React/Vite SPA
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   ├── pages/             # Route components
│       │   ├── context/           # React context providers
│       │   ├── hooks/             # Custom React hooks
│       │   ├── services/          # API client functions
│       │   ├── types/             # TypeScript definitions
│       │   └── utils/             # Helper utilities
│       └── __tests__/             # Test suites
├── packages/
│   └── shared-types/              # Shared TypeScript types
└── docs/                          # Documentation
```

## Key Features

### 🎨 **Modern UI/UX**

- **12 Beautiful Color Themes**: Ocean Blue (default), Emerald Forest, Royal Blue, Purple Haze, Rose Garden, Sunset Orange, Amber Sunset, Deep Teal, Crimson Red, Forest Green, Sunset Pink, Electric Purple
- **Dark Mode by Default**: Automatically starts in dark mode with system/light/dark toggle
- **Fully Responsive**: Mobile-first design that works on all devices
- **Theme-Aware Components**: Dynamic colors that adapt to selected theme and mode

### 🔐 **Authentication & Security**

- JWT-based authentication with 7-day expiration
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Session persistence with automatic token refresh
- CORS and security middleware

### 📱 **Recipe Management**

- **CRUD Operations**: Create, view, edit, delete recipes
- **Rich Media Support**: Image upload with automatic optimization (WebP conversion)
- **Advanced Filtering**: Search by title, tags, cuisine, difficulty, cook time
- **Smart Sorting**: By date, popularity, cook time, alphabetical
- **Pagination**: Efficient loading with customizable page sizes
- **Favorites & Bookmarks**: Save and organize favorite recipes

### 🔍 **Search & Discovery**

- **Real-time Search**: Instant results as you type
- **Multi-criteria Filtering**: Combine multiple filters
- **Quick Filters**: Easy access to common searches (vegetarian, quick meals, etc.)
- **My Recipes**: Filter to see only your created recipes

### 📊 **Data Management**

- **Database**: PostgreSQL (production), SQLite (development/testing)
- **ORM**: Prisma with type-safe queries
- **Migrations**: Automated database schema management
- **Seeding**: Sample data for development

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Backend tests only (54 tests)
cd apps/backend && npm test

# Frontend tests only (28 tests)
cd apps/frontend && npm test

# Watch mode for development
npm run test:watch
```

### Code Quality

```bash
# TypeScript type checking
npm run type-check

# Linting (if configured)
npm run lint

# Format code (if configured)
npm run format
```

### Database Operations

```bash
cd apps/backend

# View database in Prisma Studio
npx prisma studio

# Reset database and reseed
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name "migration_name"

# Deploy migrations to production
npx prisma migrate deploy
```

### File Upload Testing

The application supports image uploads with automatic optimization:

```bash
# Test image upload (requires authentication)
curl -X POST http://localhost:3001/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Recipes

- `GET /api/recipes` - List recipes with filtering/pagination
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (authenticated)
- `PUT /api/recipes/:id` - Update recipe (authenticated, owner only)
- `DELETE /api/recipes/:id` - Delete recipe (authenticated, owner only)

### Favorites & Bookmarks

- `GET /api/user/favorites` - Get user's favorite recipes
- `POST /api/user/favorites/:id` - Add recipe to favorites
- `DELETE /api/user/favorites/:id` - Remove from favorites
- `GET /api/user/bookmarks` - Get user's bookmarked recipes
- `POST /api/user/bookmarks/:id` - Add recipe to bookmarks
- `DELETE /api/user/bookmarks/:id` - Remove from bookmarks

### File Upload

- `POST /api/upload` - Upload recipe image (authenticated)

### Health

- `GET /health` - System health check

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `MAX_FILE_SIZE` | Max upload file size | `5242880` (5MB) |
| `UPLOAD_DIR` | Upload directory | `uploads` |
| `LOG_LEVEL` | Logging level | `info` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |
| `VITE_NODE_ENV` | Environment mode | `development` |

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   
   # Kill process on port 5173
   lsof -ti:5173 | xargs kill -9
   ```

2. **Database Connection Issues**
   - Ensure PostgreSQL is running (production)
   - Check DATABASE_URL is correct
   - Run `npx prisma generate` after schema changes

3. **Module Not Found Errors**

   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Build Issues**

   ```bash
   # Clear build cache
   npm run clean  # if script exists
   rm -rf dist/ .vite/
   ```

### Debug Mode

Enable debug logging:

```bash
# Backend debug mode
DEBUG=* npm run dev:backend

# Check logs
tail -f apps/backend/logs/combined.log
```

## Performance Tips

- Use `npm run dev` to start both servers with one command
- Enable React DevTools for frontend debugging
- Use Prisma Studio for database inspection
- Monitor API response times in Network tab
- Test responsive design with browser DevTools

## Next Steps

- Read [API Documentation](./api-documentation.md) for detailed endpoint specs
- Check [Deployment Guide](./deployment-guide.md) for production setup
- Review [Favorites & Bookmarks](./favorites-bookmarks.md) for feature details

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test: `npm test`
3. Commit changes: `git commit -m "Add new feature"`
4. Push branch: `git push origin feature/new-feature`
5. Create Pull Request

## Support

For issues or questions:

1. Check this documentation
2. Review existing GitHub issues
3. Create new issue with detailed description
4. Include error logs and reproduction steps
