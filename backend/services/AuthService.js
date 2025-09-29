const jwt = require('jsonwebtoken');
const ConfigService = require('./ConfigService');

/**
 * AuthService - Handles JWT token operations and authentication logic
 */
class AuthService {
    constructor() {
        this.config = new ConfigService();
        this.JWT_SECRET = this.config.get('jwt.secret');
        this.TOKEN_EXPIRY = this.config.get('jwt.expiry');
    }

    /**
     * Generates a JWT token for a user
     * @param {string} userId - The user ID
     * @param {string} username - The username
     * @returns {string} The JWT token
     */
    generateToken(userId, username) {
        return jwt.sign(
            { userId, username },
            this.JWT_SECRET,
            { expiresIn: this.TOKEN_EXPIRY }
        );
    }

    /**
     * Verifies a JWT token
     * @param {string} token - The JWT token to verify
     * @returns {Promise<Object>} The decoded token payload
     * @throws {Error} If token is invalid or expired
     */
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    /**
     * Extracts token from Authorization header
     * @param {string} authHeader - The Authorization header value
     * @returns {string|null} The extracted token or null
     */
    extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            return null;
        }
        
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        
        return parts[1];
    }

    /**
     * Creates authentication middleware for Express routes
     * @returns {Function} Express middleware function
     */
    createAuthMiddleware() {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers['authorization'];
                const token = this.extractTokenFromHeader(authHeader);

                if (!token) {
                    return res.status(401).json({ 
                        message: 'Access token required' 
                    });
                }

                const decoded = await this.verifyToken(token);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(403).json({ 
                    message: 'Invalid or expired token' 
                });
            }
        };
    }
}

module.exports = AuthService;