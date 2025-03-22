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
    // Clean the query by removing comments and extra whitespace
    const cleanQuery = query
      .split('\n')
      .map(line => line.trim())
      .filter(line => !line.startsWith('--') && line.length > 0)
      .join(' ')
      .trim();

    // For SELECT queries, use all() to get results
    if (cleanQuery.toUpperCase().startsWith('SELECT')) {
      // First, get the list of tables to check case sensitivity
      const tables = await new Promise((resolve, reject) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows.map(row => row.name));
        });
      });

      // Modify the query to use the correct case for table names
      let modifiedQuery = cleanQuery;
      tables.forEach(table => {
        const regex = new RegExp(`\\b${table}\\b`, 'gi');
        modifiedQuery = modifiedQuery.replace(regex, table);
      });

      const rows = await new Promise((resolve, reject) => {
        db.all(modifiedQuery, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      res.json({ 
        success: true,
        results: rows,
        columns: rows.length > 0 ? Object.keys(rows[0]) : []
      });
    } else {
      // For other queries (INSERT, UPDATE), use run()
      const result = await new Promise((resolve, reject) => {
        db.run(cleanQuery, [], function(err) {
          if (err) reject(err);
          else resolve({
            changes: this.changes,
            lastId: this.lastID
          });
        });
      });

      res.json({ 
        success: true,
        ...result
      });
    }
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
