import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, Tabs, Tab, Card, CardContent, CardMedia, CardActions, Button, Chip } from '@mui/material';
import { getUserItems } from '../services/api';

const Dashboard = () => {
    const [tab, setTab] = useState(0); // 0 for lost items, 1 for found items
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserItems = async () => {
            try {
                setLoading(true);
                const data = await getUserItems();
                setItems(data);
                setError(null);
            } catch (err) {
                setError('Failed to load your items. Please try again later.');
                console.error('Error loading items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserItems();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    // Filter items based on current tab
    const filteredItems = items.filter(item => 
        tab === 0 ? item.status === 'lost' : item.status === 'found'
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Dashboard
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                    >
                        <Tab label="My Lost Items" />
                        <Tab label="My Found Items" />
                    </Tabs>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : filteredItems.length === 0 ? (
                    <Typography>
                        No {tab === 0 ? 'lost' : 'found'} items to display.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredItems.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={item.image || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                    />
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {item.name}
                                            </Typography>
                                            <Chip 
                                                label={item.status.toUpperCase()} 
                                                color={item.status === 'lost' ? 'error' : 'success'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Category:</strong> {item.category}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Location:</strong> {item.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" color="primary">
                                            Edit
                                        </Button>
                                        <Button size="small" color="error">
                                            Delete
                                        </Button>
                                        {item.status === 'lost' && item.reward && (
                                            <Chip 
                                                label={`Reward: ${item.reward}`}
                                                color="primary"
                                                size="small"
                                                sx={{ ml: 'auto' }}
                                            />
                                        )}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Container>
    );
};

export default Dashboard; 