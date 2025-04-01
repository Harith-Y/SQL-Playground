import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Alert,
    Container,
} from '@mui/material';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            await register(username, email, password);
            // After successful registration, log the user in
            await login(email, password);
            navigate('/'); // Redirect to home page after successful registration
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create an account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Create your account
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            label="Username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Email address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                                    Sign in here
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register; 