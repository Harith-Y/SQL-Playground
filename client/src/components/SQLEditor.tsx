import React, { useRef, useEffect, useState } from 'react';
import { Paper, Box, Typography, Button, CircularProgress } from '@mui/material';
import { PlayArrow, History } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import QueryHistory from './QueryHistory';

interface SQLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
  onExecuteQuery: (query: string) => void;
  readOnly?: boolean;
}

const SQLEditor: React.FC<SQLEditorProps> = ({
  value,
  onChange,
  isLoading,
  onExecuteQuery,
  readOnly = false,
}) => {
  const defaultQuery = `-- Write your SQL query here
SELECT * FROM users;`;

  const editorRef = useRef<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

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

  const handleHistorySelect = (query: string) => {
    if (editorRef.current) {
      editorRef.current.setValue(query);
    }
    setHistoryOpen(false);
  };

  return (
    <>
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">SQL Editor</Typography>
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<History />}
              onClick={() => setHistoryOpen(true)}
              disabled={isLoading || readOnly}
              sx={{ mr: 1 }}
            >
              History
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
              onClick={() => onExecuteQuery(value)}
              disabled={isLoading || readOnly}
            >
              Run Query
            </Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <Editor
            height="100%"
            defaultLanguage="sql"
            value={value || defaultQuery}
            onChange={onChange}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              readOnly,
            }}
          />
        </Box>
      </Paper>
      <QueryHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectQuery={handleHistorySelect}
      />
    </>
  );
};

export default SQLEditor;
