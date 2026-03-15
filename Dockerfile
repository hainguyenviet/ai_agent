# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY mcp/package.json ./mcp/

RUN npm ci

COPY . .

RUN npm --prefix backend run prisma:generate \
 && npm --prefix backend run build \
 && npm --prefix frontend run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install dependencies (including devDependencies so Prisma CLI is available for migrations)
COPY package*.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY mcp/package.json ./mcp/
RUN npm ci

# Copy generated Prisma client (produced by prisma generate in builder)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy backend build output and Prisma schema/migrations
COPY --from=builder /app/backend/dist ./backend/dist
COPY backend/prisma ./backend/prisma

# Copy frontend static files
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy only MCP server runtime files
COPY mcp/src/server.js ./mcp/src/server.js

ENV DATABASE_URL=file:/data/app.db
ENV NODE_ENV=production

EXPOSE 4000 5000

# Run database migrations then start the backend.
# Tip: mount a volume at /data to persist the SQLite database across restarts.
WORKDIR /app/backend
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
