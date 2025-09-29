const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user storage (in production, use a proper database)
const users = new Map();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Helper function to validate input
function validateInput(username, password) {
    const errors = [];
    
    if (!username || username.trim().length === 0) {
        errors.push('Username is required');
    } else if (username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    } else if (username.length > 20) {
        errors.push('Username must be less than 20 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
    }
    
    if (!password || password.length === 0) {
        errors.push('Password is required');
    } else {
        // TODO: Implement enterprise password requirements:
        // - Minimum 12 characters (currently 6)
        // - Must contain uppercase letters
        // - Must contain lowercase letters
        // - Must contain numbers
        // - Must contain special characters (!@#$%^&*())
        // - Prevent common passwords
        
        if (password.length < 12) { // TODO: Change from 6 to 12
            errors.push('Password must be at least 12 characters long');
        } else if (password.length > 100) {
            errors.push('Password must be less than 100 characters');
        }
        
        // TODO: Add password complexity validation
        // TODO: Add common password prevention
    }
    
    return errors;
}

// Helper function to generate JWT token
function generateToken(userId, username) {
    return jwt.sign(
        { userId, username },
        JWT_SECRET,
        { expiresIn: '24h' } // TODO: Change to short-lived token (15-30 minutes)
    );
}

/**
 * @route POST /auth/register
 * @description Registers a new user.
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        console.log('Attempting to register user:', req.body);
        const { username, password } = req.body;

        // Validate input
        const validationErrors = validateInput(username, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Check if user already exists
        if (users.has(username.toLowerCase())) {
            return res.status(409).json({ 
                message: 'Username already exists' 
            });
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user object
        const userId = `user-${Date.now()}`;
        const user = {
            id: userId,
            username: username.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // Store user
        users.set(username.toLowerCase(), user);
        console.log(`User ${username} registered with ID: ${userId}`);

        res.status(201).json({
            message: 'User registered successfully',
            userId: userId,
            username: username
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Internal server error during registration' 
        });
    }
});

/**
 * @route POST /auth/login
 * @description Authenticates a user and returns a token.
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        console.log('Attempting to log in user:', req.body);
        const { username, password } = req.body;

        // Validate input
        const validationErrors = validateInput(username, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Find user
        const user = users.get(username.toLowerCase());
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken(user.id, user.username);
        console.log(`User ${username} logged in successfully, issued token.`);

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Internal server error during login' 
        });
    }
});

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            message: 'Access token required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                message: 'Invalid or expired token' 
            });
        }
        req.user = user;
        next();
    });
}

/**
 * @route GET /auth/profile
 * @description Get user profile (protected route)
 * @access Private
 */
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.username);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            message: 'Internal server error retrieving profile' 
        });
    }
});

/**
 * @route POST /auth/verify
 * @description Verify a JWT token
 * @access Public
 */
router.post('/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ 
                message: 'Token is required' 
            });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ 
                    message: 'Invalid or expired token',
                    valid: false
                });
            }

            res.status(200).json({
                message: 'Token is valid',
                valid: true,
                user: {
                    id: decoded.userId,
                    username: decoded.username
                }
            });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            message: 'Internal server error during token verification' 
        });
    }
});

module.exports = router;