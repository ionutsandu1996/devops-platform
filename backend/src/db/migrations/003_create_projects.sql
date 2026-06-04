-- Migrare 003: Crearea tabelei pentru proiecte portfolio

CREATE TABLE IF NOT EXISTS projects (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    tech_stack  VARCHAR(500),
    github_url  VARCHAR(500),
    demo_url    VARCHAR(500),
    image_url   VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);