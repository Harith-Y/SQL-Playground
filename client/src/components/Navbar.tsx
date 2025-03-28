import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Storage as StorageIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  PlayArrow as RunIcon,
} from '@mui/icons-material';

interface NavbarProps {
  onExecuteQuery: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onExecuteQuery }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <StorageIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SQL Playground
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<RunIcon />}
            onClick={onExecuteQuery}
          >
            Run Query
          </Button>
          
          <Button
            color="inherit"
            startIcon={<SaveIcon />}
            onClick={() => {/* TODO: Implement save functionality */}}
          >
            Save
          </Button>
          
          <Button
            color="inherit"
            startIcon={<SchoolIcon />}
            onClick={() => {/* TODO: Implement tutorials */}}
          >
            Tutorials
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
