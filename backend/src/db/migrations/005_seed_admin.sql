-- Migration 005: Seed initial admin account
-- Password: admin123 — change this after first login in production

INSERT INTO admin_users (email, password_hash)
VALUES (
    'ionutsandu1996@gmail.com',
    '$2b$10$ElvYHVpZukyXxkO2s3kp9eXgHT/uRedFrg3jMBWNmf9KHKuQUqjtG'
)
ON CONFLICT (email) DO NOTHING;