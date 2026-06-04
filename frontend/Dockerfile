# ── STAGE 1: build ────────────────────────────────────────────────────────────
# Node.js image to build the React app
# Vite compiles JSX and CSS into static HTML/JS/CSS files
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build the React app for production
# Output goes to /app/dist folder
RUN npm run build

# ── STAGE 2: serve ────────────────────────────────────────────────────────────
# We don't need Node.js to serve static files
# Nginx is much lighter and faster for this purpose
# Why Nginx? React is a SPA — all routes must return index.html
# Without Nginx config, /projects would return 404 on page refresh
FROM nginx:alpine AS production

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 — standard HTTP port for Nginx
EXPOSE 80

# Nginx starts automatically — no CMD needed
# The base nginx:alpine image already has the correct CMD