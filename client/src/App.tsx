import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SQLEditor from './components/SQLEditor';
import ResultsPanel from './components/ResultsPanel';
import SchemaViewer from './components/SchemaViewer';
import Tutorials from './components/Tutorials';
import TutorialLesson from './components/TutorialLesson';
import Challenges from './components/Challenges';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import { executeQuery, QueryResult, fetchSchema, SchemaDefinition } from './services/api';
import { auth } from './services/firebase';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Default schema
const defaultSchema: SchemaDefinition = {
  tables: {
    users: {
      columns: [
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
  },
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const Playground = () => {
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState<SchemaDefinition>(defaultSchema);
  const [savedQueries, setSavedQueries] = useState<Array<{ title: string; query: string }>>([]);

  // Fetch initial schema
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const fetchedSchema = await fetchSchema();
        setSchema(fetchedSchema);
      } catch (err) {
        console.error('Error loading schema:', err);
        // Keep the default schema if fetching fails
      }
    };
    loadSchema();
  }, []);

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
        // Refresh schema after successful query execution
        const updatedSchema = await fetchSchema();
        setSchema(updatedSchema);
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

  const handleQueriesLoad = (queries: Array<{ title: string; query: string }>) => {
    setSavedQueries(queries);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SQLEditor
            value={currentQuery}
            onChange={handleQueryChange}
            onExecuteQuery={handleQueryExecute}
            isLoading={isLoading}
            onQueriesLoad={handleQueriesLoad}
          />
          <ResultsPanel result={queryResult} isLoading={isLoading} />
        </Box>
        <SchemaViewer
          schema={schema}
          queries={savedQueries}
          onQueriesLoad={handleQueriesLoad}
        />
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
  );
};

function App() {
  const { currentTheme } = useTheme();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text
        }}>
          <Navbar />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Playground />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials"
                element={
                  <ProtectedRoute>
                    <Tutorials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutorials/:tutorialId"
                element={
                  <ProtectedRoute>
                    <TutorialLesson />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/challenges"
                element={
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
