FROM node:24-alpine
WORKDIR /app

# Install tini for proper signal forwarding (SIGTERM → Node)
RUN apk add --no-cache tini

# Copy dependency manifests first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Compile TypeScript to JavaScript for production
RUN npm run build

# Ensure the data directory exists for SQLite persistence
RUN mkdir -p /app/data

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
