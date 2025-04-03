# Interactive SQL Playground

An interactive web application for learning and practicing SQL commands with real-time visual feedback. This platform provides an engaging environment for students and developers to learn SQL through hands-on practice and visual demonstrations.

## Features

- **Interactive SQL Editor**
  - Real-time query execution
  - Error detection and suggestions
  - Query history and favorites
  - Syntax highlighting and auto-completion (Future Update)

- **Visual Learning Tools**
  - Real-time database schema visualization
  - Animated SQL join demonstrations
  - Query execution plan visualization
  - Table relationship diagrams

- **Learning Resources**
  - Interactive tutorials for SQL concepts
  - Built-in examples and exercises
  - Progress tracking and achievements
  - Step-by-step guided lessons

- **Collaboration Features**
  - Save and share queries with others
  - Export/import database schemas
  - Collaborative workspaces
  - Community-driven examples

- **User Experience**
  - Modern, responsive interface
  - Dark/Light theme support
  - Keyboard shortcuts
  - Mobile-friendly design

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

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd sql-playground
```

2. Install dependencies:
```bash
npm install
cd client
npm install
cd ..
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
SESSION_SECRET=my_session_secret
FIREBASE_API_KEY=my_firebase_api_key
FIREBASE_AUTH_DOMAIN=my_firebase_auth_domain
FIREBASE_PROJECT_ID=my_firebase_project_id
```

4. Start the development server:
```bash
npm run dev:full
```

This will start both the backend server and frontend development server concurrently.

## Project Structure

```
sql-playground/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript type definitions
│   │   └── styles/       # CSS and theme files
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware
│   └── utils/           # Utility functions
├── database/            # SQLite database files
└── public/             # Static assets
```

## Development Scripts

- `npm start` - Start the backend server
- `npm run dev` - Start the backend server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev:full` - Start both frontend and backend concurrently

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed.