#!/bin/bash
# seed.sh — Seeds the database with initial data
# Usage: ./scripts/seed.sh
# Or in Docker: docker compose exec backend sh scripts/seed.sh

set -e  # Exit immediately if any command fails

echo "🌱 Seeding database..."
echo ""

# ── CONNECTION ────────────────────────────────────────────────────────────────
# Read connection details from environment variables
# These are set in docker-compose.yml or .env file
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-devops_website}"
DB_USER="${DB_USER:-devops_user}"

# psql connection string
PSQL="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"

# ── ADMIN ─────────────────────────────────────────────────────────────────────
echo "→ Seeding admin user..."

$PSQL <<SQL
INSERT INTO admin_users (email, password_hash)
VALUES (
    'ionutdanielsandu96@gmail.com',
    '\$2b\$10\$ElvYHVpZukyXxkO2s3kp9eXgHT/uRedFrg3jMBWNmf9KHKuQUqjtG'
)
ON CONFLICT (email) DO NOTHING;
SQL

echo "✓ Admin user seeded"

# ── SERVICES ──────────────────────────────────────────────────────────────────
echo "→ Seeding services..."

$PSQL <<SQL
INSERT INTO services (title, description, icon, price_from, sort_order) VALUES
(
    'GitHub Actions CI/CD Pipeline',
    'I will build a professional CI/CD pipeline with automated testing, Docker build and push to registry.',
    '🚀', 150, 1
),
(
    'Kubernetes Deployment',
    'I will deploy your application to Kubernetes using Helm charts, with readiness probes, resource limits and ingress configuration.',
    '☸️', 200, 2
),
(
    'GitOps with ArgoCD',
    'I will implement a GitOps workflow using ArgoCD with separate environments, auto-sync policies and rollback strategy.',
    '🔄', 250, 3
),
(
    'Helm Chart Development',
    'I will create production-ready Helm charts with values per environment, secrets management and ingress configuration.',
    '⛵', 180, 4
),
(
    'Jenkins Pipeline',
    'I will build declarative Jenkins pipelines with shared libraries, approvals, rollback and multi-environment support.',
    '🔧', 150, 5
),
(
    'OpenShift Support',
    'I will help you migrate, configure and troubleshoot applications on OpenShift 4.x clusters.',
    '🔴', 200, 6
)
ON CONFLICT DO NOTHING;
SQL

echo "✓ Services seeded"

# ── PROJECTS ──────────────────────────────────────────────────────────────────
echo "→ Seeding projects..."

$PSQL <<SQL
INSERT INTO projects (title, description, tech_stack, github_url, is_featured, sort_order) VALUES
(
    'DevOps Portfolio Website',
    'Personal freelancing website built with React, Node.js and PostgreSQL. Deployed with Docker and Helm.',
    'React, Node.js, PostgreSQL, Docker, Helm, GitHub Actions',
    'https://github.com/ionutsandu1996/devops-platform',
    true, 1
),
(
    'Medical Clinic App',
    'Full-stack clinic management system with JWT auth, RBAC, Docker, Helm and GitHub Actions CI/CD.',
    'Node.js, React, PostgreSQL, Docker, Helm, GitHub Actions',
    'https://github.com/ionutsandu1996/Medical-clinic-app',
    true, 2
)
ON CONFLICT DO NOTHING;
SQL

echo "✓ Projects seeded"

echo ""
echo "✅ Database seeded successfully!"