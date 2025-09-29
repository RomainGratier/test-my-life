/**
 * ValidationService - Handles input validation for authentication
 */
class ValidationService {
    /**
     * Validates username and password input
     * @param {string} username - The username to validate
     * @param {string} password - The password to validate
     * @returns {Array} Array of validation error messages
     */
    static validateInput(username, password) {
        const errors = [];
        
        // Username validation
        errors.push(...this.validateUsername(username));
        
        // Password validation
        errors.push(...this.validatePassword(password));
        
        return errors;
    }

    /**
     * Validates username format and requirements
     * @param {string} username - The username to validate
     * @returns {Array} Array of validation error messages
     */
    static validateUsername(username) {
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
        
        return errors;
    }

    /**
     * Validates password format and complexity requirements
     * @param {string} password - The password to validate
     * @returns {Array} Array of validation error messages
     */
    static validatePassword(password) {
        const errors = [];
        
        if (!password || password.length === 0) {
            errors.push('Password is required');
        } else {
            // Length validation
            if (password.length < 12) {
                errors.push('Password must be at least 12 characters long');
            } else if (password.length > 100) {
                errors.push('Password must be less than 100 characters');
            }
            
            // Complexity validation
            errors.push(...this.validatePasswordComplexity(password));
            
            // Common password prevention
            errors.push(...this.validateAgainstCommonPasswords(password));
        }
        
        return errors;
    }

    /**
     * Validates password complexity requirements
     * @param {string} password - The password to validate
     * @returns {Array} Array of validation error messages
     */
    static validatePasswordComplexity(password) {
        const errors = [];
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*())');
        }
        
        return errors;
    }

    /**
     * Validates against common passwords
     * @param {string} password - The password to validate
     * @returns {Array} Array of validation error messages
     */
    static validateAgainstCommonPasswords(password) {
        const errors = [];
        const commonPasswords = [
            'password', '123456', 'password123', 'admin', 'qwerty',
            'letmein', 'welcome', 'monkey', '1234567890', 'abc123',
            'password1', '123123', 'dragon', 'master', 'hello'
        ];
        
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('Password is too common. Please choose a more secure password');
        }
        
        return errors;
    }
}

module.exports = ValidationService;