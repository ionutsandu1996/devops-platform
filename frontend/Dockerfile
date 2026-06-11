# ── STAGE 1: builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Accept API URL as build argument
# In Docker Compose: /api (proxied by Nginx)
# In Kubernetes: /api (proxied by Nginx → backend service)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm run build

# ── STAGE 2: serve ────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Accept backend hostname as build argument
# Docker Compose: backend
# Kubernetes: devops-platform-backend
ARG BACKEND_HOST=backend
ENV BACKEND_HOST=$BACKEND_HOST

# Copy nginx config template
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Replace BACKEND_HOST placeholder with actual value at build time
RUN sed -i "s/BACKEND_HOST/${BACKEND_HOST}/g" /etc/nginx/conf.d/default.conf

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80