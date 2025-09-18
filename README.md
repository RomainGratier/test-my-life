# Authentication Challenge for Software Engineers

**Time Allotment:** Approximately 2 hours

## Introduction

This challenge is designed to assess your skills in React, CSS, and SQL, focusing on a common and critical aspect of web applications: user authentication. You will be tasked with building a minimalist authentication system from the ground up, covering both the frontend user interface and the backend data persistence.

The goal is to demonstrate your ability to integrate these technologies, write clean and secure code, and think critically about best practices, especially concerning security. While AI tools can assist, this challenge is structured to require genuine understanding and thoughtful implementation beyond simple code generation.

## Goal

Your primary objective is to create a functional web application that allows users to:
1.  Register for a new account.
2.  Log in with existing credentials.
3.  Access a protected "Dashboard" page only when authenticated.
4.  Log out securely.

You will need to set up both a React frontend and a simple backend with a SQL database.

## Technologies

*   **Frontend:** React (with React Router for navigation)
*   **Styling:** Pure CSS (or a preprocessor like SASS/LESS if preferred, but no UI frameworks like Bootstrap/Material-UI)
*   **Backend:** Your choice (e.g., Node.js with Express, Python with Flask, Go with Gin, Ruby on Rails API).
*   **Database:** SQL (e.g., SQLite, PostgreSQL, MySQL – SQLite is often simplest for local setup)

## Starting Point

You are starting with an empty project. You will need to initialize your React application, set up your backend server, and define your database schema.

## Challenge Tasks

### 1. Backend & Database Setup (SQL Focus)

*   **Database Schema:** Design and implement a SQL database schema for `users`. At a minimum, this table should include:
    *   `id` (Primary Key, unique identifier)
    *   `username` (Unique, required)
    *   `password_hash` (Required, store securely)
    *   `salt` (Required, for password hashing)
    *   `created_at` (Timestamp)
*   **API Endpoints:** Implement the following RESTful API endpoints:
    *   `POST /api/register`: Creates a new user. Hash passwords using `bcrypt` (or similar strong hashing algorithm) and securely store the `password_hash` and `salt`.
    *   `POST /api/login`: Authenticates a user. Compare provided password with stored hash. If successful, issue a JSON Web Token (JWT).
    *   `GET /api/user`: A protected endpoint that returns information about the currently authenticated user (e.g., `id`, `username`). This endpoint should require a valid JWT.
    *   `POST /api/logout`: Invalidates or clears the authentication token on the client side.
*   **Security:**
    *   Implement robust password hashing.
    *   Prevent SQL injection vulnerabilities using prepared statements or an ORM.
    *   Consider a basic rate-limiting mechanism for login attempts.

### 2. React Frontend (React Focus)

*   **Project Setup:** Initialize a new React project (e.g., using `create-react-app` or Vite).
*   **Components:**
    *   **Login Form:** A component with username and password input fields and a submit button.
    *   **Registration Form:** A component with username, password, and confirm password fields, and a submit button.
    *   **Dashboard Page:** A simple page displaying a "Welcome, [Username]!" message and a logout button. This page must only be accessible to authenticated users.
    *   **Navigation:** Implement basic navigation using React Router DOM.
*   **Authentication Flow:**
    *   On successful login/registration, store the JWT (access token) securely and redirect the user to the Dashboard.
    *   On logout, clear the token and redirect to the login page.
    *   Implement a mechanism to check authentication status and protect the Dashboard route.
*   **Error Handling:** Display meaningful error messages to the user for failed login/registration attempts (e.g., "Invalid credentials", "Username already taken").

### 3. Styling & User Experience (CSS Focus)

*   **Responsive Design:** Ensure the Login/Registration forms and Dashboard are responsive and look good on both desktop and mobile screens. Use modern CSS techniques (Flexbox, Grid).
*   **Theming:** Implement a simple but consistent visual theme. Choose 2-3 primary colors and apply them consistently to buttons, inputs, and backgrounds.
*   **Form Layout:** Arrange form elements clearly and intuitively. Add appropriate spacing and alignment.
*   **Interactive Elements:** Style buttons with hover/active states. Add focus styles for input fields.
*   **Custom Component Styling:** Create a custom button component and apply specific styling that requires careful CSS (e.g., a gradient background, a subtle border-radius, and a specific shadow effect on hover).

## Specific Considerations & Hidden "Gotchas" (Refer to `knowledge.yaml`)

Pay close attention to the `knowledge.yaml` file. It contains crucial details and specific requirements that often get overlooked or mishandled in typical implementations. These details are designed to test your attention to detail and understanding of secure and robust system design.

## Deliverables

Submit a link to a Git repository containing your completed challenge. The repository should include:
*   All source code for both frontend and backend.
*   A clear `README.md` explaining how to set up and run your application, including any specific dependencies or commands.
*   Any database migration scripts or setup instructions.

## Evaluation Criteria

Your solution will be evaluated based on:
*   **Functionality:** Does the application meet all the requirements?
*   **Code Quality:** Readability, maintainability, adherence to best practices, clean architecture.
*   **Security:** Proper handling of passwords, tokens, SQL injection prevention, rate limiting.
*   **Frontend UX/UI:** Responsiveness, aesthetic appeal, ease of use.
*   **SQL Knowledge:** Appropriate schema design, efficient queries, proper indexing (if applicable).
*   **Problem Solving:** How well you tackled any challenges or edge cases.
*   **Attention to Detail:** How well you incorporated the requirements from `knowledge.yaml`.

Good luck!