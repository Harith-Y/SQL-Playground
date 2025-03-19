import React from 'react';
import { Paper } from '@mui/material';

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
      
    </Paper>
  );
};

export default ResultsPanel;
