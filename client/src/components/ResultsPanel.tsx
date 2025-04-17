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
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="h6">Query Results</Typography>
          {result?.columns && (
            <Typography variant="caption" color="text.secondary">
              {result.rows.length} row(s), {result.columns.length} column(s)
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          position: 'relative'
        }}>
          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%' 
            }}>
              <CircularProgress />
            </Box>
          ) : result?.error ? (
            <Box sx={{ p: 2, color: 'error.main' }}>
              <Typography variant="body1" component="pre" sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}>
                {result.error}
              </Typography>
            </Box>
          ) : result?.columns ? (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {result.columns.map((column, index) => (
                      <TableCell 
                        key={index}
                        sx={{ 
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell 
                          key={cellIndex}
                          sx={{ 
                            maxWidth: { xs: '150px', sm: '200px', md: '300px' },
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {cell === null ? 'NULL' : cell.toString()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2 
            }}>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {result?.changes !== undefined ? (
                  <>
                    Query executed successfully. {result.changes} row(s) affected.
                    {result.lastId !== undefined && ` Last inserted ID: ${result.lastId}`}
                  </>
                ) : (
                  'No results to display'
                )}
              </Typography>
              {result?.changes !== undefined && (
                <Button
                  variant="contained"
                  onClick={() => window.location.reload()}
                  sx={{ 
                    alignSelf: { xs: 'stretch', sm: 'flex-start' },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Refresh Results
                </Button>
              )}
            </Box>
          )}
        </Box>
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
