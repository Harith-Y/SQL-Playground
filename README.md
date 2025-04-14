# SQL Playground 🚀

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.6.0-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

A modern, interactive SQL learning and practice environment built with React, TypeScript, and Firebase. SQL Playground provides a comprehensive platform for learning, practicing, and mastering SQL through an intuitive interface and real-time feedback.

![SQL Playground Screenshot](client/public/logo512.png)

## ✨ Features

### Core Features
- **Interactive SQL Editor**
  - Monaco Editor integration for a professional coding experience
  - Syntax highlighting and auto-completion
  - Query execution with real-time results
  - Error handling and validation

- **Schema Visualization**
  - Interactive database schema viewer
  - Table structure visualization
  - Relationship mapping
  - Schema import/export functionality

- **Query Management**
  - Save and organize your SQL queries
  - Query history tracking
  - Favorite queries for quick access
  - Query sharing capabilities

### Learning Tools
- **Tutorials**
  - Structured learning paths
  - Interactive lessons
  - Progress tracking
  - Hands-on exercises

- **Challenges**
  - Real-world SQL problems
  - Difficulty levels (Beginner to Advanced)
  - Solution validation
  - Performance metrics

### User Experience
- **Customizable UI**
  - User-specific theme customization
  - Dark/Light mode support
  - Custom color schemes
  - Responsive design

- **Authentication**
  - Secure user authentication
  - Email/password login
  - Password reset functionality
  - Account management
  - Email verification requirement
    - Users must verify their email before accessing protected routes
    - Verification email sent upon registration
    - Option to resend verification email
    - Automatic redirection to verification page for unverified users

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with TypeScript
- **UI Components**: Material-UI (MUI) v5
- **Code Editor**: Monaco Editor
- **Data Visualization**: D3.js
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: Firebase Authentication
- **Session Management**: Express Session
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Harith-Y/SQL-Playground.git
cd SQL-Playground
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Configure Firebase
- Create a new Firebase project
- Enable Authentication and Firestore
- Add your Firebase configuration to `client/src/services/firebase.ts`

4. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
PORT=3001
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

For the client application, create a `.env` file in the `client` directory with the following variables:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
# For development: http://localhost:5000
# For production: your_vercel_deployment_url
REACT_APP_API_BASE_URL=your_api_base_url
```

5. Start the development servers
```bash
# Start both frontend and backend concurrently
npm run dev:full

# Or start them separately
npm run dev        # Backend server
npm run client     # Frontend server
```

## 📁 Project Structure

```
sql-playground/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Theme context
│   │   ├── services/      # Backend Services
│   │   └── types/         # TypeScript type definitions
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   └── config/           # Database configuration
├── database/             # SQLite database files
└── .env                  # Environment variables
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/reset-password` - Reset password

### Query Endpoints
- `POST /api/queries/execute` - Execute SQL query
- `GET /api/queries/history` - Get query history
- `POST /api/queries/save` - Save a query
- `DELETE /api/queries/:id` - Delete a saved query

## Development Scripts

- `npm start` - Start the backend server
- `npm run dev` - Start the backend server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev:full` - Start both frontend and backend concurrently

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests. Our project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📝 License

This project is licensed - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)
- [D3.js](https://d3js.org/)
- [Framer Motion](https://www.framer.com/motion/)

## 📞 Contact

Harith Yerragolam - [@harith-yerragolam](https://www.linkedin.com/in/harith-yerragolam-617486288/)

Project Link: [https://github.com/Harith-Y/SQL-Playground](https://github.com/Harith-Y/SQL-Playground)