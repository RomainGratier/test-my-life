const ConfigService = require('./ConfigService');

/**
 * RateLimitService - Handles rate limiting for authentication endpoints
 */
class RateLimitService {
    constructor() {
        this.config = new ConfigService();
        // In-memory storage for rate limiting (in production, use Redis)
        this.attempts = new Map();
        this.maxAttempts = this.config.get('security.rateLimit.maxAttempts');
        this.windowMs = this.config.get('security.rateLimit.windowMs');
        this.blockDurationMs = this.config.get('security.rateLimit.blockDurationMs');
    }

    /**
     * Records a failed authentication attempt
     * @param {string} identifier - IP address or user identifier
     * @param {string} endpoint - The endpoint being accessed
     */
    recordFailedAttempt(identifier, endpoint = 'auth') {
        const key = `${identifier}:${endpoint}`;
        const now = Date.now();
        
        if (!this.attempts.has(key)) {
            this.attempts.set(key, {
                count: 0,
                firstAttempt: now,
                lastAttempt: now,
                blocked: false,
                blockUntil: null
            });
        }
        
        const attempt = this.attempts.get(key);
        
        // Reset counter if window has expired
        if (now - attempt.firstAttempt > this.windowMs) {
            attempt.count = 0;
            attempt.firstAttempt = now;
            attempt.blocked = false;
            attempt.blockUntil = null;
        }
        
        attempt.count++;
        attempt.lastAttempt = now;
        
        // Block if max attempts exceeded
        if (attempt.count >= this.maxAttempts) {
            attempt.blocked = true;
            attempt.blockUntil = now + this.blockDurationMs;
        }
    }

    /**
     * Records a successful authentication attempt (resets counter)
     * @param {string} identifier - IP address or user identifier
     * @param {string} endpoint - The endpoint being accessed
     */
    recordSuccessfulAttempt(identifier, endpoint = 'auth') {
        const key = `${identifier}:${endpoint}`;
        this.attempts.delete(key);
    }

    /**
     * Checks if an identifier is currently rate limited
     * @param {string} identifier - IP address or user identifier
     * @param {string} endpoint - The endpoint being accessed
     * @returns {Object} Rate limit status
     */
    checkRateLimit(identifier, endpoint = 'auth') {
        const key = `${identifier}:${endpoint}`;
        const now = Date.now();
        
        if (!this.attempts.has(key)) {
            return { allowed: true, remaining: this.maxAttempts };
        }
        
        const attempt = this.attempts.get(key);
        
        // Check if block has expired
        if (attempt.blocked && attempt.blockUntil && now > attempt.blockUntil) {
            this.attempts.delete(key);
            return { allowed: true, remaining: this.maxAttempts };
        }
        
        // Check if window has expired
        if (now - attempt.firstAttempt > this.windowMs) {
            this.attempts.delete(key);
            return { allowed: true, remaining: this.maxAttempts };
        }
        
        const remaining = Math.max(0, this.maxAttempts - attempt.count);
        const allowed = !attempt.blocked && remaining > 0;
        
        return {
            allowed,
            remaining,
            blocked: attempt.blocked,
            blockUntil: attempt.blockUntil,
            resetTime: attempt.firstAttempt + this.windowMs
        };
    }

    /**
     * Creates Express middleware for rate limiting
     * @param {string} endpoint - The endpoint name for rate limiting
     * @returns {Function} Express middleware function
     */
    createRateLimitMiddleware(endpoint = 'auth') {
        return (req, res, next) => {
            const identifier = req.ip || req.connection.remoteAddress || 'unknown';
            const rateLimitStatus = this.checkRateLimit(identifier, endpoint);
            
            if (!rateLimitStatus.allowed) {
                const retryAfter = rateLimitStatus.blockUntil 
                    ? Math.ceil((rateLimitStatus.blockUntil - Date.now()) / 1000)
                    : Math.ceil((rateLimitStatus.resetTime - Date.now()) / 1000);
                
                return res.status(429).json({
                    message: 'Too many authentication attempts. Please try again later.',
                    retryAfter: retryAfter,
                    blocked: rateLimitStatus.blocked
                });
            }
            
            // Add rate limit headers
            res.set({
                'X-RateLimit-Limit': this.maxAttempts,
                'X-RateLimit-Remaining': rateLimitStatus.remaining,
                'X-RateLimit-Reset': new Date(rateLimitStatus.resetTime).toISOString()
            });
            
            next();
        };
    }
}

module.exports = RateLimitService;