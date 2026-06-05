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
# We use Node.js directly — no psql needed in the container
echo "→ Seeding initial data..."
node -e "
const seed = require('./src/db/seed');
seed()
    .then(() => process.exit(0))
    .catch((err) => { console.error(err); process.exit(1); });
"

# ── START SERVER ──────────────────────────────────────────────────────────────
echo "→ Starting server..."
exec node src/index.jsd