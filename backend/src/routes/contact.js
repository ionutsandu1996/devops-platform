// contact.js — Routes for the public contact form
// Handles saving messages to the database and sending email notifications

const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');
const { sendContactNotification } = require('../services/email');

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            error: 'Name, email and message are required',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Invalid email format',
        });
    }

    try {
        const ipAddress = req.ip || null;

        // Step 1 — Save to database
        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message, ip_address)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, created_at`,
            [name, email, subject || null, message, ipAddress]
        );

        const saved = result.rows[0];

        // Step 2 — Send email notification (non-blocking)
        // We don't await — if email fails, form still succeeds
        // The message is already safe in DB — that's what matters
        sendContactNotification({ name, email, subject, message });

        // Step 3 — Return success immediately
        res.status(201).json({
            message: 'Your message has been received. We will get back to you soon!',
            id: saved.id,
        });

    } catch (err) {
        console.error('Error saving contact message:', err.message);
        res.status(500).json({
            error: 'Failed to save your message. Please try again later.',
        });
    }
});

router.get('/test', (req, res) => {
    res.json({ message: 'Contact route is working' });
});

module.exports = router;