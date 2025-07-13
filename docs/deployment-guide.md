# Deployment Guide

## Overview

This guide covers deploying the Recipe Manager application to production environments.

## Frontend Deployment (Vercel)

1. **Build the frontend:**

   ```bash
   cd apps/frontend
   npm run build
   ```

2. **Deploy to Vercel:**

   ```bash
   npx vercel --prod
   ```

## Backend Deployment (Railway/Render)

1. **Prepare environment variables**
2. **Build the backend:**

   ```bash
   cd apps/backend
   npm run build
   ```

3. **Deploy using platform-specific instructions**

## Database Deployment

1. **Set up PostgreSQL database** (Neon, Supabase, or managed service)
2. **Run migrations:**

   ```bash
   npx prisma migrate deploy
   ```

3. **Seed initial data:**

   ```bash
   npm run db:seed
   ```

## Environment Variables

Ensure all required environment variables are set in production:

- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- FRONTEND_URL
- And others as specified in .env.example

## SSL/TLS Configuration

Configure HTTPS for both frontend and backend in production.

## Monitoring and Logging

Set up monitoring and logging services for production deployment.

## Security Considerations

- Use strong JWT secrets
- Enable CORS with specific origins
- Set up rate limiting
- Use HTTPS only
- Regular security updates
