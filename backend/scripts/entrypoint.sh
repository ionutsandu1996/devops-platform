#!/bin/sh
# entrypoint.sh — Runs on every container start
# 1. Runs database migrations
# 2. Seeds initial data
# 3. Starts the Node.js server

set -e

echo "🚀 Starting DevOps Website Backend..."
echo ""

# ── MIGRATIONS ────────────────────────────────────────────────────────────────
echo "→ Running database migrations..."
node src/db/migrate.js

# ── SEED ──────────────────────────────────────────────────────────────────────
echo "→ Seeding initial data..."
node src/db/seed.js

# ── START SERVER ──────────────────────────────────────────────────────────────
echo "→ Starting server..."
exec node src/index.js