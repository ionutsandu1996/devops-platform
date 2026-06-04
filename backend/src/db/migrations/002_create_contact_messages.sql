-- Migrare 002: Crearea tabelei pentru mesaje de contact

CREATE TABLE IF NOT EXISTS contact_messages (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);