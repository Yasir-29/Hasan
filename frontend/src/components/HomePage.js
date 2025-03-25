import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Features from './Features';

const HomePage = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Box className="hero">
          <Box className="hero-content">
            <Typography variant="h1" component="h1">
              Welcome to Our Lost & Found Platform
            </Typography>
            <Typography variant="body1">
              Find your lost items or help others find theirs.
            </Typography>
            <Button variant="contained" color="primary" size="large">
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>
      <Features />
    </>
  );
};

export default HomePage; 