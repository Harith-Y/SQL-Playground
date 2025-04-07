import React, { useState } from 'react';
import { Box, Typography, Paper, Container, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../services/firebase';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                bgcolor: 'secondary.main',
              }}
            >
              {currentUser?.email?.[0].toUpperCase()}
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#000' }}>
              Welcome, {currentUser?.email}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#333' }}>
              Your Personal Dashboard
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
                Account Information
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                Email: {currentUser?.email}
              </Typography>
              <Typography variant="body1" sx={{ color: '#333' }}>
                Last Login: {new Date().toLocaleDateString()}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
                Quick Actions
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#333',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#1976d2',
                    textDecoration: 'underline'
                  }
                }}
                onClick={handlePasswordDialogOpen}
              >
                • Change Password
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Container>

      <Dialog open={openPasswordDialog} onClose={handlePasswordDialogClose}>
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
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 