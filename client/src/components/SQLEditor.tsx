import React from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';

interface SQLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange, isLoading }) => {
  const defaultQuery = `-- Write your SQL query here
SELECT * FROM users;`;

  return (
    <Paper sx={{ 
      flexGrow: 1, 
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1">SQL Editor</Typography>
        {isLoading && <CircularProgress size={20} />}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={value || defaultQuery}
          theme="vs-dark"
          onChange={onChange}
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
