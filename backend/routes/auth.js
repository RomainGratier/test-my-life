const express = require('express');
const router = express.Router();

// Import services
const ValidationService = require('../services/ValidationService');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const RateLimitService = require('../services/RateLimitService');

// Initialize services
const userService = new UserService();
const authService = new AuthService();
const rateLimitService = new RateLimitService();

// Authentication middleware using AuthService
const authenticateToken = authService.createAuthMiddleware();

// Rate limiting middleware
const authRateLimit = rateLimitService.createRateLimitMiddleware('auth');

/**
 * @route POST /auth/register
 * @description Registers a new user.
 * @access Public
 */
router.post('/register', authRateLimit, async (req, res) => {
    try {
        console.log('Attempting to register user:', req.body);
        const { username, password } = req.body;

        // Validate input using ValidationService
        const validationErrors = ValidationService.validateInput(username, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Check if user already exists using UserService
        if (await userService.userExists(username)) {
            const identifier = req.ip || req.connection.remoteAddress || 'unknown';
            rateLimitService.recordFailedAttempt(identifier, 'register');
            return res.status(409).json({ 
                message: 'Username already exists' 
            });
        }

        // Create user using UserService
        const user = await userService.createUser(username, password);
        console.log(`User ${username} registered with ID: ${user.id}`);

        // Record successful registration
        const identifier = req.ip || req.connection.remoteAddress || 'unknown';
        rateLimitService.recordSuccessfulAttempt(identifier, 'register');

        res.status(201).json({
            message: 'User registered successfully',
            userId: user.id,
            username: user.username
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
router.post('/login', authRateLimit, async (req, res) => {
    try {
        console.log('Attempting to log in user:', req.body);
        const { username, password } = req.body;

        // Validate input using ValidationService
        const validationErrors = ValidationService.validateInput(username, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Find user using UserService
        const user = await userService.findUserByUsername(username);
        if (!user) {
            const identifier = req.ip || req.connection.remoteAddress || 'unknown';
            rateLimitService.recordFailedAttempt(identifier, 'login');
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Verify password using UserService
        const isPasswordValid = await userService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            const identifier = req.ip || req.connection.remoteAddress || 'unknown';
            rateLimitService.recordFailedAttempt(identifier, 'login');
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token using AuthService
        const token = authService.generateToken(user.id, user.username);
        console.log(`User ${username} logged in successfully, issued token.`);

        // Record successful login
        const identifier = req.ip || req.connection.remoteAddress || 'unknown';
        rateLimitService.recordSuccessfulAttempt(identifier, 'login');

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


/**
 * @route GET /auth/profile
 * @description Get user profile (protected route)
 * @access Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userProfile = await userService.getUserProfile(req.user.username);
        if (!userProfile) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user: userProfile
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
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ 
                message: 'Token is required' 
            });
        }

        try {
            const decoded = await authService.verifyToken(token);
            res.status(200).json({
                message: 'Token is valid',
                valid: true,
                user: {
                    id: decoded.userId,
                    username: decoded.username
                }
            });
        } catch (error) {
            res.status(401).json({ 
                message: 'Invalid or expired token',
                valid: false
            });
        }
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ 
            message: 'Internal server error during token verification' 
        });
    }
});

module.exports = router;