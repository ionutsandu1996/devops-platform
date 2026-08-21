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

# Default backend hostname, used only if BACKEND_HOST isn't set at
# container runtime (e.g. plain `docker run` or Docker Compose, where
# it matches the compose service name "backend").
# In Kubernetes the Helm chart sets BACKEND_HOST on the container at
# deploy time (deployment-frontend.yaml), overriding this default —
# so the same image works for any Helm release name.
ENV BACKEND_HOST=backend

# Copy nginx config as a template — substituted from BACKEND_HOST by the
# official nginx entrypoint (envsubst) at container startup, not at build time
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built React app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80