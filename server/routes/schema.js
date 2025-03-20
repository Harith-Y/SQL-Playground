const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
  try {
    // Get all tables in the database
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const schema = {
        tables: {}
      };

      // For each table, get its schema
      let completedTables = 0;
      tables.forEach(table => {
        db.all(`PRAGMA table_info(${table.name})`, [], (err, columns) => {
          if (err) {
            console.error(`Error getting schema for table ${table.name}:`, err);
            return;
          }

          schema.tables[table.name] = {
            columns: columns.map(col => ({
              name: col.name,
              type: col.type,
              constraints: [
                col.pk ? 'PRIMARY KEY' : null,
                col.notnull ? 'NOT NULL' : null,
                col.dflt_value ? `DEFAULT ${col.dflt_value}` : null
              ].filter(Boolean).join(' ')
            }))
          };

          completedTables++;
          if (completedTables === tables.length) {
            res.json(schema);
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
