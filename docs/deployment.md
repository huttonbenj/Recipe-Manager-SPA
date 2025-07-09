# Deployment Guide

## Local Development

### Local Development Prerequisites

- Docker
- Docker Compose

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Recipe-Manager-SPA
   ```

2. **Start the services**

   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

## Cloud Deployment

### Cloud Deployment Prerequisites

- Accounts on Vercel, Render, and Supabase

### Frontend Deployment (Vercel)

1. **Connect the GitHub repository** to Vercel.
2. **Configure environment variables** as per `.env.example`.
3. **Deploy the main branch**.

### Backend Deployment (Render)

1. **Create a new web service** on Render.
2. **Connect the GitHub repository**.
3. **Configure environment variables** as per `.env.example`.
4. **Deploy the main branch**.

### Database Deployment (Supabase)

1. **Create a new project** in Supabase.
2. **Import the schema** from `docs/database/schema.sql`.
3. **Configure environment variables** for database connection.
