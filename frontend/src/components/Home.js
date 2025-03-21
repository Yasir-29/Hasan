import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Advanced Search & Filters',
      description: 'Search for lost or found items using detailed filters such as category, date, location, and more.',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'AI-Driven Matching',
      description: 'Our AI intelligently matches lost items with found items based on descriptions and images.',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Community Alerts',
      description: 'Stay informed with real-time alerts about lost or found items in your vicinity.',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Geolocation & Mapping',
      description: 'Pinpoint exact locations where items were lost or found for easier retrieval.',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Reward System',
      description: 'Offer optional rewards to those who return your lost items.',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Emergency Mode',
      description: 'Prioritized notifications for critical lost items like passports, IDs, and legal documents.',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Lost & Found
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          An innovative, AI-powered platform to help you recover lost items and return found ones.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/report-lost" sx={{ mx: 1 }}>
            Report Lost Item
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/report-found" sx={{ mx: 1 }}>
            Report Found Item
          </Button>
        </Box>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Our Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={feature.image}
                alt={feature.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 