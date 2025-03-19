import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
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
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1">SQL Editor</Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          defaultValue={defaultQuery}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </Box>
    </Paper>
  );
};

export default SQLEditor;
