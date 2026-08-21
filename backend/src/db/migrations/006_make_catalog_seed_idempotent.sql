-- Remove duplicate catalog rows created by the old startup seed, then make
-- future inserts idempotent. The oldest row from every group is preserved.

DELETE FROM services
WHERE id NOT IN (
    SELECT MIN(id)
    FROM services
    GROUP BY title
);

DELETE FROM projects
WHERE id NOT IN (
    SELECT MIN(id)
    FROM projects
    GROUP BY title
);

ALTER TABLE services
    ADD CONSTRAINT services_title_key UNIQUE (title);

ALTER TABLE projects
    ADD CONSTRAINT projects_title_key UNIQUE (title);

ALTER TABLE projects
    ADD CONSTRAINT projects_github_url_key UNIQUE (github_url);

-- Initial catalog data belongs in a versioned migration, so it is provisioned
-- once on a fresh database and never repeated on backend restarts.
INSERT INTO services (title, description, icon, price_from, sort_order)
VALUES
    ('GitHub Actions CI/CD Pipeline', 'I will build a professional CI/CD pipeline with automated testing, Docker build and push to registry.', '🚀', 150, 1),
    ('Kubernetes Deployment', 'I will deploy your application to Kubernetes using Helm charts, with readiness probes, resource limits and ingress configuration.', '☸️', 200, 2),
    ('GitOps with ArgoCD', 'I will implement a GitOps workflow using ArgoCD with separate environments, auto-sync policies and rollback strategy.', '🔄', 250, 3),
    ('Helm Chart Development', 'I will create production-ready Helm charts with values per environment, secrets management and ingress configuration.', '⛵', 180, 4),
    ('Jenkins Pipeline', 'I will build declarative Jenkins pipelines with shared libraries, approvals, rollback and multi-environment support.', '🔧', 150, 5),
    ('OpenShift Support', 'I will help you migrate, configure and troubleshoot applications on OpenShift 4.x clusters.', '🔴', 200, 6)
ON CONFLICT (title) DO NOTHING;

INSERT INTO projects (title, description, tech_stack, github_url, is_featured, sort_order)
VALUES
    ('DevOps Portfolio Website', 'Personal freelancing website built with React, Node.js and PostgreSQL. Deployed with Docker and Helm.', 'React, Node.js, PostgreSQL, Docker, Helm, GitHub Actions', 'https://github.com/ionutsandu1996/devops-platform', TRUE, 1),
    ('Medical Clinic App', 'Full-stack clinic management system with JWT auth, RBAC, Docker, Helm and GitHub Actions CI/CD.', 'Node.js, React, PostgreSQL, Docker, Helm, GitHub Actions', 'https://github.com/ionutsandu1996/Medical-clinic-app', TRUE, 2)
ON CONFLICT (github_url) DO NOTHING;
