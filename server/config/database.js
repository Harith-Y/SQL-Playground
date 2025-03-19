const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Database path
const dbPath = path.join(dbDir, 'sql_playground.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } 
    
    else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Drop existing tables if they exist
        db.run("DROP TABLE IF EXISTS tutorial_progress");
        db.run("DROP TABLE IF EXISTS saved_schemas");
        db.run("DROP TABLE IF EXISTS saved_queries");
        db.run("DROP TABLE IF EXISTS users");

        // Users table for testing
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Insert some test data if the table is empty
        db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
            if (err) {
                console.error('Error checking users table:', err);
                return;
            }

            if (row.count === 0) {
                const testUsers = [
                    ['john_doe', 'john@example.com'],
                    ['jane_smith', 'jane@example.com'],
                    ['bob_wilson', 'bob@example.com']
                ];

                const stmt = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)");
                testUsers.forEach(user => stmt.run(user));
                stmt.finalize();

                console.log('Test data inserted successfully');
            }
        });

        // Saved queries table
        db.run(`CREATE TABLE IF NOT EXISTS saved_queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            query TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Saved schemas table
        db.run(`CREATE TABLE IF NOT EXISTS saved_schemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            schema TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Tutorial progress table
        db.run(`CREATE TABLE IF NOT EXISTS tutorial_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            tutorial_id INTEGER,
            completed BOOLEAN DEFAULT 0,
            last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
    });
}

module.exports = db;
