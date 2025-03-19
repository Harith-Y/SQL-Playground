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
} from '@mui/material';

const ResultsPanel = () => {
  // Example data - this will be replaced with actual query results later on when in production.
  const columns = ['id', 'username', 'email'];
  const rows = [
    { id: 1, username: 'harith_y', email: 'cs23i1027@iiitdm.ac.in' },
    { id: 2, username: 'grishmank_parate', email: 'cs23i1026@iiitdm.ac.in' },
  ];

  return (
    <Paper sx={{ 
      height: '300px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1">Query Results</Typography>
      </Box>
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column}`}>
                    {row[column as keyof typeof row]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ResultsPanel;
