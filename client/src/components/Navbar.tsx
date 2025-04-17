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
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { auth, logoutUser } from '../services/firebase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ThemeSelector from './ThemeSelector';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      handleMenuClose();
      setMobileMenuOpen(false);
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

  const handleNavigation = (path: string) => {
    if (path === '/' && window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const mobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        {user ? (
          <List>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Playground" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/tutorials')}>
              <ListItemIcon><SchoolIcon /></ListItemIcon>
              <ListItemText primary="Tutorials" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/challenges')}>
              <ListItemIcon><EmojiEventsIcon /></ListItemIcon>
              <ListItemText primary="Challenges" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/dashboard')}>
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem button onClick={() => handleNavigation('/login')}>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/register')}>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
        )}
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}
        >
          SQL Playground
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isMobile ? (
            // Desktop menu
            user ? (
              <>
                <Button 
                  color="inherit" 
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      window.location.reload();
                    } else {
                      navigate('/');
                    }
                  }}
                >
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
            )
          ) : (
            // Mobile menu button
            <>
              <ThemeSelector />
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>
      {mobileMenu}
    </AppBar>
  );
};

export default Navbar;
