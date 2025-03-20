import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Box, Snackbar, Alert } from '@mui/material';
import Navbar from './components/Navbar';
import SQLEditor from './components/SQLEditor';
import ResultsPanel from './components/ResultsPanel';
import SchemaViewer from './components/SchemaViewer';
import { executeQuery, QueryResult } from './services/api';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

function App() {
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = (value: string | undefined) => {
    setCurrentQuery(value || '');
  };

  const handleQueryExecute = async (query?: string) => {
    const queryToExecute = query || currentQuery;
    if (!queryToExecute.trim()) {
      setError('Please enter a query to execute');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await executeQuery(queryToExecute);
      if (result.success) {
        setQueryResult(result);
      } else {
        setError(result.error || 'Failed to execute query');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar onExecuteQuery={() => handleQueryExecute()} />
        <Box sx={{ 
          display: 'flex', 
          flexGrow: 1,
          gap: 2,
          p: 2,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: '50%', 
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <SQLEditor 
              value={currentQuery}
              onChange={handleQueryChange}
              isLoading={isLoading}
              onExecuteQuery={handleQueryExecute}
            />
            <ResultsPanel 
              result={queryResult}
              isLoading={isLoading}
            />
          </Box>
          <SchemaViewer />
        </Box>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseError} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
