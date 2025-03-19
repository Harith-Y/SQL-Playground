import React from 'react';
import { Paper } from '@mui/material';

const SchemaViewer = () => {
  const [expandedTables, setExpandedTables] = React.useState<string[]>(['users']);

  // Example schema - this will be replaced with actual database schema when in production phase.
  const schema = {
    users: {
      columns: [
        { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY AUTOINCREMENT' },
        { name: 'username', type: 'TEXT', constraints: 'UNIQUE NOT NULL' },
        { name: 'email', type: 'TEXT', constraints: 'UNIQUE NOT NULL' },
        { name: 'password', type: 'TEXT', constraints: 'NOT NULL' },
      ],
    },
    saved_queries: {
      columns: [
        { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY AUTOINCREMENT' },
        { name: 'user_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
        { name: 'title', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'query', type: 'TEXT', constraints: 'NOT NULL' },
      ],
    },
  };

  const handleTableClick = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  return (
    <Paper sx={{ width: '50%', overflow: 'hidden' }}>
    
    </Paper>
  );
};

export default SchemaViewer;
