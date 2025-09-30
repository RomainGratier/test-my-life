document.addEventListener('DOMContentLoaded', () => {
    console.log('Frontend script loaded!');

    const messageElement = document.getElementById('message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const API_BASE_URL = window.location.origin; // This assumes backend serves frontend, adjust if different ports/domains

    // Helper function to display messages with animations
    function displayMessage(msg, type = 'info') {
        messageElement.textContent = msg;
        messageElement.className = `${type} message-slide-in`;
        
        // Add specific animations based on message type
        if (type === 'success') {
            messageElement.classList.add('success-pulse');
        } else if (type === 'error') {
            messageElement.classList.add('error-shake');
        }
        
        // Clear animations after they complete
        setTimeout(() => {
            messageElement.classList.remove('message-slide-in', 'success-pulse', 'error-shake');
        }, 600);
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
        // Store original button text
        const loginButton = loginForm.querySelector('button[type="submit"]');
        loginButton.dataset.originalText = loginButton.textContent;
        
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

            // Set loading state
            setFormLoading(loginForm, true);
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
            } finally {
                // Clear loading state
                setFormLoading(loginForm, false);
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

    // Real-time input validation with visual feedback
    function setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateSingleInput(this);
            });
            
            input.addEventListener('input', function() {
                // Clear error state on input
                this.classList.remove('input-error');
            });
        });
    }

    // Validate individual input field
    function validateSingleInput(input) {
        const value = input.value.trim();
        const isPassword = input.type === 'password';
        const isUsername = input.name === 'username' || input.id.includes('username');
        
        let errors = [];
        
        if (isUsername) {
            errors = validateUsername(value);
        } else if (isPassword) {
            errors = validatePassword(value);
        }
        
        // Update visual state
        if (errors.length > 0) {
            input.classList.add('input-error');
            input.classList.remove('input-success');
        } else if (value.length > 0) {
            input.classList.add('input-success');
            input.classList.remove('input-error');
        } else {
            input.classList.remove('input-error', 'input-success');
        }
        
        // Update accessibility help text
        updateFieldHelp(input, errors);
        
        return errors.length === 0;
    }

    // Update field help text for accessibility
    function updateFieldHelp(input, errors) {
        const helpId = input.getAttribute('aria-describedby');
        if (!helpId) return;
        
        const helpElement = document.getElementById(helpId.split(' ')[0]);
        if (!helpElement) return;
        
        if (errors.length > 0) {
            helpElement.textContent = errors[0];
            helpElement.className = 'field-help error';
        } else if (input.value.trim().length > 0) {
            helpElement.textContent = '✓ Valid';
            helpElement.className = 'field-help success';
        } else {
            helpElement.textContent = '';
            helpElement.className = 'field-help';
        }
    }

    // Enhanced form submission with loading states
    function setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input');
        
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            inputs.forEach(input => input.disabled = true);
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = submitButton.dataset.originalText || 'Submit';
            inputs.forEach(input => input.disabled = false);
        }
    }

    // Register functionality
    if (registerForm) {
        // Store original button text
        const registerButton = registerForm.querySelector('button[type="submit"]');
        registerButton.dataset.originalText = registerButton.textContent;
        
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

            // Set loading state
            setFormLoading(registerForm, true);
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
            } finally {
                // Clear loading state
                setFormLoading(registerForm, false);
            }
        });
    }

    // Initialize real-time validation
    setupRealTimeValidation();
});