# Production Deployment Guide

## Overview

This guide covers deploying the Recipe Manager application to production environments with comprehensive security, monitoring, and performance optimizations.

## Production Architecture

### Components

- **Frontend**: React SPA with nginx, service worker, and optimized bundles
- **Backend**: Node.js API with security middleware, caching, and monitoring
- **Database**: PostgreSQL with connection pooling and optimized queries
- **Reverse Proxy**: nginx with SSL termination and rate limiting
- **Caching**: Redis for session storage and API response caching
- **Monitoring**: Health checks, metrics collection, and alerting
- **Security**: CSP, HSTS, rate limiting, IP whitelisting, and request sanitization

### Docker Production Setup

The application includes a complete production Docker setup with:

- Multi-stage builds for optimized image sizes
- Security hardening with non-root users
- Health checks for all services
- Persistent volumes for data and uploads
- SSL certificate management with Let's Encrypt
- nginx reverse proxy with performance optimizations

## Prerequisites

- Docker and Docker Compose
- Domain name and DNS configuration
- SSL certificates (Let's Encrypt recommended)
- PostgreSQL database (managed service recommended)
- Redis instance (optional, for caching)
- Monitoring service (optional, for alerting)

## Environment Configuration

### Backend Environment Variables

Create `apps/backend/.env.production`:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=20&pool_timeout=20

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-at-least-32-characters-long

# Application Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_UPLOAD_MAX=10
ADMIN_WHITELIST_IPS=127.0.0.1,::1

# File Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_DIR=/app/uploads

# Caching Configuration
CACHE_TTL_SECONDS=3600
REDIS_URL=redis://redis:6379

# Monitoring Configuration
ENABLE_MONITORING=true
METRICS_ENDPOINT_ENABLED=true
HEALTH_CHECK_INTERVAL=30000

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/app/logs/app.log
```

### Frontend Environment Variables

Create `apps/frontend/.env.production`:

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com

# Application Configuration
VITE_APP_NAME=Recipe Manager
VITE_APP_VERSION=1.0.0

# Upload Configuration
VITE_MAX_UPLOAD_SIZE=5242880

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SENTRY=true

# External Services
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
```

## Docker Production Deployment

### 1. Build Production Images

```bash
# Build all production images
docker-compose -f docker-compose.prod.yml build

# Or build individually
docker build -f apps/frontend/Dockerfile.prod -t recipe-manager-frontend .
docker build -f apps/backend/Dockerfile.prod -t recipe-manager-backend .
```

### 2. Start Production Services

```bash
# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. SSL Certificate Setup

```bash
# Generate SSL certificates with Let's Encrypt
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d yourdomain.com -d www.yourdomain.com

# Reload nginx to use certificates
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

### 4. Database Migration

```bash
# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec backend npm run db:seed
```

## Manual Deployment (VPS/Dedicated Server)

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install nginx
sudo apt-get install -y nginx

# Install PM2 for process management
sudo npm install -g pm2

# Install certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx
```

### 2. Database Setup

```bash
# Create database user and database
sudo -u postgres psql
CREATE USER recipe_user WITH PASSWORD 'secure_password';
CREATE DATABASE recipe_manager OWNER recipe_user;
GRANT ALL PRIVILEGES ON DATABASE recipe_manager TO recipe_user;
\q

# Configure PostgreSQL for production
sudo nano /etc/postgresql/14/main/postgresql.conf
# Set max_connections, shared_buffers, etc.

# Configure pg_hba.conf for authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/recipe-manager.git
cd recipe-manager

# Install dependencies
npm install
cd apps/frontend && npm install
cd ../backend && npm install

# Build frontend
cd apps/frontend
npm run build

# Build backend
cd ../backend
npm run build

# Set up environment variables
cp .env.example .env.production
nano .env.production

# Run database migrations
npx prisma migrate deploy

# Start application with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. nginx Configuration

Create `/etc/nginx/sites-available/recipe-manager`:

```nginx
# Frontend server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.yourdomain.com;" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Frontend static files
    location / {
        root /var/www/recipe-manager/apps/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        limit_req_status 429;
    }
    
    # Health checks
    location /health {
        proxy_pass http://localhost:3001;
        access_log off;
    }
    
    # Upload files
    location /uploads {
        proxy_pass http://localhost:3001;
        client_max_body_size 5M;
        
        # Cache uploaded images
        location ~* \.(jpg|jpeg|png|gif|webp)$ {
            proxy_pass http://localhost:3001;
            expires 7d;
            add_header Cache-Control "public";
        }
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/recipe-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup

```bash
# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Cloud Platform Deployment

### Vercel (Frontend)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd apps/frontend
   vercel --prod
   ```

3. **Configure environment variables in Vercel dashboard**

### Railway (Backend)

1. **Connect GitHub repository**
2. **Set environment variables**
3. **Deploy automatically on push**

### Heroku (Backend)

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app:**
   ```bash
   heroku create recipe-manager-api
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set DATABASE_URL=postgresql://...
   heroku config:set JWT_SECRET=...
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### AWS (Full Stack)

1. **Frontend**: Deploy to S3 + CloudFront
2. **Backend**: Deploy to Elastic Beanstalk or ECS
3. **Database**: Use RDS PostgreSQL
4. **Redis**: Use ElastiCache
5. **CDN**: CloudFront for static assets

## Database Deployment

### Managed Database Services

**Recommended providers:**
- **Neon**: PostgreSQL with generous free tier
- **Supabase**: Full-stack PostgreSQL platform
- **AWS RDS**: Managed PostgreSQL with high availability
- **Google Cloud SQL**: Managed PostgreSQL
- **Azure Database**: PostgreSQL service

### Database Configuration

```sql
-- Create optimized database
CREATE DATABASE recipe_manager
  WITH ENCODING = 'UTF8'
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       TEMPLATE = template0;

-- Configure connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

### Database Migration

```bash
# Production migration
npx prisma migrate deploy

# Reset database (if needed)
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate
```

## Security Configuration

### SSL/TLS Setup

1. **Use HTTP/2 and TLS 1.3**
2. **Configure strong cipher suites**
3. **Enable HSTS**
4. **Use certificate pinning**

### Security Headers

```nginx
# Security headers configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.yourdomain.com;" always;
```

### Rate Limiting

```bash
# nginx rate limiting
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/m;
}
```

### Firewall Configuration

```bash
# UFW firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Monitoring and Logging

### Health Checks

The application includes comprehensive health endpoints:

- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`
- **Readiness Probe**: `GET /health/ready`
- **Liveness Probe**: `GET /health/live`
- **Metrics**: `GET /health/metrics`

### Monitoring Setup

1. **Application Metrics**:
   - CPU and memory usage
   - Request latency and throughput
   - Database performance
   - Cache hit rates

2. **Infrastructure Monitoring**:
   - Server resources
   - Network performance
   - Disk usage
   - Load balancer health

3. **Alerting**:
   - High error rates
   - Performance degradation
   - Database connection issues
   - Security incidents

### Logging Configuration

```javascript
// Winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Log Management

1. **Centralized Logging**: Use ELK stack or similar
2. **Log Rotation**: Configure logrotate
3. **Log Analysis**: Set up dashboards and alerts
4. **Error Tracking**: Use Sentry or similar service

## Performance Optimization

### Database Optimization

1. **Connection Pooling**: Use PgBouncer or built-in pooling
2. **Query Optimization**: Analyze slow queries
3. **Indexing**: Add indexes for frequently queried columns
4. **Caching**: Implement Redis caching

### Frontend Optimization

1. **Bundle Optimization**: Code splitting and tree shaking
2. **Image Optimization**: WebP format and lazy loading
3. **Service Worker**: Offline support and caching
4. **CDN**: Use CloudFront or similar

### Backend Optimization

1. **API Caching**: Cache GET responses
2. **Database Queries**: Use prepared statements
3. **Memory Management**: Monitor and optimize memory usage
4. **Process Management**: Use PM2 for clustering

## Backup and Recovery

### Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_NAME="recipe_manager"

# Create backup
pg_dump -h localhost -U recipe_user -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Remove old backups (keep 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

### File Backup

```bash
# Backup uploads directory
rsync -av /app/uploads/ /backups/uploads/
```

### Disaster Recovery

1. **Database Restore**: Test restore procedures regularly
2. **Application Deployment**: Automate deployment process
3. **DNS Failover**: Configure DNS failover
4. **Load Balancing**: Use multiple servers

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancing**: Use nginx or AWS ALB
2. **Database Scaling**: Read replicas and sharding
3. **Caching Layer**: Redis cluster
4. **CDN**: Global content delivery

### Vertical Scaling

1. **Server Resources**: Increase CPU and memory
2. **Database Optimization**: Tune PostgreSQL settings
3. **Application Optimization**: Profile and optimize code

## Troubleshooting

### Common Issues

1. **Database Connection**: Check connection string and pool settings
2. **Memory Leaks**: Monitor memory usage and restart services
3. **SSL Issues**: Verify certificate configuration
4. **Rate Limiting**: Check nginx and application rate limits

### Debugging Tools

1. **Application Logs**: Check Winston logs
2. **nginx Logs**: Review access and error logs
3. **Database Logs**: Check PostgreSQL logs
4. **System Monitoring**: Use htop, iotop, netstat

### Performance Issues

1. **Database**: Use EXPLAIN ANALYZE for slow queries
2. **API**: Check response times in metrics
3. **Frontend**: Use browser dev tools
4. **Network**: Monitor network latency

## Maintenance

### Regular Tasks

1. **Security Updates**: Apply OS and package updates
2. **Database Maintenance**: Vacuum and analyze
3. **Log Rotation**: Clean up old logs
4. **Certificate Renewal**: Renew SSL certificates
5. **Backup Verification**: Test backup restore

### Monitoring Checklist

- [ ] Health endpoints responding
- [ ] SSL certificates valid
- [ ] Database connections healthy
- [ ] API response times acceptable
- [ ] Error rates within limits
- [ ] Disk space available
- [ ] Memory usage normal
- [ ] Security logs reviewed

## Support

For technical support and questions:

1. **Documentation**: Check API documentation
2. **Logs**: Review application and server logs
3. **Metrics**: Check health endpoints
4. **Community**: GitHub issues and discussions
