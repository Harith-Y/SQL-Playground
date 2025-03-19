const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/execute', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // List of dangerous SQL commands to prevent
  const dangerousCommands = [
    'DROP', 'TRUNCATE', 'DELETE', 'ALTER', 'MODIFY',
    'RENAME', 'REMOVE', 'GRANT', 'REVOKE'
  ];

  // Check for dangerous commands
  const containsDangerousCommand = dangerousCommands.some(cmd => 
    query.toUpperCase().includes(cmd)
  );

  if (containsDangerousCommand) {
    return res.status(403).json({ 
      error: 'This query contains commands that are not allowed in the playground'
    });
  }

  try {
    // For SELECT queries, use all() to get results
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      db.all(query, [], (err, rows) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ 
          success: true,
          results: rows,
          columns: rows.length > 0 ? Object.keys(rows[0]) : []
        });
      });
    } else {
      // For other queries (INSERT, UPDATE), use run()
      db.run(query, [], function(err) {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        res.json({ 
          success: true,
          changes: this.changes,
          lastId: this.lastID
        });
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
