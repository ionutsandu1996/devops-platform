// seed.js — Seeds initial data into the database
// Called automatically from entrypoint.sh on container start
// ON CONFLICT DO NOTHING = safe to run multiple times

const pool = require('./pool');

async function seed() {
    console.log('→ Seeding initial data...');

    try {
        // ── ADMIN ─────────────────────────────────────────────
        await pool.query(`
            INSERT INTO admin_users (email, password_hash)
            VALUES ($1, $2)
            ON CONFLICT (email) DO NOTHING
        `, [
            'ionutdanielsandu96@gmail.com',
            '$2b$10$ElvYHVpZukyXxkO2s3kp9eXgHT/uRedFrg3jMBWNmf9KHKuQUqjtG'
        ]);
        console.log('  ✓ Admin user');

        // ── SERVICES ──────────────────────────────────────────
        await pool.query(`
            INSERT INTO services (title, description, icon, price_from, sort_order)
            VALUES
                ($1,  $2,  $3,  $4,  $5),
                ($6,  $7,  $8,  $9,  $10),
                ($11, $12, $13, $14, $15),
                ($16, $17, $18, $19, $20),
                ($21, $22, $23, $24, $25),
                ($26, $27, $28, $29, $30)
            ON CONFLICT DO NOTHING
        `, [
            'GitHub Actions CI/CD Pipeline',
            'I will build a professional CI/CD pipeline with automated testing, Docker build and push to registry.',
            '🚀', 150, 1,

            'Kubernetes Deployment',
            'I will deploy your application to Kubernetes using Helm charts, with readiness probes, resource limits and ingress configuration.',
            '☸️', 200, 2,

            'GitOps with ArgoCD',
            'I will implement a GitOps workflow using ArgoCD with separate environments, auto-sync policies and rollback strategy.',
            '🔄', 250, 3,

            'Helm Chart Development',
            'I will create production-ready Helm charts with values per environment, secrets management and ingress configuration.',
            '⛵', 180, 4,

            'Jenkins Pipeline',
            'I will build declarative Jenkins pipelines with shared libraries, approvals, rollback and multi-environment support.',
            '🔧', 150, 5,

            'OpenShift Support',
            'I will help you migrate, configure and troubleshoot applications on OpenShift 4.x clusters.',
            '🔴', 200, 6,
        ]);
        console.log('  ✓ Services');

        // ── PROJECTS ──────────────────────────────────────────
        await pool.query(`
            INSERT INTO projects (title, description, tech_stack, github_url, is_featured, sort_order)
            VALUES
                ($1, $2, $3, $4, $5, $6),
                ($7, $8, $9, $10, $11, $12)
            ON CONFLICT DO NOTHING
        `, [
            'DevOps Portfolio Website',
            'Personal freelancing website built with React, Node.js and PostgreSQL. Deployed with Docker and Helm.',
            'React, Node.js, PostgreSQL, Docker, Helm, GitHub Actions',
            'https://github.com/ionutsandu1996/devops-platform',
            true, 1,

            'Medical Clinic App',
            'Full-stack clinic management system with JWT auth, RBAC, Docker, Helm and GitHub Actions CI/CD.',
            'Node.js, React, PostgreSQL, Docker, Helm, GitHub Actions',
            'https://github.com/ionutsandu1996/Medical-clinic-app',
            true, 2,
        ]);
        console.log('  ✓ Projects');

        console.log('✅ Seed completed successfully!');

    } catch (err) {
        console.error('✗ Seed error:', err.message);
        throw err;
    }
}

module.exports = seed;

// Run directly if called from command line
// node src/db/seed.js or entrypoint.sh
if (require.main === module) {
    seed()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}