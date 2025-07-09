FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client

# Build shared package
RUN npm run build --workspace=@recipe-manager/shared

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--workspace=@recipe-manager/client"]

# Production build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/shared/package*.json ./packages/shared/

# Install all dependencies
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/client ./packages/client

# Build shared package
RUN npm run build --workspace=@recipe-manager/shared

# Build client
RUN npm run build --workspace=@recipe-manager/client

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built application
COPY --from=builder /app/packages/client/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/client/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 