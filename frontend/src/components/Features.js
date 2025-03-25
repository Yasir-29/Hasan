import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import GeolocationMap from './GeolocationMap';

const Features = () => {
  const [showMap, setShowMap] = useState(false);

  const handleGeolocationClick = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const features = [
    {
      title: 'Advanced Search & Filters',
      description: 'Search for lost or found items using detailed filters such as category, date, location, and more.',
      icon: <SearchIcon sx={{ fontSize: 40, color: '#007bff' }} />,
      onClick: () => console.log('Advanced Search clicked'),
    },
    {
      title: 'AI-Driven Matching',
      description: 'Our AI intelligently matches lost items with found items based on descriptions and images.',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: '#28a745' }} />,
      onClick: () => console.log('AI Matching clicked'),
    },
    {
      title: 'Community Alerts',
      description: 'Stay informed with real-time alerts about lost or found items in your vicinity.',
      icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: '#dc3545' }} />,
      onClick: () => console.log('Community Alerts clicked'),
    },
    {
      title: 'Geolocation & Mapping',
      description: 'Pinpoint exact locations where items were lost or found for easier retrieval.',
      icon: <LocationOnIcon sx={{ fontSize: 40, color: '#fd7e14' }} />,
      onClick: handleGeolocationClick,
    },
    {
      title: 'Reward System',
      description: 'Offer optional rewards to those who return your lost items.',
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: '#ffc107' }} />,
      onClick: () => console.log('Reward System clicked'),
    },
    {
      title: 'Emergency Mode',
      description: 'Prioritized notifications for critical lost items like passports, IDs, and legal documents.',
      icon: <WarningIcon sx={{ fontSize: 40, color: '#6f42c1' }} />,
      onClick: () => console.log('Emergency Mode clicked'),
    },
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          Our Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'white',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  },
                }}
                onClick={feature.onClick}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Geolocation Map Modal */}
      <Modal
        open={showMap}
        onClose={handleCloseMap}
        aria-labelledby="geolocation-modal"
        aria-describedby="show-current-location"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Current Location
          </Typography>
          <GeolocationMap />
        </Box>
      </Modal>
    </Box>
  );
};

export default Features; 