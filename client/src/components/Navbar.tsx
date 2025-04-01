import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Storage as StorageIcon,
  School as SchoolIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppBar position="static">
      <Toolbar>
        <StorageIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SQL Playground
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isHome && (
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
          )}
          
          <Button
            color="inherit"
            startIcon={<SchoolIcon />}
            onClick={() => navigate('/tutorials')}
          >
            Tutorials
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
