import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Default center (you can set this to your city's coordinates)
const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278
};

const GeolocationMap = ({ location }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // If location is provided, use it
    if (location) {
      setCurrentPosition(location);
      setLoading(false);
      return;
    }

    // Otherwise get current location
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
          setError('Error getting location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (!loading && !error) {
      // Initialize map
      const mapInstance = L.map('map').setView([currentPosition.lat, currentPosition.lng], 13);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Add marker
      L.marker([currentPosition.lat, currentPosition.lng]).addTo(mapInstance);

      setMap(mapInstance);

      // Cleanup function
      return () => {
        mapInstance.remove();
      };
    }
  }, [loading, error, currentPosition]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <div id="map" style={containerStyle}></div>
    </Paper>
  );
};

export default GeolocationMap; 