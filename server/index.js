const express = require('express');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Redis client
let redisClient;
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.log('Max reconnection attempts reached, using in-memory session store');
                        return new Error('Max reconnection attempts reached');
                    }
                    return Math.min(retries * 100, 3000);
                },
                connectTimeout: 10000
            }
        });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });

        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });

        redisClient.connect().catch(console.error);
    } catch (error) {
        console.error('Failed to initialize Redis client:', error);
    }
}

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            process.env.CLIENT_URL, 
            'https://sql-playground-eight.vercel.app'
          ]
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Ensure CORS headers are set for all responses
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        const allowedOrigins = process.env.NODE_ENV === 'production' 
            ? [
                process.env.CLIENT_URL, 
                'https://sql-playground-eight.vercel.app'
              ]
            : ['http://localhost:3000'];
            
        if (allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
        }
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Use Redis store in production, memory store in development
if (process.env.NODE_ENV === 'production' && redisClient) {
    sessionConfig.store = new RedisStore({
        client: redisClient,
        prefix: 'session:'
    });
}

app.use(session(sessionConfig));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create routes directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'routes'))) {
    fs.mkdirSync(path.join(__dirname, 'routes'));
}

// Auth routes (public)
app.use('/api/auth', require('./auth'));

// Protected API Routes
app.use('/api/queries', requireAuth, require('./routes/queries'));
app.use('/api/schema', requireAuth, require('./routes/schema'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle React routing in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
