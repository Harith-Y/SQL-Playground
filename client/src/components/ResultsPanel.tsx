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
} from '@mui/material';
import { QueryResult } from '../services/api';

interface ResultsPanelProps {
  result: QueryResult | null;
  isLoading: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounce resize observer updates
    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        // Force a re-render after resize
        if (containerRef.current) {
          containerRef.current.style.height = 'auto';
          containerRef.current.style.height = `${containerRef.current.scrollHeight}px`;
        }
      }, 100);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Executing query...</Typography>
      </Box>
    );
  }

  if (!result) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>No results to display</Typography>
      </Box>
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
        <Box sx={{ p: 2 }}>
          <Typography>No results found</Typography>
        </Box>
      );
    }

    const columns = result.columns || Object.keys(result.results[0]);

    return (
      <Box ref={containerRef} sx={{ height: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ height: '100%', overflow: 'auto' }}>
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
      </Box>
    );
  }

  // For INSERT, UPDATE, DELETE queries
  return (
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
  );
};

export default ResultsPanel;
