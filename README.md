# SQL Playground

A modern, interactive SQL learning and practice environment built with React, TypeScript, and Firebase.

![SQL Playground Screenshot](client/public/logo512.png)

## Features

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

### Advanced Features
- **Query Visualization**
  - Visual representation of query execution
  - Performance analysis
  - Query optimization suggestions
  - Execution plan visualization

- **Data Import/Export**
  - CSV/JSON data import
  - Query result export
  - Schema migration tools
  - Backup and restore functionality

## Tech Stack

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

### Development Tools
- **Package Manager**: npm
- **Development Server**: Concurrent execution of frontend and backend
- **Environment Management**: dotenv
- **Code Quality**: ESLint
- **Testing**: React Testing Library, Jest

## Getting Started

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
cd client
npm install
```

3. Configure Firebase
- Create a new Firebase project
- Enable Authentication and Firestore
- Add your Firebase configuration to `client/src/services/firebase.ts`

4. Start the development server
```bash
npm start
```

## Project Structure

```
sql-playground/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Theme contet
│   │   ├── services/      # Backend Services
│   │   └── types/        # TypeScript type definitions
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   └── config/           # Database configuration
├── database/            # SQLite database files
```

## Development Scripts

- `npm start` - Start the backend server
- `npm run dev` - Start the backend server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev:full` - Start both frontend and backend concurrently

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project, **SQL Playground**, was created by **Harith Yerragolam**.
<br><br>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:
<br>
<ul style="list-style-type:none;">
  <li>The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.</li>
</ul>
<br>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.


## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Material-UI](https://mui.com/)
- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)

## Contact

Harith Yerragolam - [@harith-yerragolam](https://www.linkedin.com/in/harith-yerragolam-617486288/)

Project Link: [https://github.com/Harith-Y/SQL-Playground](https://github.com/Harith-Y/SQL-Playground)