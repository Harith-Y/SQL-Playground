import React from 'react';
import { Paper } from '@mui/material';
import Editor from '@monaco-editor/react';

const SQLEditor = () => {
  const defaultQuery = `-- Write your SQL query here
SELECT * FROM users;`;

  return (
    <Paper sx={{ 
      flexGrow: 1, 
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>

    </Paper>
  );
};

export default SQLEditor;
