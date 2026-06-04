// index.js — Entry point of the Express server
// This is the first file that runs when you do: node src/index.js

// Load environment variables from .env FIRST
// Must be before any other import that uses process.env
require('dotenv').config();

// Import the Express framework
const express = require('express');

// Import CORS middleware
// CORS = Cross-Origin Resource Sharing
// Without this, the browser blocks requests from frontend (port 5173)
// to backend (port 4000) because they are on different ports
const cors = require('cors');

// Import the database pool to verify connection on startup
const pool = require('./db/pool');

// Create the Express application instance
const app = express();

// ── MIDDLEWARE ────────────────────────────────────────────────────────────────
// Middleware = functions that run on every request BEFORE it reaches the route
// Order matters — they execute top to bottom

// 1. CORS — allow requests from the frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    // Only allow requests from our frontend
    // In production this will be your actual domain
}));

// 2. JSON parser — allows us to read req.body as a JavaScript object
// Without this, req.body would be undefined on POST/PUT requests
app.use(express.json());

// 3. URL-encoded parser — allows forms to send data as key=value pairs
app.use(express.urlencoded({ extended: true }));

// ── HEALTH CHECK ──────────────────────────────────────────────────────────────
// A simple endpoint that confirms the server is running
// Used by Docker, Kubernetes liveness probes, and load balancers
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// ── ROUTES ────────────────────────────────────────────────────────────────────
// We will import and register routes here as we build them
// Each route file handles one entity (contact, projects, services, admin)

app.use('/api/contact',  require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/admin',    require('./routes/admin'));

// ── 404 HANDLER ───────────────────────────────────────────────────────────────
// If no route matched the request, return a clean 404
// This must come AFTER all routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path:  req.originalUrl,
    });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
// Catches any error thrown inside a route with next(err)
// The 4-parameter signature (err, req, res, next) is required by Express
// to recognize this as an error handler — do not remove any parameter
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
        // In production we hide the error details from the client
        // In development we show them to help with debugging
    });
});

// ── START SERVER ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health`);

    // Verify database connection on startup
    try {
        await pool.query('SELECT 1');
        console.log('✓ Database connection verified');
    } catch (err) {
        console.error('✗ Database connection failed:', err.message);
        process.exit(1);
        // If we cannot reach the database on startup, shut down
        // A server without a database cannot serve any meaningful request
    }
});