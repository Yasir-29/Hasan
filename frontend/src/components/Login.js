import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Tab, Tabs, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

const Login = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0); // 0 for login, 1 for register
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setError('');
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            await login(loginData);
            navigate('/dashboard'); // or wherever you want to redirect after login
        } catch (err) {
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await register({
                name: registerData.name,
                email: registerData.email,
                password: registerData.password
            });
            navigate('/dashboard'); // or wherever you want to redirect after registration
        } catch (err) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography component="h1" variant="h4" align="center" gutterBottom>
                        Welcome to Lost & Found
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ mb: 4 }}
                    >
                        <Tab label="Sign In" />
                        <Tab label="Sign Up" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {tab === 0 ? (
                        // Login Form
                        <Box component="form" onSubmit={handleLogin}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={loginData.email}
                                onChange={handleLoginChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Box>
                    ) : (
                        // Register Form
                        <Box component="form" onSubmit={handleRegister}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={registerData.name}
                                onChange={handleRegisterChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={registerData.email}
                                onChange={handleRegisterChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={handleRegisterChange}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 