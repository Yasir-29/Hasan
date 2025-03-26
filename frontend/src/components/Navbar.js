import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/authService';

const Navbar = () => {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    Lost & Found
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/search"
                    >
                        Search
                    </Button>

                    {isAuthenticated() ? (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/report-lost"
                            >
                                Report Lost
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/report-found"
                            >
                                Report Found
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/profile"
                            >
                                Profile
                            </Button>
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                            >
                                Logout ({user?.name})
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="inherit"
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 