import React, { useState } from 'react';
import { Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapView = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all'); // 'lost', 'found', 'all'

  // Mock data for demonstration
  const items = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      category: 'Electronics',
      description: 'Black iPhone 13 Pro with a blue case.',
      date: '2023-03-01',
      location: 'Central Park, New York',
      position: { lat: 40.785091, lng: -73.968285 },
      status: 'lost',
      reward: '$100'
    },
    {
      id: 2,
      name: 'Gold Ring',
      category: 'Jewelry',
      description: 'Gold ring with a small diamond.',
      date: '2023-03-02',
      location: 'Times Square, New York',
      position: { lat: 40.758896, lng: -73.985130 },
      status: 'found',
      reward: ''
    },
    {
      id: 3,
      name: 'Leather Wallet',
      category: 'Wallet/Purse',
      description: 'Brown leather wallet with ID and credit cards.',
      date: '2023-03-03',
      location: 'Grand Central Station, New York',
      position: { lat: 40.752726, lng: -73.977229 },
      status: 'lost',
      reward: '$50'
    },
    {
      id: 4,
      name: 'Blue Backpack',
      category: 'Bag/Backpack',
      description: 'Blue Northface backpack with laptop inside.',
      date: '2023-03-04',
      location: 'Bryant Park, New York',
      position: { lat: 40.753837, lng: -73.983789 },
      status: 'found',
      reward: ''
    }
  ];

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.status === filter);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 40.7580, 
    lng: -73.9855
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Map View
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        View lost and found items on the map to find items near you.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Filter Items</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={filter}
            label="Filter Items"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Items</MenuItem>
            <MenuItem value="lost">Lost Items</MenuItem>
            <MenuItem value="found">Found Items</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={options}
          >
            {filteredItems.map(item => (
              <Marker
                key={item.id}
                position={item.position}
                icon={{
                  url: item.status === 'lost' 
                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' 
                    : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                }}
                onClick={() => setSelectedItem(item)}
              />
            ))}

            {selectedItem && (
              <InfoWindow
                position={selectedItem.position}
                onCloseClick={() => setSelectedItem(null)}
              >
                <Box sx={{ p: 1, maxWidth: 200 }}>
                  <Typography variant="subtitle1" component="div" gutterBottom>
                    {selectedItem.name}
                  </Typography>
                  <Chip 
                    label={selectedItem.status === 'lost' ? 'Lost' : 'Found'} 
                    color={selectedItem.status === 'lost' ? 'error' : 'success'} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {selectedItem.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {selectedItem.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {selectedItem.location}
                  </Typography>
                  {selectedItem.reward && (
                    <Typography variant="body2" color="error">
                      <strong>Reward:</strong> {selectedItem.reward}
                    </Typography>
                  )}
                </Box>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Legend
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
          <Typography variant="body2">Lost Items</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} />
          <Typography variant="body2">Found Items</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MapView; 