const { Pool } = require('pg');
require('dotenv').config();

let pool;

const createPool = () => {
    if (process.env.NODE_ENV === 'production') {
        // For production (Vercel)
        return new Pool({
            connectionString: process.env.POSTGRES_URL,
            ssl: {
                rejectUnauthorized: false // Required for Supabase connection
            }
        });
    } else {
        // For local development
        return new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
            ssl: false
        });
    }
};

const connectWithRetry = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            pool = createPool();
            const client = await pool.connect();
            console.log('Successfully connected to the database');
            client.release();
            return;
        } catch (err) {
            console.error(`Database connection attempt ${i + 1} failed:`, err.message);
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
};

// Initialize database connection
connectWithRetry().catch(err => {
    console.error('Failed to connect to database after multiple attempts:', err);
    process.exit(1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
}; 