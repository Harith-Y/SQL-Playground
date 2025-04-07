import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { auth, logoutUser } from '../services/firebase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SQL Playground
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/')}>
                Playground
              </Button>
              <Button color="inherit" onClick={() => navigate('/tutorials')}>
                Tutorials
              </Button>
              <Button color="inherit" onClick={() => navigate('/challenges')}>
                Challenges
              </Button>
              <ThemeSelector />
              <IconButton
                onClick={handleMenuOpen}
                size="large"
                edge="end"
                color="inherit"
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => {
                  handleMenuClose();
                  navigate('/dashboard');
                }}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
