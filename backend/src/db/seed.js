// seed.js — Creates only the initial admin account when run explicitly.
// Catalog content is managed from the admin UI and must never be overwritten
// or reinserted by application restarts or deployments.

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

        console.log('✅ Seed completed successfully!');

    } catch (err) {
        console.error('✗ Seed error:', err.message);
        throw err;
    }
}

module.exports = seed;

// Run directly if called from command line
// node src/db/seed.js
if (require.main === module) {
    seed()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
