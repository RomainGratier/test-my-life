# Authentication System Guide

## Overview

This authentication system has been significantly improved with proper security practices, including password hashing, JWT tokens, input validation, and protected routes.

## Features

### Security Improvements
- **Password Hashing**: Uses bcrypt with 12 salt rounds for secure password storage
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Input Validation**: Comprehensive validation for usernames and passwords
- **Protected Routes**: Middleware to protect sensitive endpoints
- **Error Handling**: Proper error responses without exposing sensitive information

### API Endpoints

#### Public Endpoints

**POST /auth/register**
- Registers a new user
- Validates input (username: 3-20 chars, alphanumeric + underscore; password: 6-100 chars)
- Hashes password with bcrypt
- Returns user ID and username on success

**POST /auth/login**
- Authenticates user credentials
- Compares hashed password
- Returns JWT token and user info on success

**POST /auth/verify**
- Verifies JWT token validity
- Returns user information if token is valid

#### Protected Endpoints

**GET /auth/profile**
- Requires valid JWT token in Authorization header
- Returns user profile information
- Protected by authentication middleware

## Frontend Features

### Token Management
- Automatic token storage in localStorage
- Token validation on page load
- Automatic logout on token expiration

### User Interface
- Dynamic user interface showing login status
- Profile access button for authenticated users
- Logout functionality
- Improved error message display

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update `JWT_SECRET` with a secure random string
   - Adjust `PORT` if needed

3. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:8080
   - API: http://localhost:8080/auth/...

## Testing the System

### Registration
1. Open the frontend
2. Fill in registration form with valid credentials
3. Username must be 3-20 characters (letters, numbers, underscore only)
4. Password must be 6-100 characters

### Login
1. Use registered credentials to log in
2. Token will be automatically stored
3. User interface will show profile options

### Protected Routes
1. After login, click "Get Profile" to test protected endpoint
2. Token is automatically included in requests
3. Try accessing profile without token to see error handling

## Security Considerations

### Production Deployment
- Change default JWT secret in `.env`
- Use HTTPS in production
- Implement rate limiting
- Add database persistence
- Use environment-specific configurations
- Implement proper logging and monitoring

### Password Security
- Passwords are hashed with bcrypt (12 rounds)
- No plain text passwords are stored
- Input validation prevents common attacks

### Token Security
- JWT tokens expire after 24 hours
- Tokens are stored securely in localStorage
- Proper token validation on all protected routes

## Code Structure

### Backend (`/backend/routes/auth.js`)
- User storage (in-memory Map)
- Password hashing with bcrypt
- JWT token generation and validation
- Input validation functions
- Authentication middleware
- Protected route handlers

### Frontend (`/frontend/script.js`)
- Token management functions
- Authenticated request helpers
- User interface management
- Automatic authentication checking
- Error handling and user feedback

## Error Handling

The system provides comprehensive error handling:
- Validation errors with specific field requirements
- Authentication errors without exposing sensitive information
- Network error handling in frontend
- Proper HTTP status codes
- User-friendly error messages

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- Password reset functionality
- Email verification
- Role-based access control
- Session management
- Rate limiting
- Audit logging