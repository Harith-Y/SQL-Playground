import React, { useRef, useEffect, useState } from 'react';
import { Paper, Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { PlayArrow, History, Star, StarBorder, BookmarkBorder } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import QueryHistory from './QueryHistory';
import SavedQueries from './SavedQueries';
import axios from 'axios';
import { auth } from '../services/firebase';
import { useTheme } from '../contexts/ThemeContext';

interface SQLEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  isLoading: boolean;
  onExecuteQuery: (query: string) => void;
  readOnly?: boolean;
  onQueriesLoad?: (queries: { title: string; query: string; }[]) => void;
}

const SQLEditor: React.FC<SQLEditorProps> = ({
  value,
  onChange,
  isLoading,
  onExecuteQuery,
  readOnly = false,
  onQueriesLoad,
}) => {
  const { currentTheme } = useTheme();
  const defaultQuery = `-- Write your SQL query here
SELECT * FROM users;`;

  const editorRef = useRef<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [queryTitle, setQueryTitle] = useState('');

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

  const handleSavedQuerySelect = (query: string) => {
    if (editorRef.current) {
      editorRef.current.setValue(query);
    }
    setSavedQueriesOpen(false);
  };

  const handleSaveQuery = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to save queries');
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
    setQueryTitle('');
  };

  const handleSaveDialogConfirm = async () => {
    if (queryTitle.trim() && value.trim()) {
      const user = auth.currentUser;
      if (!user) {
        alert('Please log in to save queries');
        return;
      }

      try {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/saved-queries`, {
          userId: user.uid,
          title: queryTitle.trim(),
          query: value.trim()
        });
        setSaveDialogOpen(false);
        setQueryTitle('');
      } catch (error) {
        console.error('Error saving query:', error);
        alert('Failed to save query');
      }
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: currentTheme.colors.editor,
        }}
      >
        <Box sx={{ 
          p: 1, 
          borderBottom: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <Typography variant="subtitle2">SQL Editor</Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<StarBorder />}
              onClick={() => setSavedQueriesOpen(true)}
              disabled={isLoading || readOnly}
            >
              Saved
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<History />}
              onClick={() => setHistoryOpen(true)}
              disabled={isLoading || readOnly}
            >
              History
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<BookmarkBorder />}
              onClick={handleSaveQuery}
              disabled={isLoading || readOnly || !value.trim()}
            >
              Fav
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrow />}
              onClick={() => onExecuteQuery(value)}
              disabled={isLoading || readOnly}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
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
              lineNumbers: 'on',
              folding: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
        </Box>
      </Paper>
      <QueryHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectQuery={handleHistorySelect}
      />
      <SavedQueries
        open={savedQueriesOpen}
        onClose={() => setSavedQueriesOpen(false)}
        onSelectQuery={handleSavedQuerySelect}
      />
      <Dialog open={saveDialogOpen} onClose={handleSaveDialogClose}>
        <DialogTitle>Save Query</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Query Title"
            fullWidth
            value={queryTitle}
            onChange={(e) => setQueryTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose}>Cancel</Button>
          <Button onClick={handleSaveDialogConfirm} variant="contained" disabled={!queryTitle.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SQLEditor;
