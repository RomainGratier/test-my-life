const bcrypt = require('bcrypt');
const DatabaseService = require('./DatabaseService');
const ConfigService = require('./ConfigService');

/**
 * UserService - Handles user data operations and storage
 */
class UserService {
    constructor() {
        this.database = new DatabaseService();
        this.config = new ConfigService();
    }

    /**
     * Creates a new user with hashed password
     * @param {string} username - The username
     * @param {string} password - The plain text password
     * @returns {Promise<Object>} The created user object
     */
    async createUser(username, password) {
        const saltRounds = this.config.get('security.bcryptRounds');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const userId = `user-${Date.now()}`;
        const user = {
            id: userId,
            username: username.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        return await this.database.createUser(user);
    }

    /**
     * Finds a user by username
     * @param {string} username - The username to search for
     * @returns {Object|null} The user object or null if not found
     */
    async findUserByUsername(username) {
        return await this.database.findUserByUsername(username.toLowerCase());
    }

    /**
     * Checks if a user exists
     * @param {string} username - The username to check
     * @returns {Promise<boolean>} True if user exists, false otherwise
     */
    async userExists(username) {
        return await this.database.userExists(username.toLowerCase());
    }

    /**
     * Verifies a user's password
     * @param {string} password - The plain text password
     * @param {string} hashedPassword - The hashed password to compare against
     * @returns {Promise<boolean>} True if password is valid, false otherwise
     */
    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Gets user profile data (without sensitive information)
     * @param {string} username - The username
     * @returns {Object|null} User profile or null if not found
     */
    async getUserProfile(username) {
        const user = await this.findUserByUsername(username);
        if (!user) {
            return null;
        }
        
        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
        };
    }

    /**
     * Gets all users (for debugging purposes)
     * @returns {Promise<Array>} Array of user profiles
     */
    async getAllUsers() {
        const users = await this.database.getAllUsers();
        return users.map(user => ({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
        }));
    }
}

module.exports = UserService;