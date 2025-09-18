require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for all routes, essential for frontend/backend communication
app.use(express.json()); // Parse JSON bodies of incoming requests

// Serve static files from the 'frontend' directory
// This means when you access http://localhost:8080, it will serve frontend/index.html
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/auth', authRoutes); // All auth routes will be prefixed with /auth

// Basic root route for API, useful for testing backend is up
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Auth Challenge API!' });
});

// Catch-all for non-API routes (redirect to frontend or serve frontend index.html)
// This should be after API routes but before the server listens
app.get('*', (req, res) => {
    // If the request is not for an API route, serve the frontend's index.html
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Frontend served from http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/auth/...`);
});