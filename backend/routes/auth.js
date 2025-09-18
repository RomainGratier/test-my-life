const express = require('express');
const router = express.Router();

/**
 * @route POST /auth/register
 * @description Registers a new user.
 * @access Public
 */
router.post('/register', (req, res) => {
    // This is a placeholder. In a real application, you would:
    // 1. Validate input (username, password)
    // 2. Hash the password
    // 3. Store the user in a database
    // 4. Handle existing users
    console.log('Attempting to register user:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Simulate user creation
    const newUserId = `user-${Date.now()}`; // Simple unique ID
    console.log(`User ${username} registered with ID: ${newUserId}`);

    res.status(201).json({
        message: 'User registered successfully (placeholder)',
        userId: newUserId
    });
});

/**
 * @route POST /auth/login
 * @description Authenticates a user and returns a token.
 * @access Public
 */
router.post('/login', (req, res) => {
    // This is a placeholder. In a real application, you would:
    // 1. Validate input (username, password)
    // 2. Query database for user
    // 3. Compare hashed password
    // 4. Generate a JWT token
    console.log('Attempting to log in user:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Simulate login success for any credentials
    if (username === 'testuser' && password === 'testpass') {
        const token = 'mock-jwt-token-for-testuser'; // In reality, generate a proper JWT
        console.log(`User ${username} logged in, issued token.`);
        return res.status(200).json({
            message: 'Login successful (placeholder)',
            token: token
        });
    } else {
        // Simulate a failed login
        return res.status(401).json({
            message: 'Invalid credentials (placeholder)'
        });
    }
});

module.exports = router;