# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source files
COPY client/ ./client/
COPY server/ ./server/

# Build client
RUN cd client && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy server code
COPY server/ ./server/

# Copy built client
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server

# Cloud Run uses PORT env variable
ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]
