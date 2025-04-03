const express = require('express');
const router = express.Router();
const { getUserDatabase } = require('../config/database');

// Get query history
router.get('/', async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const db = getUserDatabase(userId);
        const history = await new Promise((resolve, reject) => {
            db.all(
                "SELECT id, query, executed_at FROM query_history ORDER BY executed_at DESC",
                [],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });

        res.json({ success: true, history });
    } catch (error) {
        console.error('Error fetching query history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add query to history
router.post('/', async (req, res) => {
    const { userId, query } = req.body;
    
    if (!userId || !query) {
        return res.status(400).json({ error: 'User ID and query are required' });
    }

    try {
        const db = getUserDatabase(userId);
        await new Promise((resolve, reject) => {
            db.run(
                "INSERT INTO query_history (query) VALUES (?)",
                [query],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding query to history:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 