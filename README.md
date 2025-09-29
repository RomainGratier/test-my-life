# Enterprise Authentication Challenge 🚀

Welcome to the **Enterprise Authentication Challenge**! This is a comprehensive full-stack development assessment that tests your ability to implement production-ready authentication systems with enterprise-grade security requirements.

## 🎯 Challenge Overview

You are tasked with implementing a complete authentication system that meets enterprise security standards. This challenge evaluates your skills in:

- **Security Implementation** (40% of evaluation)
- **CSS Styling & UI/UX** (25% of evaluation) 
- **Code Architecture** (20% of evaluation)
- **Functionality & Edge Cases** (15% of evaluation)

## 🏗️ Current Implementation Status

This repository contains a **partially implemented** authentication system. Your task is to complete the missing features and ensure all requirements are met.

### ✅ What's Already Implemented
- Basic Express.js backend with authentication routes
- JWT token generation and verification
- bcrypt password hashing
- Basic frontend with login/register forms
- CORS configuration
- Basic error handling

### ❌ What You Need to Implement
- **Enterprise password policies** (12+ chars, complexity requirements)
- **Advanced CSS styling** (gradient buttons, card layouts, responsive design)
- **Comprehensive input validation** (client & server-side)
- **Rate limiting** and security enhancements
- **CSS Grid layout** for main application structure
- **Custom animations** and improved UX
- **Production-ready error handling**

## 📋 Detailed Requirements

### 🔐 Security Requirements

#### Password Policies
- **Minimum 12 characters**
- **Must contain uppercase letters**
- **Must contain lowercase letters** 
- **Must contain numbers**
- **Must contain special characters** (!@#$%^&*())
- **Prevent common passwords** (password, 123456, etc.)
- **Enforce on both client and server side**

#### Token Management
- **Short-lived access tokens** (15-30 minutes recommended)
- **Proper token storage** (localStorage or memory)
- **Refresh token strategy awareness** (HTTP-only cookies for long-lived tokens)
- **JWT secret from environment variables** (never hardcoded)

#### Security Features
- **Rate limiting**: Max 5 login attempts per 5-minute window per IP
- **SQL injection prevention**: Use parameterized queries
- **Comprehensive input validation** with regex patterns
- **Proper HTTP status codes** (400, 401, 403, 404, 409, 500)

### 🎨 CSS & Styling Requirements

#### Form Card Layout
- **Desktop**: Centered vertically and horizontally, max-width 400px
- **Mobile**: 95% viewport width, fluid height with auto padding

#### Button Styling
- **Linear gradient background**
- **Subtle box-shadow on hover**
- **transform: translateY(-2px) on hover**

#### Input Fields
- **Custom focus ring color** (distinct from browser default)
- **1px solid border** that changes color on focus

#### Layout & Animations
- **CSS Grid** for main layout (header, content, footer)
- **Dashboard welcome animation**: Fade in and slide up from bottom
- **Responsive design** for all screen sizes

### 🏛️ Architecture Requirements

#### Frontend
- **Client-side form validation** before server requests
- **Server-side validation** as ultimate source of truth
- **CSS Grid** for main application layout
- **Modular component structure**

#### Backend
- **Unique username index** for performance and integrity
- **TEXT(72) password hash column** for bcrypt compatibility
- **Consistent JSON error responses**
- **Proper HTTP status codes**
- **Environment variable configuration**

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env file in backend directory
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=8080
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** to `http://localhost:8080`

## 📁 Project Structure

```
├── backend/
│   ├── routes/
│   │   └── auth.js          # Authentication routes
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── script.js            # Frontend JavaScript
│   └── style.css            # CSS styles
├── codefolio.json           # Challenge metadata
├── knowledge.yaml           # Detailed requirements
└── README.md               # This file
```

## 🧪 Testing Your Implementation

### Manual Testing Checklist
- [ ] Password requirements enforced (12+ chars, complexity)
- [ ] Forms validate input before submission
- [ ] Responsive design works on mobile/desktop
- [ ] Gradient buttons with hover effects
- [ ] Custom focus rings on inputs
- [ ] CSS Grid layout structure
- [ ] Dashboard welcome animation
- [ ] Error handling with proper status codes
- [ ] Token management and storage
- [ ] Rate limiting awareness

### API Endpoints to Test
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication  
- `GET /auth/profile` - Protected user profile
- `POST /auth/verify` - Token verification

## 📊 Evaluation Criteria

Your implementation will be evaluated on:

1. **Security Implementation Quality (40%)**
   - Password policy enforcement
   - Token handling and storage
   - Input validation completeness
   - Error handling and status codes

2. **CSS and Styling (25%)**
   - Card layout implementation
   - Button styling and animations
   - Responsive design
   - Custom focus rings and animations

3. **Code Architecture (20%)**
   - Modular structure
   - Error handling patterns
   - API design consistency
   - Best practices adherence

4. **Functionality (15%)**
   - Complete authentication flow
   - User experience quality
   - Edge case handling
   - Performance considerations

## 💡 Tips for Success

- **Read the requirements carefully** - Each detail matters for evaluation
- **Implement both client and server validation** - Security is paramount
- **Focus on user experience** - Smooth animations and responsive design
- **Test edge cases** - Empty inputs, invalid tokens, network errors
- **Follow security best practices** - Never hardcode secrets, validate everything
- **Pay attention to CSS details** - Specific styling requirements are evaluated

## 🆘 Need Help?

- Check `knowledge.yaml` for detailed technical requirements
- Review the existing code to understand the current implementation
- Test your implementation thoroughly before submission
- Ensure all security requirements are met

---

**Good luck! Show us your full-stack development skills! 🎉**