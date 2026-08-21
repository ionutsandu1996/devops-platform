// migrate.js — rulează toate fișierele SQL din migrations/ în ordine
// Folosire: node src/db/migrate.js

const { Pool } = require('pg');         // driverul PostgreSQL
const fs = require('fs');               // citirea fișierelor de pe disc
const path = require('path');           // construirea path-urilor
require('dotenv').config();             // citirea variabilelor din .env

// Cream conexiunea la baza de date
const pool = new Pool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Functia principala — async ca sa putem folosi await
async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename   VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `);

    // Folderul unde stau fisierele SQL
    const migrationsDir = path.join(__dirname, 'migrations');

    // Citim toate fisierele din folder si le sortam dupa nume
    // sort() garanteaza ordinea: 001, 002, 003...
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    console.log(`Found ${files.length} migration files......\n`);

    // Parcurgem fiecare fisier SQL
    for (const file of files) {
        const alreadyApplied = await pool.query(
            'SELECT 1 FROM schema_migrations WHERE filename = $1',
            [file]
        );

        if (alreadyApplied.rowCount > 0) {
            console.log(`Skipping: ${file} — already applied\n`);
            continue;
        }

        const filePath = path.join(migrationsDir, file);

        // Citim continutul fisierului SQL ca string
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
            console.log(`Running: ${file}`);

            // Migration and history record are committed atomically.
            await pool.query('BEGIN');
            await pool.query(sql);
            await pool.query(
                'INSERT INTO schema_migrations (filename) VALUES ($1)',
                [file]
            );
            await pool.query('COMMIT');

            console.log(`✓ ${file} — OK\n`);
        } catch (err) {
            await pool.query('ROLLBACK');
            // Daca un fisier esueaza, oprim tot si afisam eroarea
            console.error(`✗ ${file} — EROARE:`, err.message);
            throw err;
        }
    }

    console.log('✅ All migrations have run successfully. Database is up to date!');

    // Inchidem conexiunea la DB
    await pool.end();
}

// Apelam functia
migrate().catch(async (err) => {
    console.error('Migration failed:', err.message);
    await pool.end();
    process.exit(1);
});
