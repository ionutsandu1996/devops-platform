// services.js — CRUD routes for DevOps services
// GET    /api/services      — list all active services (public)
// GET    /api/services/:id  — get single service (public)
// POST   /api/services      — create service (admin only)
// PUT    /api/services/:id  — update service (admin only)
// DELETE /api/services/:id  — delete service (admin only)

const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// ── GET /api/services ─────────────────────────────────────────────────────────
// Returns all ACTIVE services ordered by sort_order
// is_active = false means the service is hidden without being deleted
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, icon, price_from, sort_order
             FROM services
             WHERE is_active = true
             ORDER BY sort_order ASC`
        );

        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error fetching services:', err.message);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

// ── GET /api/services/:id ─────────────────────────────────────────────────────
// Returns a single service by ID regardless of is_active status
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }

        const result = await pool.query(
            `SELECT * FROM services WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error fetching service:', err.message);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});

// ── POST /api/services ────────────────────────────────────────────────────────
// Creates a new service
// Body: { title, description, icon, price_from, is_active, sort_order }
router.post('/', async (req, res) => {
    const {
        title,
        description,
        icon,
        price_from,
        is_active,
        sort_order,
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO services
                (title, description, icon, price_from, is_active, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                title,
                description,
                icon       || null,
                price_from || null,
                // is_active defaults to true if not provided
                is_active !== undefined ? is_active : true,
                sort_order || 0,
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Error creating service:', err.message);
        res.status(500).json({ error: 'Failed to create service' });
    }
});

// ── PUT /api/services/:id ─────────────────────────────────────────────────────
// Updates an existing service
// Can also be used to toggle is_active without deleting the service
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
    }

    const {
        title,
        description,
        icon,
        price_from,
        is_active,
        sort_order,
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const result = await pool.query(
            `UPDATE services
             SET title       = $1,
                 description = $2,
                 icon        = $3,
                 price_from  = $4,
                 is_active   = $5,
                 sort_order  = $6
             WHERE id = $7
             RETURNING *`,
            [
                title,
                description,
                icon       || null,
                price_from || null,
                is_active !== undefined ? is_active : true,
                sort_order || 0,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error updating service:', err.message);
        res.status(500).json({ error: 'Failed to update service' });
    }
});

// ── DELETE /api/services/:id ──────────────────────────────────────────────────
// Permanently deletes a service
// Consider using PUT with is_active: false instead of deleting
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid service ID' });
    }

    try {
        const result = await pool.query(
            `DELETE FROM services WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.status(200).json({
            message: 'Service deleted successfully',
            deleted: result.rows[0],
        });

    } catch (err) {
        console.error('Error deleting service:', err.message);
        res.status(500).json({ error: 'Failed to delete service' });
    }
});

module.exports = router;