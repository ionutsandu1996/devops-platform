// admin.js — Admin authentication and protected routes
// POST /api/admin/login              — public, returns JWT token
// GET  /api/admin/messages           — protected, list all messages
// PUT  /api/admin/messages/:id/read  — protected, mark message as read
// GET  /api/admin/services           — protected, list ALL services including inactive

const express  = require('express');
const router   = express.Router();
const pool     = require('../db/pool');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const auth     = require('../middleware/auth');

// ── POST /api/admin/login ─────────────────────────────────────────────────────
// Receives email and password, returns a JWT token if valid
// This is the ONLY admin route that does not require authentication
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Look up the admin by email
        const result = await pool.query(
            `SELECT * FROM admin_users WHERE email = $1`,
            [email]
        );

        // If no admin found with that email, return 401
        // We use the same error message as wrong password
        // to avoid revealing whether the email exists (security best practice)
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const admin = result.rows[0];

        // bcrypt.compare() hashes the provided password and compares it
        // to the stored hash — we never store or compare plain text passwords
        const passwordMatch = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Password is correct — generate a JWT token
        // The payload contains the admin's id and email
        // jwt.sign() signs it with our secret so only we can verify it
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Return the token to the frontend
        // The frontend stores it and sends it in every subsequent request
        res.status(200).json({
            message: 'Login successful',
            token,
        });

    } catch (err) {
        console.error('Error during admin login:', err.message);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

// ── GET /api/admin/messages ───────────────────────────────────────────────────
// Returns ALL messages (read and unread) ordered by newest first
// Protected — requires valid JWT token
router.get('/messages', auth, async (req, res) => {
    // auth middleware runs first — if it calls next(), we reach this handler
    // req.admin contains the decoded token payload: { id, email }
    try {
        const result = await pool.query(
            `SELECT id, name, email, subject, message, is_read, ip_address, created_at
             FROM contact_messages
             ORDER BY created_at DESC`
        );

        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ── PUT /api/admin/messages/:id/read ─────────────────────────────────────────
// Marks a message as read
// Protected — requires valid JWT token
router.put('/messages/:id/read', auth, async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid message ID' });
    }

    try {
        const result = await pool.query(
            `UPDATE contact_messages
             SET is_read = true
             WHERE id = $1
             RETURNING id, name, email, is_read`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.status(200).json({
            message: 'Message marked as read',
            updated: result.rows[0],
        });

    } catch (err) {
        console.error('Error marking message as read:', err.message);
        res.status(500).json({ error: 'Failed to update message' });
    }
});

// ── GET /api/admin/services ───────────────────────────────────────────────────
// Returns ALL services including inactive ones
// The public GET /api/services only returns is_active = true
// Admin needs to see everything to be able to manage them
router.get('/services', auth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM services ORDER BY sort_order ASC`
        );

        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error fetching all services:', err.message);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

module.exports = router;