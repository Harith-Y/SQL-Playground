import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';

interface QueryResult {
    columns?: string[];
    rows?: Record<string, any>[];
}

const SQLPlayground: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [result, setResult] = useState<QueryResult | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { user, logout } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/queries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Query execution failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to execute query');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h1">
                        SQL Playground
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            Welcome, {user.username}
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="SQL Query"
                            variant="outlined"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your SQL query here..."
                            sx={{ mb: 2 }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? 'Executing...' : 'Execute Query'}
                        </Button>
                    </form>
                </Paper>

                {result && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Query Result
                        </Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {result.columns?.map((column, index) => (
                                            <TableCell key={index}>
                                                {column}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {result.rows?.map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {Object.values(row).map((value, colIndex) => (
                                                <TableCell key={colIndex}>
                                                    {value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

export default SQLPlayground; 