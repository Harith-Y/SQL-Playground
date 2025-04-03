const express = require('express');
const router = express.Router();
const { getUserDatabase } = require('../config/database');

// Get saved queries
router.get('/', async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const db = getUserDatabase(userId);
        const queries = await new Promise((resolve, reject) => {
            db.all(
                "SELECT id, title, query, created_at FROM saved_queries WHERE user_id = ? ORDER BY created_at DESC",
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json({ success: true, queries });
    } catch (error) {
        console.error('Error fetching saved queries:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save a query
router.post('/', async (req, res) => {
    const { userId, title, query } = req.body;
    
    if (!userId || !title || !query) {
        return res.status(400).json({ error: 'User ID, title, and query are required' });
    }

    try {
        const db = getUserDatabase(userId);
        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO saved_queries (user_id, title, query) VALUES (?, ?, ?)",
                [userId, title, query],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving query:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a saved query
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const db = getUserDatabase(userId);
        await new Promise((resolve, reject) => {
            db.run(
                "DELETE FROM saved_queries WHERE id = ? AND user_id = ?",
                [id, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting saved query:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 