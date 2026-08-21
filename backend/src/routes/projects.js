// projects.js — CRUD routes for portfolio projects
// GET    /api/projects        — list all projects (public)
// GET    /api/projects/:id    — get single project (public)
// POST   /api/projects        — create project (admin only)
// PUT    /api/projects/:id    — update project (admin only)
// DELETE /api/projects/:id    — delete project (admin only)

const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');
const auth    = require('../middleware/auth');

// ── GET /api/projects ─────────────────────────────────────────────────────────
// Returns all projects ordered by featured first, then sort_order
// This is a PUBLIC endpoint — no authentication required
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, tech_stack,
                    github_url, demo_url, image_url,
                    is_featured, sort_order, created_at
             FROM projects
             ORDER BY is_featured DESC, sort_order ASC, created_at DESC`
            // is_featured DESC: featured projects appear first (true > false)
            // sort_order ASC: lower number = higher position
            // created_at DESC: newest first as a tiebreaker
        );

        // result.rows is always an array — empty array if no projects yet
        res.status(200).json(result.rows);

    } catch (err) {
        console.error('Error fetching projects:', err.message);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// ── GET /api/projects/:id ─────────────────────────────────────────────────────
// Returns a single project by ID
// :id is a URL parameter — e.g. /api/projects/3
router.get('/:id', async (req, res) => {
    try {
        // req.params.id is always a string — parseInt converts it to a number
        const id = parseInt(req.params.id);

        // Validate that id is actually a number
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        const result = await pool.query(
            `SELECT * FROM projects WHERE id = $1`,
            [id]
        );

        // result.rows is an array — if empty, the project does not exist
        if (result.rows.length === 0) {
            // 404 Not Found — the resource does not exist
            return res.status(404).json({ error: 'Project not found' });
        }

        // Return the first (and only) row
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error fetching project:', err.message);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// ── POST /api/projects ────────────────────────────────────────────────────────
// Creates a new project
// Body: { title, description, tech_stack, github_url, demo_url, image_url, is_featured, sort_order }
router.post('/', auth, async (req, res) => {
    const {
        title,
        description,
        tech_stack,
        github_url,
        demo_url,
        image_url,
        is_featured,
        sort_order,
    } = req.body;

    // title and description are required — everything else is optional
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO projects
                (title, description, tech_stack, github_url, demo_url, image_url, is_featured, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            // RETURNING * gives us back the full inserted row including id and created_at
            [
                title,
                description,
                tech_stack  || null,
                github_url  || null,
                demo_url    || null,
                image_url   || null,
                is_featured || false,
                sort_order  || 0,
            ]
        );

        // 201 Created — new resource was successfully created
        res.status(201).json(result.rows[0]);

    } catch (err) {
        console.error('Error creating project:', err.message);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// ── PUT /api/projects/:id ─────────────────────────────────────────────────────
// Updates an existing project
// Sends back the updated row
router.put('/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
    }

    const {
        title,
        description,
        tech_stack,
        github_url,
        demo_url,
        image_url,
        is_featured,
        sort_order,
    } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const result = await pool.query(
            `UPDATE projects
             SET title       = $1,
                 description = $2,
                 tech_stack  = $3,
                 github_url  = $4,
                 demo_url    = $5,
                 image_url   = $6,
                 is_featured = $7,
                 sort_order  = $8,
                 updated_at  = NOW()
             WHERE id = $9
             RETURNING *`,
            // updated_at = NOW() keeps track of when the record was last modified
            [
                title,
                description,
                tech_stack  || null,
                github_url  || null,
                demo_url    || null,
                image_url   || null,
                is_featured || false,
                sort_order  || 0,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('Error updating project:', err.message);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
// Deletes a project permanently
// Returns the deleted row as confirmation
router.delete('/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
    }

    try {
        const result = await pool.query(
            `DELETE FROM projects WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // 200 OK with the deleted row — confirms what was removed
        res.status(200).json({
            message: 'Project deleted successfully',
            deleted: result.rows[0],
        });

    } catch (err) {
        console.error('Error deleting project:', err.message);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
