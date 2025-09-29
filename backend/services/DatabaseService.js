const ConfigService = require('./ConfigService');

/**
 * DatabaseService - Abstract database layer supporting multiple backends
 */
class DatabaseService {
    constructor() {
        this.config = new ConfigService();
        this.dbType = this.config.get('database.type');
        this.storage = this.initializeStorage();
    }

    /**
     * Initializes the appropriate storage backend
     * @returns {Object} Storage instance
     */
    initializeStorage() {
        switch (this.dbType) {
            case 'postgresql':
                return this.initializePostgreSQL();
            case 'mongodb':
                return this.initializeMongoDB();
            case 'memory':
            default:
                return this.initializeMemoryStorage();
        }
    }

    /**
     * Initializes in-memory storage (default)
     * @returns {Object} Memory storage instance
     */
    initializeMemoryStorage() {
        console.log('Using in-memory storage');
        return new Map();
    }

    /**
     * Initializes PostgreSQL storage (placeholder for future implementation)
     * @returns {Object} PostgreSQL storage instance
     */
    initializePostgreSQL() {
        console.log('PostgreSQL storage not yet implemented, falling back to memory storage');
        return new Map();
    }

    /**
     * Initializes MongoDB storage (placeholder for future implementation)
     * @returns {Object} MongoDB storage instance
     */
    initializeMongoDB() {
        console.log('MongoDB storage not yet implemented, falling back to memory storage');
        return new Map();
    }

    /**
     * Creates a new user record
     * @param {Object} userData - User data to store
     * @returns {Promise<Object>} Created user record
     */
    async createUser(userData) {
        if (this.dbType === 'memory') {
            this.storage.set(userData.username, userData);
            return userData;
        }
        
        // Placeholder for database implementations
        throw new Error(`createUser not implemented for ${this.dbType}`);
    }

    /**
     * Finds a user by username
     * @param {string} username - Username to search for
     * @returns {Promise<Object|null>} User record or null
     */
    async findUserByUsername(username) {
        if (this.dbType === 'memory') {
            return this.storage.get(username) || null;
        }
        
        // Placeholder for database implementations
        throw new Error(`findUserByUsername not implemented for ${this.dbType}`);
    }

    /**
     * Updates a user record
     * @param {string} username - Username to update
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated user record or null
     */
    async updateUser(username, updateData) {
        if (this.dbType === 'memory') {
            const user = this.storage.get(username);
            if (user) {
                const updatedUser = { ...user, ...updateData };
                this.storage.set(username, updatedUser);
                return updatedUser;
            }
            return null;
        }
        
        // Placeholder for database implementations
        throw new Error(`updateUser not implemented for ${this.dbType}`);
    }

    /**
     * Deletes a user record
     * @param {string} username - Username to delete
     * @returns {Promise<boolean>} True if deleted, false if not found
     */
    async deleteUser(username) {
        if (this.dbType === 'memory') {
            return this.storage.delete(username);
        }
        
        // Placeholder for database implementations
        throw new Error(`deleteUser not implemented for ${this.dbType}`);
    }

    /**
     * Gets all users (for debugging purposes)
     * @returns {Promise<Array>} Array of user records
     */
    async getAllUsers() {
        if (this.dbType === 'memory') {
            return Array.from(this.storage.values());
        }
        
        // Placeholder for database implementations
        throw new Error(`getAllUsers not implemented for ${this.dbType}`);
    }

    /**
     * Checks if a user exists
     * @param {string} username - Username to check
     * @returns {Promise<boolean>} True if user exists
     */
    async userExists(username) {
        if (this.dbType === 'memory') {
            return this.storage.has(username);
        }
        
        // Placeholder for database implementations
        throw new Error(`userExists not implemented for ${this.dbType}`);
    }

    /**
     * Gets database connection status
     * @returns {Promise<Object>} Connection status
     */
    async getConnectionStatus() {
        return {
            type: this.dbType,
            connected: true,
            environment: this.config.getEnvironment()
        };
    }

    /**
     * Closes database connection
     * @returns {Promise<void>}
     */
    async close() {
        if (this.dbType === 'memory') {
            this.storage.clear();
            return;
        }
        
        // Placeholder for database implementations
        console.log(`Closing ${this.dbType} connection`);
    }
}

module.exports = DatabaseService;