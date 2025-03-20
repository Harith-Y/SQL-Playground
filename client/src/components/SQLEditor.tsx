import React, { useEffect, useRef } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import Editor from '@monaco-editor/react';

interface SQLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
  onExecuteQuery: (query: string) => void;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange, isLoading, onExecuteQuery }) => {
  const defaultQuery = `-- Write your SQL query here
SELECT * FROM users;`;

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    // Listen for custom execute-query events
    const handleExecuteQuery = (event: any) => {
      const { query } = event.detail;
      if (query && editorRef.current) {
        editorRef.current.setValue(query);
        onExecuteQuery(query);
      }
    };

    const editorElement = document.querySelector('.monaco-editor');
    if (editorElement) {
      editorElement.addEventListener('execute-query', handleExecuteQuery);
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener('execute-query', handleExecuteQuery);
      }
    };
  }, [onExecuteQuery]);

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
          onMount={handleEditorDidMount}
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
