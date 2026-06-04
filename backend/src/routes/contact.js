// contact.js — Routes for the public contact form
// Handles saving messages to the database and sending email notifications

const express = require('express');

// Router is a mini Express app — handles routes for one entity
// We export it and register it in index.js with app.use('/api/contact', ...)
const router = express.Router();

// Import the database pool to run queries
const pool = require('../db/pool');

// ── POST /api/contact ─────────────────────────────────────────────────────────
// Called when a visitor submits the contact form on the website
// Body: { name, email, subject, message }
router.post('/', async (req, res) => {
    // Destructure the fields we expect from the request body
    const { name, email, subject, message } = req.body;

    // Basic validation — name, email and message are required
    // subject is optional
    if (!name || !email || !message) {
        // 400 Bad Request — the client sent incomplete data
        return res.status(400).json({
            error: 'Name, email and message are required',
        });
    }

    // Basic email format validation
    // We check for @ and a dot after it — not perfect but sufficient
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format',
        });
    }

    try {
        // Get the visitor's IP address from the request
        // req.ip gives us the IP — useful for spam detection later
        const ipAddress = req.ip || null;

        // Insert the message into the database
        // $1, $2, $3... are placeholders — never use string concatenation!
        // String concatenation opens the door to SQL injection attacks:
        // e.g. name = "'; DROP TABLE contact_messages; --"
        // With $1 placeholders, pg treats the value as pure data, not SQL
        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message, ip_address)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, created_at`,
            [name, email, subject || null, message, ipAddress]
            // subject || null: if subject is empty string, store NULL in DB
        );

        // The RETURNING clause gives us back the inserted row
        // so we can confirm to the client what was saved
        const saved = result.rows[0];

        // 201 Created — a new resource was successfully created
        res.status(201).json({
            message: 'Your message has been received. We will get back to you soon!',
            id: saved.id,
        });

    } catch (err) {
        // 500 Internal Server Error — something went wrong on our side
        console.error('Error saving contact message:', err.message);
        res.status(500).json({
            error: 'Failed to save your message. Please try again later.',
        });
    }
});

// ── GET /api/contact/test ─────────────────────────────────────────────────────
// Simple endpoint to confirm the contact route is registered
// Remove this in production
router.get('/test', (req, res) => {
    res.json({ message: 'Contact route is working' });
});

// Export the router to be used in index.js
module.exports = router;