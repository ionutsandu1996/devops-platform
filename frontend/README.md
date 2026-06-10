# 🚀 DevOps Portfolio Website

> A professional freelancing website for DevOps consulting services — built with **React 18 + Vite**, **Node.js + Express**, and **PostgreSQL 15**.

[![Build Backend](https://img.shields.io/github/actions/workflow/status/ionutsandu1996/devops-platform/build-backend.yml?label=backend&logo=github)](https://github.com/ionutsandu1996/devops-platform/actions)
[![Build Frontend](https://img.shields.io/github/actions/workflow/status/ionutsandu1996/devops-platform/build-frontend.yml?label=frontend&logo=github)](https://github.com/ionutsandu1996/devops-platform/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Admin Panel](#admin-panel)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Docker](#docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

---

## Overview

This is a full-stack portfolio and lead-generation platform for a freelance DevOps Engineer. Visitors can browse services, explore projects, and send contact inquiries. The platform includes a password-protected admin panel for managing all content without touching the database directly.

**Built for:**
- Showcasing DevOps expertise to potential clients
- Generating leads through a contact form with email notifications
- Managing portfolio content (projects, services) without code changes

---

## Live Demo

> 🌐 Coming soon — deployment in progress on Google Cloud / Hetzner

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | UI framework with fast HMR |
| **Routing** | React Router DOM v6 | Client-side SPA navigation |
| **HTTP Client** | Axios | API calls with interceptors |
| **Backend** | Node.js + Express 4 | REST API server |
| **Database** | PostgreSQL 15 | Persistent data storage |
| **DB Driver** | node-postgres (pg) | PostgreSQL connection pool |
| **Auth** | JWT + bcryptjs | Stateless admin authentication |
| **Email** | Resend API | Transactional email notifications |
| **Web Server** | Nginx (Alpine) | Static file serving + API proxy |
| **Containers** | Docker + Docker Compose | Local and production deployment |
| **CI/CD** | GitHub Actions | Automated build and push to GHCR |
| **Registry** | GitHub Container Registry | Docker image storage |

---

## Features

### Public Website
- ✅ Hero section with availability status and tech stack badges
- ✅ Services section with pricing (fetched from DB — editable from admin)
- ✅ Projects portfolio with GitHub links (fetched from DB — editable from admin)
- ✅ About page with experience and skills
- ✅ Contact form with validation and success/error states
- ✅ Fully responsive design (mobile + desktop)

### Contact Form
- ✅ Saves all submissions to PostgreSQL
- ✅ Sends instant email notification via Resend API
- ✅ IP address logging for spam detection
- ✅ Input validation (required fields, email format)

### Admin Panel (JWT protected)
- ✅ Secure login with bcrypt password hashing
- ✅ Auto-redirect to login on expired token (401 interceptor)
- ✅ Dashboard with live statistics (messages, projects, services)
- ✅ View all contact messages with unread badge
- ✅ Mark messages as read
- ✅ One-click reply via mailto link
- ✅ Full CRUD for projects (add, edit, delete, feature)
- ✅ Full CRUD for services (add, edit, toggle active/inactive)

### DevOps & Infrastructure
- ✅ Multi-stage Dockerfiles (builder + production) for both services
- ✅ Non-root user in containers (security best practice)
- ✅ Health check endpoint (`/health`) for container orchestration
- ✅ Docker Compose for local development (postgres + backend + frontend)
- ✅ Automatic database migrations on container start
- ✅ Automatic database seeding on container start
- ✅ GitHub Actions CI/CD with auto-incrementing semantic versioning
- ✅ Multi-platform Docker builds (linux/amd64 + linux/arm64)
- ✅ Build layer caching for faster CI runs

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────┐
│                  Nginx (port 80)                     │
│  - Serves React SPA (static files)                  │
│  - Proxies /api/* → backend:4000                    │
│  - SPA fallback: all routes → index.html            │
└──────────────────────┬──────────────────────────────┘
                       │ proxy_pass
┌──────────────────────▼──────────────────────────────┐
│              Node.js + Express (port 4000)           │
│  - REST API                                         │
│  - JWT authentication middleware                    │
│  - Email notifications via Resend                   │
└──────────────────────┬──────────────────────────────┘
                       │ pg pool
┌──────────────────────▼──────────────────────────────┐
│                 PostgreSQL 15                        │
│  - admin_users                                      │
│  - contact_messages                                 │
│  - projects                                         │
│  - services                                         │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
devops-platform/
├── backend/
│   ├── scripts/
│   │   └── entrypoint.sh        ← Docker: migrate + seed + start
│   └── src/
│       ├── db/
│       │   ├── pool.js           ← PostgreSQL connection pool
│       │   ├── migrate.js        ← Runs SQL migration files in order
│       │   ├── seed.js           ← Seeds initial data (admin, services, projects)
│       │   └── migrations/
│       │       ├── 001_create_admin_users.sql
│       │       ├── 002_create_contact_messages.sql
│       │       ├── 003_create_projects.sql
│       │       ├── 004_create_services.sql
│       │       └── 005_seed_admin.sql
│       ├── middleware/
│       │   └── auth.js           ← JWT verification middleware
│       ├── routes/
│       │   ├── contact.js        ← POST /api/contact
│       │   ├── projects.js       ← CRUD /api/projects
│       │   ├── services.js       ← CRUD /api/services
│       │   └── admin.js          ← Auth + protected routes
│       ├── services/
│       │   └── email.js          ← Resend email notifications
│       └── index.js              ← Express server entry point
├── frontend/
│   └── src/
│       ├── api/
│       │   └── index.js          ← Centralized Axios calls + interceptors
│       ├── admin/
│       │   ├── AdminLogin.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── AdminMessages.jsx
│       │   ├── AdminProjects.jsx
│       │   └── AdminServices.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── Footer.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Services.jsx
│       │   ├── Projects.jsx
│       │   ├── About.jsx
│       │   └── Contact.jsx
│       └── App.jsx               ← BrowserRouter + Routes + ProtectedRoute
├── .github/
│   └── workflows/
│       ├── build-backend.yml     ← CI/CD backend
│       └── build-frontend.yml    ← CI/CD frontend
├── docker-compose.yml
└── .env.example
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, services preview, projects preview, CTA |
| `/services` | All active DevOps services with pricing |
| `/projects` | Portfolio projects with tech stack and GitHub links |
| `/about` | Bio, skills by category, work experience |
| `/contact` | Contact form with success/error handling |
| `/admin/login` | Admin login page |
| `/admin` | Dashboard with stats and quick links |
| `/admin/messages` | View and manage contact form submissions |
| `/admin/projects` | Add, edit, delete portfolio projects |
| `/admin/services` | Add, edit, toggle active/inactive services |

---

## Admin Panel

Access the admin panel at `/admin/login`.

Default credentials are seeded automatically on first run:

| Field | Value |
|---|---|
| Email | `ionutdanielsandu96@gmail.com` |
| Password | `admin123` |

> ⚠️ Change the password immediately after first login in production.

**Security features:**
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with 24h expiry
- Auto-redirect to login on expired token
- Protected routes via `ProtectedRoute` wrapper component

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get single project |
| `GET` | `/api/services` | List all active services |
| `POST` | `/api/contact` | Submit contact form |

### Admin (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/login` | Login, returns JWT token |
| `GET` | `/api/admin/messages` | List all contact messages |
| `PUT` | `/api/admin/messages/:id/read` | Mark message as read |
| `GET` | `/api/admin/services` | List all services (including inactive) |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/services` | Create service |
| `PUT` | `/api/services/:id` | Update service |
| `DELETE` | `/api/services/:id` | Delete service |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- Git

### Local Development (without Docker)

```bash
# 1. Clone the repository
git clone https://github.com/ionutsandu1996/devops-platform.git
cd devops-platform

# 2. Start PostgreSQL
docker run --name devops-postgres \
  -e POSTGRES_DB=devops_website \
  -e POSTGRES_USER=devops_user \
  -e POSTGRES_PASSWORD=changeit \
  -p 5432:5432 -d postgres:15-alpine

# 3. Setup backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run migrate        # create tables
npm run seed           # insert initial data

# 4. Setup frontend
cd ../frontend
cp .env.example .env
npm install

# 5. Start both services from root
cd ..
npm install
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |
| Admin Panel | http://localhost:5173/admin |

---

## Docker

### Run with Docker Compose

```bash
# Copy and fill in environment variables
cp .env.example .env

# Start all services (postgres + backend + frontend)
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f backend

# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (wipes database)
docker compose down -v
```

| Service | URL |
|---|---|
| Frontend (via Nginx) | http://localhost |
| Backend API | http://localhost:4000 |
| Admin Panel | http://localhost/admin |

### What happens on startup

```
1. PostgreSQL starts and passes healthcheck
2. Backend container starts
3. entrypoint.sh runs:
   a. node src/db/migrate.js  → creates all tables
   b. node src/db/seed.js     → inserts admin, services, projects
   c. node src/index.js       → starts Express server
4. Frontend Nginx starts and proxies /api/* to backend
```

---

## CI/CD Pipeline

GitHub Actions workflows are in `.github/workflows/`.

### How it works

```
Push to main (backend/** changed)
         ↓
build-backend.yml triggers
         ↓
1. Read BACKEND_VERSION from GitHub Variables
2. Increment patch version (1.0.0 → 1.0.1)
3. Update BACKEND_VERSION via GitHub API
4. Login to GHCR
5. Build multi-platform image (amd64 + arm64)
6. Push to ghcr.io/ionutsandu1996/devops-platform-backend:1.0.1
7. Print build summary in GitHub Actions UI
```

### Images

```
ghcr.io/ionutsandu1996/devops-platform-backend:latest
ghcr.io/ionutsandu1996/devops-platform-backend:1.0.x

ghcr.io/ionutsandu1996/devops-platform-frontend:latest
ghcr.io/ionutsandu1996/devops-platform-frontend:1.0.x
```

### Required GitHub Secrets / Variables

| Name | Type | Description |
|---|---|---|
| `GHCR_TOKEN` | Secret | PAT with `write:packages` scope |
| `BACKEND_VERSION` | Variable | Current backend version (e.g. `1.0.0`) |
| `FRONTEND_VERSION` | Variable | Current frontend version (e.g. `1.0.0`) |

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

# JWT — generate with:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=replace-with-long-random-string
JWT_EXPIRES_IN=24h

# Resend (transactional email)
# Get your API key at resend.com — free tier: 3,000 emails/month
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM=onboarding@resend.dev
ADMIN_EMAIL=your@email.com

# Frontend
VITE_API_URL=http://localhost:4000/api
```

> **Security:** Never commit `.env` to Git. It is already in `.gitignore`.

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| Backend API | ✅ Done | Node.js + Express + PostgreSQL |
| Frontend | ✅ Done | React 18 + Vite + CSS Modules |
| Admin Panel | ✅ Done | JWT auth + full CRUD |
| Email Notifications | ✅ Done | Resend API integration |
| Docker + Compose | ✅ Done | Multi-stage builds + auto-seed |
| GitHub Actions CI/CD | ✅ Done | Auto-versioning + GHCR push |
| Helm Chart | 🔄 In progress | Kubernetes deployment |
| Google Cloud Deploy | ⏳ Pending | GKE cluster |
| Custom Domain + TLS | ⏳ Pending | cert-manager + ingress |

---

## Author

**Ionut Sandu** — Senior DevOps Engineer

5+ years of experience at Deutsche Bank working with OpenShift, Kubernetes, Helm, GitHub Actions, Jenkins, and ArgoCD.

Available for freelance DevOps consulting:

- 🐙 GitHub: [@ionutsandu1996](https://github.com/ionutsandu1996)
- 💼 LinkedIn: [ionut-sandu](https://linkedin.com/in/ionut-sandu)
- 📧 Email: ionutdanielsandu96@gmail.com

---

> *Every component is containerized, versioned, and deployable via Helm.*