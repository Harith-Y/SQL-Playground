const express = require('express');
const router = express.Router();
const { getUserDatabase } = require('../config/database');
const auth = require('../middleware/auth');

// Get all themes for the current user
router.get('/', auth, async (req, res) => {
  try {
    const db = getUserDatabase(req.user.id);
    db.all(
      'SELECT * FROM themes WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id],
      (err, themes) => {
        if (err) {
          console.error('Error fetching themes:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ 
          themes: themes.map(theme => ({
            ...theme,
            colors: JSON.parse(theme.colors)
          }))
        });
      }
    );
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new theme
router.post('/', auth, async (req, res) => {
  try {
    const { name, colors } = req.body;
    const db = getUserDatabase(req.user.id);
    
    db.run(
      'INSERT INTO themes (user_id, name, colors) VALUES (?, ?, ?)',
      [req.user.id, name, JSON.stringify(colors)],
      function(err) {
        if (err) {
          console.error('Error creating theme:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        // Get the newly created theme
        db.get(
          'SELECT * FROM themes WHERE id = ?',
          [this.lastID],
          (err, theme) => {
            if (err) {
              console.error('Error fetching created theme:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            res.json({ 
              theme: {
                ...theme,
                colors: JSON.parse(theme.colors)
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error creating theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a theme
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = getUserDatabase(req.user.id);
    
    db.run(
      'DELETE FROM themes WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id],
      function(err) {
        if (err) {
          console.error('Error deleting theme:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Theme not found' });
        }

        res.json({ message: 'Theme deleted' });
      }
    );
  } catch (error) {
    console.error('Error deleting theme:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 