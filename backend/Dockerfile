# Backend Dockerfile - Multi-stage build
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Development stage
FROM node:18-alpine AS development
WORKDIR /app

# Install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start development server with hot reload
CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install all dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Add non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application and production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --chown=nestjs:nodejs package*.json ./

USER nestjs

EXPOSE 3001

ENV NODE_ENV production

CMD ["node", "dist/main"]
