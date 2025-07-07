# Recipe Manager SPA

## Project Overview

The Recipe Manager is a full-stack Single Page Application (SPA) designed to allow users to browse, search, and manage recipes. The application is built using React for the frontend and Node.js with Express for the backend, connected to a PostgreSQL database.

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Recipe-Manager-SPA
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. **Set up the database**
   - Ensure PostgreSQL is running.
   - Create a database named `recipe_manager`.
   - Run the database migration and seed scripts.

4. **Run the application**

   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Testing**: Jest, Playwright
- **Containerization**: Docker

## Features

- Recipe CRUD operations
- Responsive design for mobile, tablet, and desktop
- Search functionality by title or ingredients
- Image upload support
- Authentication with session-based security

## Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase

For detailed setup and deployment instructions, refer to the documentation in the `docs` directory.
