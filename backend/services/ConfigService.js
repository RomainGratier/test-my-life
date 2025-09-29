/**
 * ConfigService - Handles application configuration for different environments
 */
class ConfigService {
    constructor() {
        this.environment = process.env.NODE_ENV || 'development';
        this.config = this.loadConfiguration();
    }

    /**
     * Loads configuration based on environment
     * @returns {Object} Configuration object
     */
    loadConfiguration() {
        const baseConfig = {
            // Server configuration
            port: process.env.PORT || 8080,
            host: process.env.HOST || 'localhost',
            
            // JWT configuration
            jwt: {
                secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
                expiry: process.env.JWT_EXPIRY || '30m',
                refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
            },
            
            // Database configuration
            database: {
                type: process.env.DB_TYPE || 'memory', // memory, postgresql, mongodb
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT || 5432,
                name: process.env.DB_NAME || 'auth_db',
                username: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                url: process.env.DATABASE_URL || ''
            },
            
            // Security configuration
            security: {
                bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
                rateLimit: {
                    maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5,
                    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
                    blockDurationMs: parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MS) || 30 * 60 * 1000 // 30 minutes
                },
                cors: {
                    origin: process.env.CORS_ORIGIN || '*',
                    credentials: process.env.CORS_CREDENTIALS === 'true'
                }
            },
            
            // Logging configuration
            logging: {
                level: process.env.LOG_LEVEL || 'info',
                format: process.env.LOG_FORMAT || 'combined'
            }
        };

        // Environment-specific overrides
        switch (this.environment) {
            case 'production':
                return {
                    ...baseConfig,
                    security: {
                        ...baseConfig.security,
                        bcryptRounds: 14, // Higher rounds for production
                        rateLimit: {
                            ...baseConfig.security.rateLimit,
                            maxAttempts: 3, // Stricter rate limiting
                            windowMs: 10 * 60 * 1000 // 10 minutes
                        }
                    },
                    logging: {
                        ...baseConfig.logging,
                        level: 'warn'
                    }
                };
                
            case 'test':
                return {
                    ...baseConfig,
                    jwt: {
                        ...baseConfig.jwt,
                        secret: 'test-secret-key',
                        expiry: '1h'
                    },
                    security: {
                        ...baseConfig.security,
                        bcryptRounds: 4, // Faster for tests
                        rateLimit: {
                            ...baseConfig.security.rateLimit,
                            maxAttempts: 10, // More lenient for tests
                            windowMs: 60 * 1000 // 1 minute
                        }
                    },
                    logging: {
                        ...baseConfig.logging,
                        level: 'error'
                    }
                };
                
            default: // development
                return baseConfig;
        }
    }

    /**
     * Gets a configuration value by key path
     * @param {string} keyPath - Dot-separated key path (e.g., 'jwt.secret')
     * @returns {*} Configuration value
     */
    get(keyPath) {
        return keyPath.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    /**
     * Gets the entire configuration object
     * @returns {Object} Configuration object
     */
    getAll() {
        return this.config;
    }

    /**
     * Gets the current environment
     * @returns {string} Environment name
     */
    getEnvironment() {
        return this.environment;
    }

    /**
     * Checks if running in production
     * @returns {boolean} True if production environment
     */
    isProduction() {
        return this.environment === 'production';
    }

    /**
     * Checks if running in development
     * @returns {boolean} True if development environment
     */
    isDevelopment() {
        return this.environment === 'development';
    }

    /**
     * Checks if running in test
     * @returns {boolean} True if test environment
     */
    isTest() {
        return this.environment === 'test';
    }
}

module.exports = ConfigService;