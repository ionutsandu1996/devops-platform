-- Replace the original tool-centric catalog with outcome-oriented OpsOra
-- services that reflect proven delivery experience.

DELETE FROM services;

INSERT INTO services (title, description, icon, price_from, is_active, sort_order)
VALUES
    ('CI/CD & Release Automation', 'Build and improve delivery pipelines with Jenkins, GitHub Actions and Bitbucket, including artifact publishing, approvals and API-driven deployments.', '🚀', 350, TRUE, 1),
    ('Kubernetes & Helm Deployments', 'Package and deploy applications with reusable Helm charts, environment-specific values, health checks, affinity, ingress and load balancer integration.', '☸️', 500, TRUE, 2),
    ('GitOps with Argo CD', 'Set up Argo CD delivery workflows using app-of-apps patterns, automated synchronization and controlled configuration across environments.', '🔄', 450, TRUE, 3),
    ('OpenShift Migration & Support', 'Support OpenShift modernization and migration work, including application onboarding, deployment configuration and troubleshooting.', '🔴', 600, TRUE, 4),
    ('Secrets, Certificates & Traffic', 'Configure Kubernetes secrets, Google Secret Manager with External Secrets, cert-manager, DNS, TLS certificates, load balancing and GSLB patterns.', '🔐', 350, TRUE, 5),
    ('Infrastructure Automation & Troubleshooting', 'Automate repeatable operational tasks with Ansible and Bash, and troubleshoot Linux, CI/CD, Kubernetes, OpenShift and deployment issues.', '🛠️', 250, TRUE, 6);
