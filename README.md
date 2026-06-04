# 🚀 DevOps Portfolio Website

A professional freelancing website for DevOps services — built with **React 18 + Vite**, **Node.js + Express**, and **PostgreSQL 15**.

Includes a public-facing portfolio site and a password-protected admin panel for managing projects, services, and contact messages.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Admin Panel](#admin-panel)
- [Docker & Local Development](#docker--local-development)
- [CI/CD Pipeline](#cicd-pipeline)
- [Helm Deployment](#helm-deployment)
- [Roadmap](#roadmap)

---

## Overview

This website serves as a professional portfolio and lead-generation tool for freelance DevOps consulting services. Visitors can browse services and projects, and submit contact inquiries. The admin panel allows the owner to manage content and respond to messages — all without touching the database directly.

**Public pages:**
- Home — hero section, call to action
- Services — DevOps service offerings with pricing
- Projects — portfolio projects with GitHub links
- About — professional background
- Contact — inquiry form (saved to DB)

**Admin panel (JWT-protected):**
- View and mark contact messages as read
- Add / edit / delete projects
- Add / edit / delete services

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM, Axios |
| Backend | Node.js, Express, pg (node-postgres) |
| Database | PostgreSQL 15 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Email | Nodemailer + Gmail App Password |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes + Helm |
| CI/CD | GitHub Actions |

---

## Project Structure

```
devops-website/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Services.jsx
│       │   ├── Projects.jsx
│       │   ├── About.jsx
│       │   └── Contact.jsx
│       ├── admin/
│       │   ├── AdminLogin.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminMessages.jsx
│       │   └── AdminProjects.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ServiceCard.jsx
│       │   └── ProjectCard.jsx
│       ├── api/
│       │   └── index.js
│       ├── App.jsx
│       └── main.jsx
├── backend/
│   └── src/
│       ├── db/
│       │   └── pool.js
│       ├── routes/
│       │   ├── contact.js
│       │   ├── projects.js
│       │   ├── services.js
│       │   └── admin.js
│       ├── middleware/
│       │   └── auth.js
│       └── index.js
├── helm/
│   └── devops-website/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
├── .github/
│   └── workflows/
│       ├── build-backend.yml
│       └── build-frontend.yml
├── docker-compose.yml
└── .env.example
```

---

## Database Schema

### `admin_users`
Stores admin credentials. Only one record expected in production.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | Auto-increment |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | bcryptjs hash, NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `contact_messages`
Stores all inquiries submitted through the contact form.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | Auto-increment |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| subject | VARCHAR(200) | Optional |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| ip_address | INET | For spam detection |
| created_at | TIMESTAMP | DEFAULT NOW() |

### `projects`
Portfolio projects displayed on the Projects page.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | Auto-increment |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| tech_stack | VARCHAR(500) | Comma-separated tags |
| github_url | VARCHAR(500) | Optional |
| demo_url | VARCHAR(500) | Optional |
| image_url | VARCHAR(500) | Optional |
| is_featured | BOOLEAN | DEFAULT FALSE |
| sort_order | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### `services`
DevOps services displayed on the Services page.

| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | Auto-increment |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| icon | VARCHAR(100) | Emoji or icon name |
| price_from | INTEGER | Price in EUR |
| is_active | BOOLEAN | DEFAULT TRUE |
| sort_order | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Git

### Local development (with Docker)

```bash
# 1. Clone the repository
git clone https://github.com/ionutsandu1996/devops-website.git
cd devops-website

# 2. Copy environment file
cp .env.example .env
# Edit .env with your values

# 3. Start all services
docker compose up --build

# Frontend:  http://localhost:5173
# Backend:   http://localhost:4000
# Postgres:  localhost:5432
```

### Local development (without Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```bash
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=devops_website
DB_USER=devops_user
DB_PASSWORD=changeit

# Backend
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES_IN=24h

# Email notifications (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-gmail-app-password

# Frontend
VITE_API_URL=http://localhost:4000/api
```

> **Security note:** Never commit `.env` to Git. It is already listed in `.gitignore`.
>
> Generate a strong JWT secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get single project |
| GET | `/api/services` | List all active services |
| POST | `/api/contact` | Submit contact form |

### Admin (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Login, returns JWT token |
| GET | `/api/admin/messages` | List all contact messages |
| PUT | `/api/admin/messages/:id/read` | Mark message as read |
| POST | `/api/admin/projects` | Create project |
| PUT | `/api/admin/projects/:id` | Update project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| POST | `/api/admin/services` | Create service |
| PUT | `/api/admin/services/:id` | Update service |
| DELETE | `/api/admin/services/:id` | Delete service |

### Health check

```
GET /health → { status: "ok", timestamp: "..." }
```

---

## Admin Panel

Access the admin panel at `/admin`.

Default credentials are seeded on first run (see `backend/src/db/seed.js`).

> Change the admin password immediately after first login in production.

---

## Docker & Local Development

```bash
# Start all services
docker compose up --build

# Stop all services
docker compose down

# Stop and remove volumes (wipes the database)
docker compose down -v

# View backend logs
docker compose logs -f backend

# Connect to the database
docker exec -it devops-website-db psql -U devops_user -d devops_website
```

---

## CI/CD Pipeline

GitHub Actions workflows are located in `.github/workflows/`.

### `build-backend.yml`
Triggered on push to `main` when files under `backend/` change.

Steps:
1. Checkout code
2. Build multi-platform Docker image (`linux/amd64`, `linux/arm64`)
3. Push to GitHub Container Registry (GHCR)
4. Bump `BACKEND_VERSION` GitHub Variable via API

### `build-frontend.yml`
Same flow for the frontend service.

**Required GitHub Secrets/Variables:**

| Name | Type | Description |
|---|---|---|
| `GHCR_TOKEN` | Secret | PAT with `write:packages` scope |
| `BACKEND_VERSION` | Variable | Semantic version, e.g. `1.0.0` |
| `FRONTEND_VERSION` | Variable | Semantic version, e.g. `1.0.0` |

---

## Helm Deployment

```bash
# Add Bitnami repo (for PostgreSQL dependency)
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Install to Kubernetes
helm upgrade --install devops-website ./helm/devops-website \
  --namespace devops-website \
  --create-namespace \
  --values helm/devops-website/values.yaml \
  --set image.tag=$IMAGE_TAG

# Check pod status
kubectl get pods -n devops-website

# View logs
kubectl logs -n devops-website deployment/backend

# Rollback if something goes wrong
helm rollback devops-website 1 -n devops-website
```

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| Phase 1 | ✅ Done | Architecture design & SQL schema |
| Phase 2 | 🔄 In progress | Backend Node.js + Express |
| Phase 3 | ⏳ Pending | Frontend React |
| Phase 4 | ⏳ Pending | Technical documentation |
| Phase 5 | ⏳ Pending | Docker + CI/CD |
| Phase 6 | ⏳ Pending | Helm + Kubernetes |

---

## Author

**Ionut Sandu** — DevOps Engineer @ Deutsche Bank

- GitHub: [@ionutsandu1996](https://github.com/ionutsandu1996)
- LinkedIn: [ionut-sandu](https://linkedin.com/in/ionut-sandu)

---

> Built as part of a freelance DevOps portfolio. Every component is containerized, versioned, and deployable via Helm.
