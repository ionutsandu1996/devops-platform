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
        const filePath = path.join(migrationsDir, file);

        // Citim continutul fisierului SQL ca string
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
            console.log(`Running: ${file}`);

            // Executam SQL-ul in baza de date
            await pool.query(sql);

            console.log(`✓ ${file} — OK\n`);
        } catch (err) {
            // Daca un fisier esueaza, oprim tot si afisam eroarea
            console.error(`✗ ${file} — EROARE:`, err.message);
            process.exit(1); // iesim cu cod de eroare
        }
    }

    console.log('✅ All migrations have run successfully. Database is up to date!');

    // Inchidem conexiunea la DB
    await pool.end();
}

// Apelam functia
migrate();