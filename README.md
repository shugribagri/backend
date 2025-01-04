# Member Management System

## Overview

This project is a **Full-Stack Member Management System** designed using the MERN stack. The system features:

- Secure user registration and login.
- CRUD operations on member profiles with associated roles.
- Profile picture uploads.
- A responsive user interface built with React and Tailwind CSS.
- A robust backend powered by Node.js, Express, and SQLite.
- Features like pagination, sorting, filtering, and a dashboard with statistical summaries.

## Features

- User Authentication:
  - Secure registration and login using JWT.
  - Pre-configured admin account.
- Member Management:
  - CRUD operations for member profiles.
  - Role-based access control.
  - Profile picture uploads.
- Dashboard:
  - Statistical summaries of users and activities.
  - Advanced filtering, sorting, and pagination.
- Backend:
  - SQLite database with normalized tables.
  - Predefined roles and activity logs seeded automatically.
- Frontend:
  - Responsive UI using React, Tailwind CSS, and React Router.
  - Protected routes with state management using Context API.

---

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/jackjavi/Member-Management_System.git
cd Member-Management_System
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```
4. Fill in the required environment variables in the `.env` file:

   - `JWT_SECRET` - Secret for signing JWT tokens.
   - `ADMIN_EMAIL` - Email for the default admin user.
   - `ADMIN_PASSWORD` - Password for the default admin user.

5. Run Sequelize migrations to set up the database:

   ```bash
   npx sequelize-cli db:migrate
   ```

6. Seed 50 test users and their associated actions:

   ```bash
   npm run seed
   ```

   **Note**: Raw passwords for seeded users will be logged in the console.

7. Start the backend server:
   ```bash
    npm start
   ```
   **Note**: The backend will run on `http://localhost:5000` by default.
