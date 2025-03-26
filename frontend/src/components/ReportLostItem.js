import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper, FormControlLabel, Switch, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { reportLostItem, updateLostItem, getLostItemById } from '../services/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ReportLostItem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from URL if editing
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    dateLost: null,
    location: '',
    color: '',
    uniqueIdentifiers: '',
    contactInfo: '',
    reward: '',
    isEmergency: false,
    image: null,
    coordinates: null
  });

  // Initialize map
  useEffect(() => {
    // Initialize map
    const mapInstance = L.map('location-picker').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add click handler to map
    let marker;
    mapInstance.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(mapInstance);
      }
      setSelectedLocation({ lat, lng });
      setFormData(prev => ({
        ...prev,
        coordinates: { lat, lng },
        location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }));
    });

    setMap(mapInstance);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  // Load item data for editing or from local storage for new item
  useEffect(() => {
    const fetchItemData = async () => {
      // If we're editing an existing item
      if (isEditing && id) {
        try {
          setLoading(true);
          console.log("Fetching lost item with ID:", id);
          
          // First check if item data is available in location state
          if (location.state?.item) {
            const itemFromState = location.state.item;
            console.log("Using item data from navigation state:", itemFromState);
            
            setFormData({
              itemName: itemFromState.name || '',
              category: itemFromState.category || '',
              description: itemFromState.description || '',
              dateLost: itemFromState.dateLost ? new Date(itemFromState.dateLost) : null,
              location: itemFromState.location || '',
              color: itemFromState.color || '',
              uniqueIdentifiers: itemFromState.uniqueIdentifiers || '',
              contactInfo: itemFromState.contactInfo || '',
              reward: itemFromState.reward || '',
              isEmergency: itemFromState.isEmergency || false,
              image: null
            });
            setLoading(false);
          } else {
            // Fetch from API if not available in state
            const itemData = await getLostItemById(id);
            console.log("Fetched item data from API:", itemData);
            
            setFormData({
              itemName: itemData.name || '',
              category: itemData.category || '',
              description: itemData.description || '',
              dateLost: itemData.dateLost ? new Date(itemData.dateLost) : null,
              location: itemData.location || '',
              color: itemData.color || '',
              uniqueIdentifiers: itemData.uniqueIdentifiers || '',
              contactInfo: itemData.contactInfo || '',
              reward: itemData.reward || '',
              isEmergency: itemData.isEmergency || false,
              image: null // We can't retrieve the image this way
            });
            setLoading(false);
          }
        } catch (err) {
          console.error('Error fetching item data:', err);
          setError('Failed to load item data. Please try again.');
          setLoading(false);
        }
      } else {
        // Load form data from local storage when component mounts (for new items)
    const savedFormData = localStorage.getItem('lostItemFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      // Convert date string back to Date object if it exists
      if (parsedData.dateLost) {
        parsedData.dateLost = new Date(parsedData.dateLost);
      }
      // We can't store the image in localStorage, so it will remain null
      setFormData(parsedData);
    }
      }
    };

    fetchItemData();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to report a lost item');
      navigate('/login');
    }
  }, [navigate, id, isEditing, location.state]);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Accessories', 
    'Important Documents', 'Keys', 'Wallet/Purse', 'Bag/Backpack', 
    'Identification', 'Passport', 'Credit/Debit Cards', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    
    // Only save to local storage if not editing
    if (!isEditing) {
      // Save to local storage (excluding the image)
      const dataForStorage = { ...updatedFormData };
      delete dataForStorage.image;
      localStorage.setItem('lostItemFormData', JSON.stringify(dataForStorage));
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: checked
    };
    setFormData(updatedFormData);
    
    // Only save to local storage if not editing
    if (!isEditing) {
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('lostItemFormData', JSON.stringify(dataForStorage));
    }
  };

  const handleDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      dateLost: date
    };
    setFormData(updatedFormData);
    
    // Only save to local storage if not editing
    if (!isEditing) {
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('lostItemFormData', JSON.stringify(dataForStorage));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    }
  };

  // Check if the item is a high-value item based on category
  const isHighValueItem = () => {
    const highValueCategories = ['Passport', 'Identification', 'Important Documents', 'Credit/Debit Cards', 'Jewelry'];
    return highValueCategories.includes(formData.category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to report a lost item');
        navigate('/login');
        return;
      }

      // Create a new item object with the form data
      const itemData = {
        name: formData.itemName,
        category: formData.category,
        description: formData.description,
        dateLost: formData.dateLost,
        location: formData.location,
        color: formData.color,
        uniqueIdentifiers: formData.uniqueIdentifiers,
        contactInfo: formData.contactInfo,
        reward: formData.reward,
        isEmergency: formData.isEmergency,
        status: 'lost'
      };

      setLoading(true);
      
      // Check if we're editing a mock item (IDs starting with '10')
      const isMockItem = typeof id === 'string' && id.startsWith('10');
      console.log('Is mock item:', isMockItem, 'Item ID:', id);

      if (isEditing && id) {
        if (isMockItem) {
          console.log('Updating mock item, no API call needed');
          // For mock items, we'll update the item in localStorage
          const storedItems = localStorage.getItem('userLostItems');
          if (storedItems) {
            const items = JSON.parse(storedItems);
            const updatedItems = items.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  name: itemData.name,
                  category: itemData.category,
                  description: itemData.description,
                  dateLost: itemData.dateLost ? new Date(itemData.dateLost).toISOString() : null,
                  date: itemData.dateLost ? new Date(itemData.dateLost).toISOString().split('T')[0] : item.date,
                  location: itemData.location,
                  color: itemData.color,
                  uniqueIdentifiers: itemData.uniqueIdentifiers,
                  contactInfo: itemData.contactInfo,
                  reward: itemData.reward,
                  isEmergency: itemData.isEmergency,
                  isResolved: item.isResolved, // Preserve the resolved status
                  resolvedDate: item.resolvedDate // Preserve the resolved date if it exists
                };
              }
              return item;
            });
            localStorage.setItem('userLostItems', JSON.stringify(updatedItems));
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } else {
          // Update existing item via API
          await updateLostItem(id, itemData);
        }
        alert('Your lost item has been updated successfully!');
      } else {
        // Create new item
        const response = await reportLostItem(itemData);
        console.log('New item created:', response);
        
        // Special alert for emergency items
        if (formData.isEmergency) {
          alert('EMERGENCY REPORT: Your valuable item has been reported with priority status. Our team has been notified and will take immediate action.');
        } else {
          alert('Your lost item has been reported successfully!');
        }
      }
      
      setLoading(false);
      
      // Reset the form if not editing
      if (!isEditing) {
        setFormData({
          itemName: '',
          category: '',
          description: '',
          dateLost: null,
          location: '',
          color: '',
          uniqueIdentifiers: '',
          contactInfo: '',
          reward: '',
          isEmergency: false,
          image: null
        });
      }
      
      // Navigate to profile with state information about the new item
      navigate('/profile', { 
        state: { 
          newItem: true, 
          itemType: 'lost item',
          severity: formData.isEmergency ? 'warning' : 'success'
        } 
      });
    } catch (error) {
      setLoading(false);
      console.error('Error with lost item:', error);
      setError('Failed to process lost item. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Lost Item' : 'Report Lost Item'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please describe your item in detail (size, brand, model, etc.)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Lost"
                  value={formData.dateLost}
                  onChange={handleDateChange}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      required: true 
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Select Location on Map
              </Typography>
              <Paper elevation={1} sx={{ p: 1, mb: 2 }}>
                <div id="location-picker" style={{ height: '400px', width: '100%' }}></div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Location Details"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Click on the map or enter location details manually"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Unique Identifiers"
                name="uniqueIdentifiers"
                value={formData.uniqueIdentifiers}
                onChange={handleChange}
                placeholder="Serial number, engravings, distinctive marks, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Contact Information"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Phone number or email address"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reward (Optional)"
                name="reward"
                value={formData.reward}
                onChange={handleChange}
                placeholder="Amount or description of reward"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            
              <Grid item xs={12}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: formData.isEmergency ? 'error.50' : 'background.paper',
                  border: formData.isEmergency ? '1px solid' : 'none',
                  borderColor: 'error.main'
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isEmergency}
                      onChange={handleSwitchChange}
                      name="isEmergency"
                      color="error"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" color={formData.isEmergency ? 'error' : 'text.primary'} fontWeight={formData.isEmergency ? 'bold' : 'normal'}>
                        Emergency Mode
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Enable for high-priority items (passports, IDs, valuables). Activates immediate notifications to our team.
                      </Typography>
                    </Box>
                  }
                />
                {formData.isEmergency && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Emergency mode activated. Your report will be treated with highest priority.
                  </Alert>
                )}
              </Paper>
              </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                color={formData.isEmergency ? "error" : "primary"}
              >
                {loading ? 'Processing...' : isEditing ? 'Update Item' : 'Submit Report'}
              </Button>
            </Grid>
            {isEditing && (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ReportLostItem; 