# Interactive SQL Playground

An interactive web application for learning and practicing SQL commands with real-time visual feedback.

## Features

- Write and execute SQL queries in a browser-based interface
- Visualize database schema changes in real-time
- See query results displayed in tables with visual highlighting
- Interactive tutorials explaining SQL concepts
- Animated visualization of SQL joins and relationships
- Save and share queries and database schemas with other students

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: SQLite
- UI Components: Material-UI
- Visualization: D3.js for SQL animations

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

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
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   └── utils/           # Utility functions
└── database/            # SQLite database files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed.