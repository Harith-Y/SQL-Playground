const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// Create routes directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'routes'))) {
    fs.mkdirSync(path.join(__dirname, 'routes'));
}

// API Routes
const queriesRouter = require('./routes/queries');
const schemaRouter = require('./routes/schema');
const historyRouter = require('./routes/history');
const savedQueriesRoutes = require('./routes/saved-queries');

app.use('/api/queries', queriesRouter);
app.use('/api/schema', schemaRouter);
app.use('/api/history', historyRouter);
app.use('/api/saved-queries', savedQueriesRoutes);

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
