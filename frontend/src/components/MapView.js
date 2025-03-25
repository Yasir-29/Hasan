import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const defaultCenter = {
    lat: 40.7580,
    lng: -73.9855
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading map...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Current Location
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={currentPosition || defaultCenter}
            zoom={15}
          >
            {currentPosition && (
              <Marker
                position={currentPosition}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </Paper>
    </Container>
  );
};

export default MapView; 