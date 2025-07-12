# Recipe Manager SPA

A full-stack Single Page Application (SPA) for managing recipes, built with React, Node.js, Express, and PostgreSQL.

## 🚀 Features

- **Frontend (React SPA)**
  - Built with React and React Router
  - Responsive design with Tailwind CSS
  - Recipe listing with search and filtering
  - Recipe detail view with full information
  - Add/Edit recipe forms with validation
  - User authentication and profile management
  - Modern UI with dark/light theme support

- **Backend (Node.js + Express)**
  - RESTful API with Express
  - PostgreSQL database with Prisma ORM
  - JWT authentication
  - Image upload support
  - Input validation and error handling
  - Rate limiting and security middleware

- **Database**
  - PostgreSQL with Prisma ORM
  - User management with secure password hashing
  - Recipe CRUD operations
  - Database seeding with sample data

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 12.0

## 🛠️ Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Recipe-Manager-SPA
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup PostgreSQL database**
   - Create a PostgreSQL database named `recipe_manager`
   - Update the `DATABASE_URL` in `packages/server/.env` with your credentials

4. **Run the setup script**
   ```bash
   npm run setup
   ```
   This will:
   - Generate Prisma client
   - Run database migrations
   - Seed the database with sample data (10+ recipes and 3 users)

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (http://localhost:3000) and backend (http://localhost:3001)

## 🔧 Manual Setup

If you prefer to set up each component manually:

### Server Setup
```bash
cd packages/server
cp .env.example .env
# Update DATABASE_URL in .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Client Setup
```bash
cd packages/client
npm run dev
```

## 🧪 Testing

Run tests for all packages:
```bash
npm run test
```

Run tests for specific packages:
```bash
# Server tests
npm run test --workspace=packages/server

# Client tests
npm run test --workspace=packages/client

# E2E tests
npm run test:e2e
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Recipes
- `GET /api/recipes` - Get all recipes (with pagination and filtering)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required, owner only)
- `DELETE /api/recipes/:id` - Delete recipe (auth required, owner only)
- `GET /api/recipes/search` - Search recipes
- `GET /api/recipes/categories` - Get recipe categories

### Users
- `GET /api/users/me/recipes` - Get current user's recipes
- `GET /api/users/:id/recipes` - Get user's recipes by ID

## 🗄️ Database Schema

### Users Table
- `id` (String, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `password_hash` (String)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### Recipes Table
- `id` (String, Primary Key)
- `title` (String)
- `ingredients` (String, JSON)
- `instructions` (String)
- `image_url` (String, Optional)
- `cook_time` (Integer, Optional)
- `servings` (Integer, Optional)
- `difficulty` (String, Optional)
- `category` (String, Optional)
- `tags` (String, JSON, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)
- `user_id` (String, Foreign Key)

## 🔐 Sample Users

After running the setup script, you can login with these test accounts:

- **Admin User**: admin@example.com / admin123
- **Chef User**: chef@example.com / chef123
- **Home Cook**: home@example.com / home123

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: ≤768px
- **Tablet**: 768px - 1024px
- **Desktop**: ≥1024px

## 🌟 Additional Features

- **Image Upload**: Support for recipe images
- **Search & Filter**: Full-text search and category filtering
- **Authentication**: JWT-based authentication with refresh tokens
- **Validation**: Client-side and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: CORS, rate limiting, and input sanitization

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd packages/client
npm run build
# Deploy the dist folder
```

### Backend (Render/Railway)
```bash
cd packages/server
npm run build
# Deploy with start script: npm start
```

### Database (Neon/Supabase)
Update the `DATABASE_URL` in production environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
