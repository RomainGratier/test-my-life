document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend script loaded!');

    const messageElement = document.getElementById('message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const API_BASE_URL = window.location.origin; // This assumes backend serves frontend, adjust if different ports/domains

    // Helper function to display messages
    function displayMessage(msg, type = 'info') {
        messageElement.textContent = msg;
        messageElement.className = type; // 'info', 'success', 'error'
    }

    // Helper function to get stored token
    function getStoredToken() {
        return localStorage.getItem('authToken');
    }

    // Helper function to store token
    function storeToken(token) {
        localStorage.setItem('authToken', token);
    }

    // Helper function to remove token
    function removeToken() {
        localStorage.removeItem('authToken');
    }

    // Helper function to make authenticated requests
    function makeAuthenticatedRequest(url, options = {}) {
        const token = getStoredToken();
        if (!token) {
            displayMessage('No authentication token found. Please log in.', 'error');
            return Promise.reject('No token');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        return fetch(url, {
            ...options,
            headers
        });
    }

    // Check if user is already logged in
    function checkAuthStatus() {
        const token = getStoredToken();
        if (token) {
            // Verify token is still valid
            fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    displayMessage(`Welcome back, ${data.user.username}!`, 'success');
                    // Show profile button or user info
                    showUserInterface(data.user);
                } else {
                    removeToken();
                    displayMessage('Session expired. Please log in again.', 'error');
                }
            })
            .catch(error => {
                console.error('Auth check failed:', error);
                removeToken();
            });
        }
    }

    // Show user interface elements
    function showUserInterface(user) {
        // Hide authentication forms
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.style.display = 'none';
        }
        
        // Show dashboard with animation
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            // Trigger animation by adding class
            const welcomeMessage = dashboard.querySelector('.welcome-message');
            if (welcomeMessage) {
                welcomeMessage.style.opacity = '0';
                welcomeMessage.style.transform = 'translateY(20px)';
                // Force reflow to ensure animation starts
                welcomeMessage.offsetHeight;
                welcomeMessage.style.animation = 'fadeInSlideUp 0.6s ease forwards';
            }
        }
        
        // Create or update user info display
        let userInfo = document.getElementById('user-info');
        if (!userInfo) {
            userInfo = document.createElement('div');
            userInfo.id = 'user-info';
            userInfo.style.marginTop = '20px';
            userInfo.style.padding = '10px';
            userInfo.style.backgroundColor = '#f0f0f0';
            userInfo.style.borderRadius = '5px';
            document.body.appendChild(userInfo);
        }
        
        userInfo.innerHTML = `
            <h3>Welcome, ${user.username}!</h3>
            <p>User ID: ${user.id}</p>
            <button onclick="getProfile()" style="margin-right: 10px;">Get Profile</button>
            <button onclick="logout()">Logout</button>
        `;
    }

    // Global functions for buttons
    window.getProfile = function() {
        makeAuthenticatedRequest(`${API_BASE_URL}/auth/profile`)
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    displayMessage(`Profile: ${data.user.username} (created: ${new Date(data.user.createdAt).toLocaleDateString()})`, 'success');
                } else {
                    displayMessage(data.message || 'Failed to get profile', 'error');
                }
            })
            .catch(error => {
                displayMessage('Failed to get profile', 'error');
                console.error('Profile error:', error);
            });
    };

    window.logout = function() {
        removeToken();
        displayMessage('Logged out successfully', 'success');
        
        // Hide dashboard and show auth forms
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
        }
        
        const authSection = document.querySelector('.auth-section');
        if (authSection) {
            authSection.style.display = 'block';
        }
        
        const userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.remove();
        }
    };

    // Check authentication status on page load
    checkAuthStatus();

    // Login functionality
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target['login-username'].value;
            const password = event.target['login-password'].value;

            // Client-side validation before server request
            const validationErrors = validateForm(username, password);
            if (validationErrors.length > 0) {
                displayMessage(`Validation failed: ${validationErrors.join(', ')}`, 'error');
                return;
            }

            displayMessage('Attempting login...', 'info');

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    storeToken(data.token);
                    displayMessage(`Login successful! Welcome, ${data.user.username}!`, 'success');
                    showUserInterface(data.user);
                    console.log('Login successful:', data);
                } else {
                    displayMessage(`Login failed: ${data.message || 'Unknown error'}`, 'error');
                    console.error('Login failed:', data);
                }
            } catch (error) {
                displayMessage(`Network error during login: ${error.message}`, 'error');
                console.error('Network error:', error);
            }
        });
    }

    // Comprehensive password validation with enterprise requirements
    function validatePassword(password) {
        const errors = [];
        
        if (!password || password.length === 0) {
            errors.push('Password is required');
            return errors;
        }
        
        // Length validation
        if (password.length < 12) {
            errors.push('Password must be at least 12 characters long');
        } else if (password.length > 100) {
            errors.push('Password must be less than 100 characters');
        }
        
        // Complexity validation
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
        
        // Common password prevention
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
    
    // Username validation
    function validateUsername(username) {
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
    
    // Complete form validation
    function validateForm(username, password) {
        const errors = [];
        errors.push(...validateUsername(username));
        errors.push(...validatePassword(password));
        return errors;
    }

    // Register functionality
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target['register-username'].value;
            const password = event.target['register-password'].value;

            // Client-side validation before server request
            const validationErrors = validateForm(username, password);
            if (validationErrors.length > 0) {
                displayMessage(`Validation failed: ${validationErrors.join(', ')}`, 'error');
                return;
            }

            displayMessage('Attempting registration...', 'info');

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    displayMessage(`Registration successful! You can now log in with username: ${data.username}`, 'success');
                    console.log('Registration successful:', data);
                } else {
                    if (data.errors && data.errors.length > 0) {
                        displayMessage(`Registration failed: ${data.errors.join(', ')}`, 'error');
                    } else {
                        displayMessage(`Registration failed: ${data.message || 'Unknown error'}`, 'error');
                    }
                    console.error('Registration failed:', data);
                }
            } catch (error) {
                displayMessage(`Network error during registration: ${error.message}`, 'error');
                console.error('Network error:', error);
            }
        });
    }
});