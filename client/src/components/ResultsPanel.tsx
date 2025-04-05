import React, { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { QueryResult } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface ResultsPanelProps {
  result: QueryResult | null;
  isLoading: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useTheme();

  // Debug logging
  useEffect(() => {
    console.log('ResultsPanel received result:', result);
  }, [result]);

  if (isLoading) {
    return (
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentTheme.colors.results,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (!result) {
    return (
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: currentTheme.colors.results,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No results to display
        </Typography>
      </Paper>
    );
  }

  if (!result.success) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{result.error}</Typography>
      </Box>
    );
  }

  // For SELECT queries that return results
  if (result.results && Array.isArray(result.results)) {
    if (result.results.length === 0) {
      return (
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTheme.colors.results,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No results found
          </Typography>
        </Paper>
      );
    }

    const columns = result.columns || Object.keys(result.results[0]);

    return (
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: currentTheme.colors.results,
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Query Results</Typography>
        </Box>
        <TableContainer 
          component={Paper}
          sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#1a1a1a',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#666',
              borderRadius: '4px',
            },
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column: string) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.results.map((row: Record<string, any>, index: number) => (
                <TableRow key={index}>
                  {columns.map((column: string) => (
                    <TableCell key={`${index}-${column}`}>
                      {row[column] !== null ? row[column].toString() : 'NULL'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // For INSERT, UPDATE, DELETE queries
  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: currentTheme.colors.results,
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Query Results</Typography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography>
          Query executed successfully. {result.changes} row(s) affected.
          {result.lastId !== undefined && ` Last inserted ID: ${result.lastId}`}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ alignSelf: 'flex-start' }}
        >
          Refresh Results
        </Button>
      </Box>
    </Paper>
  );
};

export default ResultsPanel;
