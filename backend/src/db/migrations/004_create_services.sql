-- Migrare 004: Crearea tabelei pentru servicii DevOps

CREATE TABLE IF NOT EXISTS services (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon        VARCHAR(100),
    price_from  INTEGER,
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);