import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { QueryResult } from '../services/api';

interface ResultsPanelProps {
  result: QueryResult | null;
  isLoading: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!result) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography color="text.secondary">Execute a query to see results</Typography>
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

    if (result.results) {
      const columns = result.columns || (result.results[0] ? Object.keys(result.results[0]) : []);
      
      return (
        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.results.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column}`}>
                      {row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    }

    // Show changes for non-SELECT queries
    return (
      <Box sx={{ p: 2 }}>
        <Typography>
          Query executed successfully. {result.changes} row(s) affected.
          {result.lastId && ` Last inserted ID: ${result.lastId}`}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper sx={{ 
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle1">Query Results</Typography>
      </Box>
      {renderContent()}
    </Paper>
  );
};

export default ResultsPanel;
