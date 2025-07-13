# Recipe Manager SPA - Setup Guide

## 🚀 Quick Start

This guide will get your Recipe Manager application running locally in **5 minutes**.

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** (for PostgreSQL database)
- **npm** (comes with Node.js)

## 📋 Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/huttonbenj/Recipe-Manager-SPA.git
cd Recipe-Manager-SPA

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ../..
```

### 2. Environment Configuration

```bash
# Copy environment templates
cp apps/backend/env.template apps/backend/.env
cp apps/frontend/env.template apps/frontend/.env
```

**Note**: The default environment values are pre-configured for local development and should work out of the box.

### 3. Start Database

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres
```

### 4. Setup Database

```bash
# Navigate to backend
cd apps/backend

# Run database migrations
npx prisma migrate dev --schema=src/prisma/schema.prisma --name init

# Seed with sample data (12 recipes + 3 demo users)
npm run db:seed
```

### 5. Start Applications

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
npm run dev
```

### 6. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔑 Demo Credentials

**Email**: demo@recipemanager.com  
**Password**: password123

## 🛠 Development Commands

### Backend Commands

```bash
cd apps/backend

# Development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Database commands
npm run db:migrate    # Run migrations
npm run db:reset      # Reset database
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio

# Testing
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Commands

```bash
cd apps/frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 🔧 Configuration Details

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://recipe_user:recipe_password@localhost:5433/recipe_manager` | PostgreSQL connection string |
| `JWT_SECRET` | `your-super-secret-jwt-key-at-least-32-characters-long-for-security` | JWT signing secret |
| `PORT` | `3001` | Backend server port |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `NODE_ENV` | `development` | Environment mode |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | Backend API URL |
| `VITE_APP_NAME` | `Recipe Manager` | Application name |
| `VITE_MAX_UPLOAD_SIZE` | `5242880` | Max file upload size (5MB) |

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts with authentication
- **recipes** - Recipe data with full-text search
- **Enums** - Difficulty levels (EASY, MEDIUM, HARD)

Key features:
- UUID primary keys for security
- Full-text search with tsvector
- Optimized indexes for performance
- Foreign key relationships

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Recipes
- `GET /api/recipes` - List recipes (with filtering/search)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)

### File Upload
- `POST /api/upload/image` - Upload recipe image

### Search Parameters
- `?search=query` - Full-text search
- `?tags=tag1,tag2` - Filter by tags
- `?cuisine=italian` - Filter by cuisine
- `?difficulty=easy` - Filter by difficulty
- `?limit=20&offset=0` - Pagination

## 🎨 Frontend Features

### Core Components
- **RecipeCard** - Grid/list recipe display
- **RecipeList** - Paginated recipe browsing
- **RecipeFilters** - Advanced search and filtering
- **SearchForm** - Debounced search with suggestions
- **Theme System** - 6 color themes + light/dark mode

### Pages
- **Home** - Landing page with featured recipes
- **Recipes** - Main recipe browsing with filters
- **Recipe Detail** - Interactive recipe viewing
- **Create Recipe** - Comprehensive recipe creation
- **Edit Recipe** - Recipe editing with validation
- **Login/Register** - Authentication forms

## 🚨 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Ensure Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d postgres
```

**Port Already in Use:**
```bash
# Kill processes on ports 3001 or 5173
lsof -ti:3001 | xargs kill
lsof -ti:5173 | xargs kill
```

**Environment Variables Not Loading:**
```bash
# Verify .env files exist
ls -la apps/backend/.env
ls -la apps/frontend/.env

# Copy templates if missing
cp apps/backend/env.template apps/backend/.env
cp apps/frontend/env.template apps/frontend/.env
```

**Migration Errors:**
```bash
# Reset and re-run migrations
cd apps/backend
npm run db:reset
npx prisma migrate dev --schema=src/prisma/schema.prisma --name init
npm run db:seed
```

### Performance Tips

1. **First Time Setup**: Initial `npm install` may take 3-5 minutes
2. **Database Seeding**: Creates 12 sample recipes and 3 demo users
3. **Hot Reload**: Both frontend and backend support hot reloading
4. **Build Time**: Production builds take ~30 seconds

## 📁 Project Structure

```
Recipe-Manager-SPA/
├── apps/
│   ├── backend/           # Node.js + Express API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── prisma/
│   │   │   └── utils/
│   │   └── package.json
│   └── frontend/          # React + TypeScript SPA
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── services/
│       │   └── types/
│       └── package.json
├── docker-compose.yml     # Database configuration
└── README.md             # Project documentation
```

## ✅ Verification Steps

After setup, verify everything works:

1. **Backend Health**: Visit http://localhost:3001/health
2. **Frontend Loading**: Visit http://localhost:5173
3. **Login Test**: Use demo@recipemanager.com / password123
4. **Recipe Browsing**: Browse the 12 sample recipes
5. **Search Test**: Search for "chicken" or "pasta"
6. **Create Test**: Try creating a new recipe

## 🚀 Next Steps

Once running locally:

1. **Explore Features** - Browse recipes, test search, try creating
2. **Development** - Modify components and see hot reloading
3. **API Testing** - Use the backend API with tools like Postman
4. **Database Exploration** - Use `npm run db:studio` for GUI
5. **Production Build** - Test production builds with `npm run build`

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure ports 3001, 5173, and 5433 are available
4. Review terminal output for error messages
5. Try the complete reset procedure below

### Complete Reset Procedure

```bash
# Stop all processes
docker-compose down
cd apps/backend && npm run db:reset

# Fresh install
cd ../../
rm -rf apps/*/node_modules apps/*/dist
cd apps/backend && npm install && cd ../frontend && npm install

# Restart everything
cd ../../
docker-compose up -d postgres
cd apps/backend && npm run db:seed && npm run dev
# In another terminal:
cd apps/frontend && npm run dev
```

---

**Enjoy building with Recipe Manager! 🍳** 