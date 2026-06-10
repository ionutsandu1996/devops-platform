// pool.js — PostgreSQL connection pool
// This file is imported by every route that needs database access

// Import the Pool class from the official PostgreSQL driver for Node.js
const { Pool } = require('pg');

// Load .env file only in development
// In Docker, environment variables are injected by docker-compose.yml
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Create the connection pool instance
// A pool maintains multiple open connections to the database
// instead of opening and closing a new connection on every query
const pool = new Pool({
    host:     process.env.DB_HOST,      // e.g. localhost
    port:     process.env.DB_PORT,      // e.g. 5432
    database: process.env.DB_NAME,      // e.g. devops_website
    user:     process.env.DB_USER,      // e.g. devops_user
    password: process.env.DB_PASSWORD,  // e.g. changeit

    // Maximum number of simultaneous connections in the pool
    // 10 is the default and sufficient for a small application
    max: 10,

    // If a connection sits idle for more than 30 seconds
    // the pool closes it automatically to free up resources
    idleTimeoutMillis: 30000,

    // If a new connection cannot be established within 2 seconds
    // throw an error instead of waiting indefinitely
    connectionTimeoutMillis: 2000,
});

// Event: fires every time the pool opens a new connection to the DB
// Useful for debugging — confirms the pool is working
pool.on('connect', () => {
    console.log('✓ New PostgreSQL connection established');
});

// Event: fires when an unexpected error occurs on an idle connection
// Without this handler, the error would crash the entire Node.js server
pool.on('error', (err) => {
    console.error('✗ Unexpected error on idle PostgreSQL connection:', err.message);
    process.exit(-1); // shut down — we cannot operate without the database
});

// Export the pool so it can be imported in any other file with:
// const pool = require('../db/pool');
module.exports = pool;