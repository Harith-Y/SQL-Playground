const express = require('express');
const router = express.Router();
const { getUserDatabase } = require('../config/database');

router.get('/', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get the user's specific database
    const db = getUserDatabase(userId);

    // Get all tables in the user's database, excluding system tables
    db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence', 'query_history', 'saved_queries', 'users')", [], (err, tables) => {
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
    console.error('Schema fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/create', async (req, res) => {
  const { schema, userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!schema || !schema.tables) {
    return res.status(400).json({ error: 'Invalid schema format' });
  }

  try {
    const db = getUserDatabase(userId);
    
    // Create each table from the schema
    for (const [tableName, table] of Object.entries(schema.tables)) {
      const columns = table.columns.map(col => {
        return `${col.name} ${col.type} ${col.constraints}`;
      }).join(', ');

      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
      
      await new Promise((resolve, reject) => {
        db.run(createTableQuery, (err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });

      // Insert data if available
      if (table.data && table.data.length > 0) {
        const columnNames = table.columns.map(col => col.name).join(', ');
        const placeholders = table.columns.map(() => '?').join(', ');
        
        for (const row of table.data) {
          const values = table.columns.map(col => row[col.name]);
          const insertQuery = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
          
          await new Promise((resolve, reject) => {
            db.run(insertQuery, values, (err) => {
              if (err) reject(err);
              else resolve(null);
            });
          });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
