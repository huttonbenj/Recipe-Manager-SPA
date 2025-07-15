# Recipe Manager SPA

This is a single-page application for managing recipes.

<!-- Triggering Vercel deployment -->

A full-stack recipe management application built with modern web technologies. Create, discover, and organize your favorite recipes with a beautiful, responsive interface.

![Recipe Manager](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tests](https://img.shields.io/badge/Tests-82%20passing-brightgreen)

## ✨ Features

### 🎨 **Beautiful UI/UX**

- **12 Stunning Color Themes** - Ocean Blue, Emerald Forest, Royal Blue, Purple Haze, Rose Garden, and more
- **Dark Mode by Default** - Automatic dark theme with light/system options
- **Fully Responsive** - Perfect on desktop, tablet, and mobile devices
- **Modern Design** - Clean, intuitive interface with smooth animations

### 🔐 **Authentication & Security**

- **JWT Authentication** - Secure login with 7-day token expiration
- **Password Security** - Bcrypt hashing with salt rounds
- **Protected Routes** - Secure access to user-specific features
- **Session Persistence** - Stay logged in across browser sessions

### 📱 **Recipe Management**

- **CRUD Operations** - Create, view, edit, and delete recipes
- **Rich Media Support** - Upload images with automatic WebP optimization
- **Detailed Recipe Info** - Ingredients, instructions, cook time, difficulty, and more
- **Recipe Categories** - Organize by cuisine, dietary restrictions, and tags

### 🔍 **Advanced Search & Filtering**

- **Real-time Search** - Instant results as you type
- **Multi-criteria Filtering** - Search by title, tags, cuisine, difficulty, cook time
- **Smart Sorting** - By date, popularity, cook time, or alphabetical
- **Quick Filters** - Easy access to vegetarian, quick meals, and more
- **"My Recipes"** - Filter to see only your created recipes

### ⭐ **Favorites & Bookmarks**

- **Favorites System** - Mark recipes you love with a star
- **Bookmarks** - Save recipes to try later
- **Personal Collections** - Dedicated pages for your saved recipes
- **Quick Access** - Toggle favorites/bookmarks directly from recipe cards

### 🚀 **Performance & Developer Experience**

- **Lightning Fast** - Optimized loading with pagination and image compression
- **Type Safety** - Full TypeScript implementation
- **Comprehensive Testing** - 82 tests covering all major functionality
- **Modern Stack** - React 18, Node.js 20, PostgreSQL, Prisma ORM

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Vitest** for testing

### Backend

- **Node.js 20** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL (production) / SQLite (development)
- **JWT** for authentication
- **Sharp** for image optimization
- **Jest** for testing

### Infrastructure

- **PostgreSQL** for production database
- **Docker** support for containerized deployment
- **Nginx** for reverse proxy and static file serving
- **PM2** for process management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm 8+
- PostgreSQL 13+ (for production)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Recipe-Manager-SPA

# Install all dependencies (monorepo)
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Set up the database
cd apps/backend
npx prisma generate
npx prisma migrate dev
npm run seed

# Start development servers (both frontend and backend)
cd ../..
npm run dev
```

### Access the Application

- **Frontend**: <http://localhost:5173>
- **Backend API**: <http://localhost:3001>
- **Health Check**: <http://localhost:3001/health>

## 📖 Documentation

### Core Documentation

- **[Development Setup](./docs/development-setup.md)** - Complete local development guide
- **[API Documentation](./docs/api-documentation.md)** - Comprehensive API reference
- **[Deployment Guide](./docs/deployment-guide.md)** - Production deployment instructions
- **[Architecture](./docs/architecture.md)** - System architecture and design diagrams

### Feature & Implementation Guides

- **[Favorites & Bookmarks](./docs/favorites-bookmarks.md)** - Feature implementation details
- **[Technical Requirements](./docs/technical-requirements.md)** - Complete technical specifications
- **[Testing Strategy](./docs/testing-strategy.md)** - Testing methodology and best practices
- **[Troubleshooting](./docs/troubleshooting.md)** - Issue resolution and debugging guide

### Quick Links

- [Environment Setup](./docs/development-setup.md#environment-setup)
- [Database Setup](./docs/development-setup.md#database-setup)
- [API Endpoints](./docs/api-documentation.md#authentication-endpoints)
- [Docker Deployment](./docs/deployment-guide.md#option-2-docker-deployment)
- [System Architecture](./docs/architecture.md#system-overview)
- [Test Coverage](./docs/testing-strategy.md#test-coverage)
- [Common Issues](./docs/troubleshooting.md#quick-diagnostics)

## 🎨 Themes & Customization

The application features 12 beautiful color themes:

| Theme | Description | Primary Color |
|-------|-------------|---------------|
| **Ocean Blue** | Default theme with sky blue accents | `#0ea5e9` |
| **Emerald Forest** | Fresh green nature theme | `#10b981` |
| **Royal Blue** | Classic professional blue | `#3b82f6` |
| **Purple Haze** | Modern purple gradient | `#a855f7` |
| **Rose Garden** | Elegant pink theme | `#f43f5e` |
| **Sunset Orange** | Warm orange glow | `#f97316` |
| **Amber Sunset** | Golden amber theme | `#f59e0b` |
| **Deep Teal** | Sophisticated teal | `#14b8a6` |
| **Crimson Red** | Bold red accents | `#dc2626` |
| **Forest Green** | Deep natural green | `#059669` |
| **Sunset Pink** | Soft pink sunset | `#ec4899` |
| **Electric Purple** | Vibrant electric purple | `#8b5cf6` |

## 🧪 Testing

The application includes comprehensive testing with 82 tests:

```bash
# Run all tests
npm test

# Backend tests (54 tests)
cd apps/backend && npm test

# Frontend tests (28 tests)  
cd apps/frontend && npm test

# Watch mode for development
npm run test:watch
```

### Test Coverage

- **Authentication**: Registration, login, JWT handling
- **Recipe Management**: CRUD operations, filtering, search
- **Favorites & Bookmarks**: Add/remove functionality
- **Image Upload**: File validation and optimization
- **API Endpoints**: All routes with error scenarios
- **UI Components**: React component testing
- **Hooks**: Custom hooks with edge cases

## 🚢 Deployment

### Option 1: Traditional Server

Deploy to any VPS or dedicated server with PostgreSQL, Nginx, and PM2.

### Option 2: Docker

Containerized deployment with Docker Compose including database, backend, frontend, and reverse proxy.

### Option 3: Cloud Platforms

Deploy frontend to Vercel/Netlify and backend to Railway/Heroku with managed PostgreSQL.

See the [Deployment Guide](./docs/deployment-guide.md) for detailed instructions.

## 📊 Project Stats

- **Languages**: TypeScript (95%), CSS (3%), HTML (2%)
- **Total Lines**: ~15,000 lines of code
- **Tests**: 82 passing tests (54 backend + 28 frontend)
- **Components**: 25+ reusable React components
- **API Endpoints**: 20+ RESTful endpoints
- **Database Tables**: 4 main entities with relationships

## 🏗️ Architecture

```text
Recipe-Manager-SPA/
├── apps/
│   ├── backend/                    # Node.js/Express API
│   │   ├── src/
│   │   │   ├── controllers/        # Route handlers
│   │   │   ├── services/          # Business logic
│   │   │   ├── middleware/        # Express middleware
│   │   │   ├── routes/            # API routes
│   │   │   ├── prisma/            # Database schema
│   │   │   └── tests/             # Backend tests
│   │   └── uploads/               # File uploads
│   └── frontend/                   # React SPA
│       ├── src/
│       │   ├── components/        # UI components
│       │   ├── pages/             # Route pages
│       │   ├── hooks/             # Custom hooks
│       │   ├── services/          # API client
│       │   └── __tests__/         # Frontend tests
├── packages/shared-types/          # Shared TypeScript types
└── docs/                          # Documentation
```

## 🔧 Key Features Deep Dive

### Recipe Creation & Management

- **Rich Text Editor**: Step-by-step instructions with formatting
- **Ingredient Lists**: Organized ingredient management
- **Image Upload**: Automatic WebP conversion and optimization
- **Metadata**: Cook time, prep time, servings, difficulty ratings
- **Tags & Categories**: Flexible organization system

### Search & Discovery

- **Full-Text Search**: Searches across titles, descriptions, and ingredients
- **Advanced Filters**: Multiple criteria with real-time updates
- **Smart Sorting**: Multiple sort options with persistent preferences
- **Pagination**: Efficient loading of large recipe collections

### User Experience

- **Responsive Design**: Mobile-first approach with perfect tablet/desktop scaling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Optimized images, lazy loading, efficient data fetching
- **Offline Ready**: Service worker for offline browsing (planned)

## 🛣️ Roadmap

### Short Term (Next Release)

- [ ] Recipe collections and meal planning
- [ ] Social features (recipe sharing, comments)
- [ ] Advanced search with nutritional filters
- [ ] Shopping list generation
- [ ] Recipe rating system

### Long Term

- [ ] Mobile app (React Native)
- [ ] AI-powered recipe recommendations
- [ ] Integration with grocery delivery services
- [ ] Video tutorial support
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain test coverage above 80%
- Use conventional commit messages
- Update documentation for new features
- Ensure responsive design compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern recipe apps and food blogs
- **UI Components**: Custom components built with Tailwind CSS
- **Icons**: Lucide React icon library
- **Image Optimization**: Sharp library for WebP conversion
- **Database**: Prisma ORM for type-safe database operations

## 📞 Support

For support and questions:

1. **Documentation**: Check the [docs folder](./docs/) for detailed guides
   - [Troubleshooting Guide](./docs/troubleshooting.md) for common issues
   - [Testing Strategy](./docs/testing-strategy.md) for test-related problems
   - [Architecture Guide](./docs/architecture.md) for system understanding
2. **Issues**: Create a GitHub issue for bugs or feature requests
3. **Health Check**: Visit `/health` endpoint for system status
4. **Logs**: Check application logs for debugging information

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: [View Docs](./docs/api-documentation.md)
- **Development Guide**: [Get Started](./docs/development-setup.md)
- **Deployment Guide**: [Deploy Now](./docs/deployment-guide.md)

---

**Built with ❤️ using modern web technologies**

*Recipe Manager SPA - Making cooking and recipe management a delightful experience.*
