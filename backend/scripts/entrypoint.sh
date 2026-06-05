#!/bin/sh
# entrypoint.sh — Runs on every container start
# 1. Runs database migrations
# 2. Seeds initial data
# 3. Starts the Node.js server

set -e  # Exit immediately if any command fails

echo "🚀 Starting DevOps Website Backend..."
echo ""

# ── MIGRATIONS ────────────────────────────────────────────────────────────────
echo "→ Running database migrations..."
node src/db/migrate.js

# ── SEED ──────────────────────────────────────────────────────────────────────
echo "→ Seeding initial data..."
sh scripts/seed.sh

# ── START SERVER ──────────────────────────────────────────────────────────────
echo "→ Starting server..."
exec node src/index.js