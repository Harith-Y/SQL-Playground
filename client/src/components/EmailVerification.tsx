import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  Alert,
} from '@mui/material';
import { auth, sendEmailVerification } from '../services/firebase';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AuthThemeToggle from './AuthThemeToggle';

const EmailVerification = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await sendEmailVerification(user);
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
        pb: 10,
      }}
    >
      <AuthThemeToggle />
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
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
              <EmailOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              Verify Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Please verify your email address to continue using the application. 
              Check your inbox for the verification link.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2, width: '100%' }}>
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              onClick={handleResendVerification}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EmailVerification; 