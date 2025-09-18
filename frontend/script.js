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

    // Login functionality
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target['login-username'].value;
            const password = event.target['login-password'].value;

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
                    displayMessage(`Login successful! Token: ${data.token}`, 'success');
                    // In a real app, you'd store the token (e.g., in localStorage)
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

    // Register functionality
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = event.target['register-username'].value;
            const password = event.target['register-password'].value;

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
                    displayMessage(`Registration successful! User ID: ${data.userId}`, 'success');
                    console.log('Registration successful:', data);
                } else {
                    displayMessage(`Registration failed: ${data.message || 'Unknown error'}`, 'error');
                    console.error('Registration failed:', data);
                }
            } catch (error) {
                displayMessage(`Network error during registration: ${error.message}`, 'error');
                console.error('Network error:', error);
            }
        });
    }
});