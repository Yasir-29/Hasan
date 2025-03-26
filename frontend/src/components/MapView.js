import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const defaultCenter = {
    lat: 40.7580,
    lng: -73.9855
  };

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

  useEffect(() => {
    if (!loading && currentPosition) {
      // Initialize map
      const mapInstance = L.map('map-view').setView(
        [currentPosition.lat, currentPosition.lng], 
        15
      );

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Add marker for current position
      L.marker([currentPosition.lat, currentPosition.lng])
        .addTo(mapInstance)
        .bindPopup('Your current location')
        .openPopup();

      setMap(mapInstance);

      // Cleanup function
      return () => {
        mapInstance.remove();
      };
    }
  }, [loading, currentPosition]);

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
        <div id="map-view" style={mapContainerStyle}></div>
      </Paper>
    </Container>
  );
};

export default MapView; 