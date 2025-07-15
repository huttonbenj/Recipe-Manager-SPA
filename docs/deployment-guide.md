# Deployment Guide

## Overview

This guide covers deploying the Recipe Manager SPA to production environments. The application consists of a React frontend and Node.js backend with PostgreSQL database.

**Stack:**

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL (production), SQLite (development/testing)
- **File Storage**: Local filesystem with optimized image processing

## Prerequisites

### System Requirements

- **Node.js**: v18.0+ (recommended: v20+)
- **PostgreSQL**: v13+ with connection pooling
- **Memory**: Minimum 1GB RAM (recommended: 2GB+)
- **Storage**: 10GB+ for application and uploads
- **SSL Certificate**: Required for production HTTPS

### Domain and DNS

- Configured domain name (e.g., `yourdomain.com`)
- DNS A records pointing to your server
- SSL certificate (Let's Encrypt recommended)

## Environment Configuration

### Backend Environment (.env)

Create `apps/backend/.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/recipe_manager?schema=public"
NODE_ENV="production"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
FRONTEND_URL="https://yourdomain.com"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="/var/www/recipe-manager/uploads"

# Logging
LOG_LEVEL="info"

# Security (optional)
ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

### Frontend Environment (.env.production)

Create `apps/frontend/.env.production`:

```env
# API Configuration
VITE_API_URL="https://yourdomain.com/api"

# Environment
VITE_NODE_ENV="production"
```

## Deployment Options

### Option 1: Traditional Server Deployment

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

#### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE recipe_manager;
CREATE USER recipe_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE recipe_manager TO recipe_user;
\q
```

#### 3. Application Deployment

```bash
# Create app directory
sudo mkdir -p /var/www/recipe-manager
sudo chown $USER:$USER /var/www/recipe-manager

# Clone repository
cd /var/www/recipe-manager
git clone <your-repo-url> .

# Install dependencies
npm install

# Build applications
npm run build

# Set up uploads directory
mkdir -p uploads
chmod 755 uploads

# Run database migrations
cd apps/backend
npx prisma migrate deploy
npx prisma generate

# Seed database (optional)
npm run seed
```

#### 4. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'recipe-manager-backend',
      script: 'apps/backend/dist/server.js',
      cwd: '/var/www/recipe-manager',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/recipe-manager/backend-error.log',
      out_file: '/var/log/recipe-manager/backend-out.log',
      log_file: '/var/log/recipe-manager/backend.log',
      time: true
    }
  ]
};
```

Start the application:

```bash
# Create log directory
sudo mkdir -p /var/log/recipe-manager
sudo chown $USER:$USER /var/log/recipe-manager

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set up PM2 auto-startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

#### 5. Nginx Configuration

Create `/etc/nginx/sites-available/recipe-manager`:

```nginx
# Frontend server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/recipe-manager/apps/frontend/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Uploads proxy to backend
    location /uploads/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cache uploaded images
        expires 1M;
        add_header Cache-Control "public";
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        access_log off;
    }

    # SPA fallback - serve index.html for client-side routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Security headers for HTML
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \.(env|log|conf)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/recipe-manager /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 6. SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

#### 1. Create Production Dockerfiles

**Backend Dockerfile (`apps/backend/Dockerfile.prod`):**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/backend ./apps/backend
COPY packages/shared-types ./packages/shared-types

# Build application
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S recipe-manager -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=recipe-manager:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=recipe-manager:nodejs /app/apps/backend/node_modules ./node_modules
COPY --from=builder --chown=recipe-manager:nodejs /app/apps/backend/package.json ./package.json

# Copy Prisma files
COPY --from=builder --chown=recipe-manager:nodejs /app/apps/backend/src/prisma ./prisma

# Create uploads directory
RUN mkdir -p ./uploads && chown recipe-manager:nodejs ./uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

USER recipe-manager

EXPOSE 3001

CMD ["node", "dist/server.js"]
```

**Frontend Dockerfile (`apps/frontend/Dockerfile.prod`):**

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages/shared-types ./packages/shared-types

# Build application
WORKDIR /app/apps/frontend
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend Nginx config (`apps/frontend/nginx.conf`):**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### 2. Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: recipe-manager-db
    environment:
      POSTGRES_DB: recipe_manager
      POSTGRES_USER: recipe_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U recipe_user -d recipe_manager"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile.prod
    container_name: recipe-manager-backend
    environment:
      DATABASE_URL: postgresql://recipe_user:${DB_PASSWORD}@postgres:5432/recipe_manager
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 3001
      FRONTEND_URL: https://${DOMAIN}
    volumes:
      - uploads_data:/app/uploads
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile.prod
      args:
        - VITE_API_URL=https://${DOMAIN}/api
    container_name: recipe-manager-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: recipe-manager-proxy
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - uploads_data:/var/www/uploads:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  uploads_data:
    driver: local
```

#### 3. Environment Setup

Create `.env.prod`:

```env
# Database
DB_PASSWORD=your_secure_database_password

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long

# Domain
DOMAIN=yourdomain.com
```

#### 4. Deploy with Docker

```bash
# Create production environment file
cp .env.prod .env

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed database (optional)
docker-compose -f docker-compose.prod.yml exec backend npm run seed

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**

1. Connect GitHub repository to Vercel
2. Set build command: `cd apps/frontend && npm run build`
3. Set output directory: `apps/frontend/dist`
4. Set environment variables:

   ```env
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

**Backend on Railway:**

1. Connect GitHub repository to Railway
2. Set root directory: `apps/backend`
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add PostgreSQL database service
6. Set environment variables:

   ```env
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-jwt-secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

#### Heroku Deployment

**Prepare for Heroku:**

Create `Procfile`:

```bash
web: cd apps/backend && npm start
```

Create `package.json` in root:

```json
{
  "name": "recipe-manager-monorepo",
  "scripts": {
    "build": "npm install && cd apps/backend && npm run build",
    "start": "cd apps/backend && npm start",
    "heroku-postbuild": "npm run build"
  },
  "engines": {
    "node": "20.x"
  }
}
```

**Deploy:**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-recipe-manager-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-domain.com

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy --app your-recipe-manager-api
```

## Database Management

### Backup Strategy

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/recipe-manager"
DB_NAME="recipe_manager"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U recipe_user -h localhost $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Restore from Backup

```bash
# Restore database
gunzip -c /backups/recipe-manager/backup_20250115_120000.sql.gz | psql -U recipe_user -h localhost recipe_manager
```

### Migration Management

```bash
# Production migration deployment
cd apps/backend

# Deploy pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database (DANGEROUS - only for development)
npx prisma migrate reset
```

## Monitoring and Logging

### Health Monitoring

Set up monitoring for:

```bash
# Check application health
curl https://yourdomain.com/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected",
  "version": "1.0.0"
}
```

### Log Management

**PM2 Logs:**

```bash
# View logs
pm2 logs recipe-manager-backend

# Log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

**Docker Logs:**

```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Log rotation with Docker
docker-compose -f docker-compose.prod.yml up -d --log-opt max-size=10m --log-opt max-file=3
```

### Monitoring Alerts

Set up alerts for:

- Application downtime (health check fails)
- High error rates (>5% 5xx responses)
- Database connection issues
- High memory/CPU usage (>80%)
- Disk space low (<10% free)

## Security Configuration

### SSL/TLS Setup

**Certbot with Nginx:**

```bash
# Install certbot
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Security Headers

Ensure these headers are set:

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
```

### Firewall Configuration

```bash
# UFW firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (if external access needed)
sudo ufw enable
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_author_id ON "Recipe"("authorId");
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON "Recipe"("createdAt");
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON "Recipe"("cuisine");
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON "Recipe"("difficulty");
CREATE INDEX IF NOT EXISTS idx_recipes_cook_time ON "Recipe"("cookTime");

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_recipes_search ON "Recipe" USING gin(to_tsvector('english', title || ' ' || description));
```

### Nginx Optimization

```nginx
# Worker processes
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 5M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

## Scaling Considerations

### Horizontal Scaling

**Load Balancer Configuration:**

```nginx
upstream backend {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    location /api/ {
        proxy_pass http://backend;
        # ... other proxy settings
    }
}
```

**PM2 Cluster Mode:**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'recipe-manager-backend',
    script: 'dist/server.js',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    // ... other settings
  }]
};
```

### Database Scaling

**Read Replicas:**

```javascript
// Prisma with read replicas
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Primary (write)
    },
  },
});

const readPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.READ_DATABASE_URL, // Read replica
    },
  },
});
```

### CDN Integration

For static assets and images:

```javascript
// Configure CDN for uploads
const CDN_BASE_URL = process.env.CDN_BASE_URL || '';

function getCdnUrl(path) {
  return CDN_BASE_URL ? `${CDN_BASE_URL}${path}` : path;
}
```

## Troubleshooting

### Common Issues

**1. Database Connection Errors:**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U recipe_user -h localhost -d recipe_manager

# Check connection limits
SELECT count(*) FROM pg_stat_activity;
```

**2. Memory Issues:**

```bash
# Check memory usage
free -h
htop

# Check Node.js memory
pm2 monit
```

**3. SSL Certificate Issues:**

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

**4. Application Errors:**

```bash
# Check application logs
pm2 logs recipe-manager-backend

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Check system logs
sudo journalctl -u nginx -f
```

### Performance Debugging

**1. Database Performance:**

```sql
-- Check slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Check connection pool
SELECT count(*), state
FROM pg_stat_activity
GROUP BY state;
```

**2. Application Performance:**

```bash
# Check PM2 metrics
pm2 monit

# Check system resources
htop
iotop
```

## Maintenance

### Regular Tasks

**Daily:**

- Monitor application health endpoints
- Check error logs for issues
- Verify backup completion

**Weekly:**

- Review application metrics
- Check disk space usage
- Update system packages

**Monthly:**

- Security updates
- Certificate renewal check
- Database maintenance
- Performance review

### Update Procedure

```bash
# 1. Backup database
./backup-db.sh

# 2. Update code
git pull origin main

# 3. Install dependencies
npm install

# 4. Build application
npm run build

# 5. Run migrations
cd apps/backend
npx prisma migrate deploy

# 6. Restart application
pm2 restart ecosystem.config.js

# 7. Verify deployment
curl https://yourdomain.com/health
```

## Support

For deployment issues:

1. **Check Health Endpoint**: `/health` for system status
2. **Review Logs**: Application and system logs for errors
3. **Monitor Resources**: CPU, memory, and disk usage
4. **Database Status**: Connection and query performance
5. **SSL Certificate**: Expiry and configuration

## Related Documentation

- [Development Setup](./development-setup.md) - Local development guide
- [API Documentation](./api-documentation.md) - Complete API reference
- [Favorites & Bookmarks](./favorites-bookmarks.md) - Feature details
