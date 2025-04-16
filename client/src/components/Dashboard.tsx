import React, { useState } from 'react';
import { Box, Typography, Paper, Container, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../services/firebase';
import AuthThemeToggle from './AuthThemeToggle';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handlePasswordDialogOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handlePasswordChange = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      await changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setTimeout(() => {
        handlePasswordDialogClose();
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: isMobile ? 2 : 4,
        pb: isMobile ? 6 : 10,
      }}
    >
      <AuthThemeToggle />
      <Container maxWidth="lg" sx={{ px: isMobile ? 2 : 3 }}>
        <Paper
          elevation={24}
          sx={{
            p: isMobile ? 2 : 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: isMobile ? 2 : 4,
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 60 : 100,
                height: isMobile ? 60 : 100,
                mb: isMobile ? 1 : 2,
                bgcolor: 'secondary.main',
              }}
            >
              {currentUser?.email?.[0].toUpperCase()}
            </Avatar>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom>
              Welcome, {currentUser?.email}
            </Typography>
            <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary">
              Your Personal Dashboard
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: isMobile ? 2 : 3,
            }}
          >
            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: 2,
              }}
            >
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Account Information
              </Typography>
              <Typography variant={isMobile ? "body2" : "body1"}>
                Email: {currentUser?.email}
              </Typography>
              <Typography variant={isMobile ? "body2" : "body1"}>
                Last Login: {new Date().toLocaleDateString()}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: isMobile ? 2 : 3,
                borderRadius: 2,
              }}
            >
              <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                Quick Actions
              </Typography>
              <Typography 
                variant={isMobile ? "body2" : "body1"}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
                onClick={handlePasswordDialogOpen}
              >
                • Change Password
              </Typography>
              <Typography 
                variant={isMobile ? "body2" : "body1"}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => navigate('/contribute')}
              >
                • Contribute
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>

      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose} fullScreen={isMobile}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} size={isMobile ? "small" : "medium"}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary" size={isMobile ? "small" : "medium"}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 