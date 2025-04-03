const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Create a map to store database connections
const dbConnections = new Map();

// Function to initialize user's database with required tables
function initializeUserDatabase(db) {
    db.serialize(() => {
        // Create query history table
        db.run(`CREATE TABLE IF NOT EXISTS query_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

// Function to get or create a database connection for a user
function getUserDatabase(userId) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    // Check if we already have a connection for this user
    if (dbConnections.has(userId)) {
        return dbConnections.get(userId);
    }

    // Create a new database file for the user
    const userDbPath = path.join(dbDir, `user_${userId}.db`);
    
    // Create new database connection
    const db = new sqlite3.Database(userDbPath, (err) => {
        if (err) {
            console.error(`Error connecting to user database ${userId}:`, err);
        } else {
            console.log(`Connected to user database ${userId}`);
            initializeUserDatabase(db);
        }
    });

    // Store the connection
    dbConnections.set(userId, db);
    return db;
}

// Function to close a user's database connection
function closeUserDatabase(userId) {
    if (dbConnections.has(userId)) {
        const db = dbConnections.get(userId);
        db.close();
        dbConnections.delete(userId);
    }
}

// Function to get all user databases
function getAllUserDatabases() {
    return Array.from(dbConnections.entries());
}

module.exports = {
    getUserDatabase,
    closeUserDatabase,
    getAllUserDatabases
};
