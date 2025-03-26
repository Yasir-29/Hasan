import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper, FormControlLabel, Switch, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { reportFoundItem, updateFoundItem, getFoundItemById } from '../services/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ReportFoundItem = () => {
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
    dateFound: null,
    location: '',
    color: '',
    uniqueIdentifiers: '',
    contactInfo: '',
    dropOffLocation: '',
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
          console.log("Fetching found item with ID:", id);
          
          // First check if item data is available in location state
          if (location.state?.item) {
            const itemFromState = location.state.item;
            console.log("Using item data from navigation state:", itemFromState);
            
            setFormData({
              itemName: itemFromState.name || '',
              category: itemFromState.category || '',
              description: itemFromState.description || '',
              dateFound: itemFromState.dateFound ? new Date(itemFromState.dateFound) : null,
              location: itemFromState.location || '',
              color: itemFromState.color || '',
              uniqueIdentifiers: itemFromState.uniqueIdentifiers || '',
              contactInfo: itemFromState.contactInfo || '',
              dropOffLocation: itemFromState.dropOffLocation || '',
              isEmergency: itemFromState.isEmergency || false,
              image: null
            });
            setLoading(false);
          } else {
            // Fetch from API if not available in state
            const itemData = await getFoundItemById(id);
            console.log("Fetched item data from API:", itemData);
            
            setFormData({
              itemName: itemData.name || '',
              category: itemData.category || '',
              description: itemData.description || '',
              dateFound: itemData.dateFound ? new Date(itemData.dateFound) : null,
              location: itemData.location || '',
              color: itemData.color || '',
              uniqueIdentifiers: itemData.uniqueIdentifiers || '',
              contactInfo: itemData.contactInfo || '',
              dropOffLocation: itemData.dropOffLocation || '',
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
    const savedFormData = localStorage.getItem('foundItemFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      if (parsedData.dateFound) {
        parsedData.dateFound = new Date(parsedData.dateFound);
      }
      setFormData(parsedData);
    }
      }
    };

    fetchItemData();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to report a found item');
      navigate('/login');
    }
  }, [navigate, id, isEditing, location.state]);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Accessories', 
    'Important Documents', 'Keys', 'Wallet/Purse', 'Bag/Backpack', 
    'Identification', 'Passport', 'Credit/Debit Cards', 'Other'
  ];

  const dropOffLocations = [
    'Police Station', 'Community Center', 'Library', 'School', 'Keep with me', 'Other'
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
    localStorage.setItem('foundItemFormData', JSON.stringify(dataForStorage));
    }
  };

  const handleDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      dateFound: date
    };
    setFormData(updatedFormData);
    
    // Only save to local storage if not editing
    if (!isEditing) {
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('foundItemFormData', JSON.stringify(dataForStorage));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
      // We don't save the image to localStorage as it's not serializable
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
      localStorage.setItem('foundItemFormData', JSON.stringify(dataForStorage));
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
        alert('Please log in to report a found item');
        navigate('/login');
        return;
      }

      // Create a new item object with the form data
      const itemData = {
        name: formData.itemName,
        category: formData.category,
        description: formData.description,
        dateFound: formData.dateFound,
        location: formData.location,
        color: formData.color,
        uniqueIdentifiers: formData.uniqueIdentifiers,
        contactInfo: formData.contactInfo,
        dropOffLocation: formData.dropOffLocation,
        isEmergency: formData.isEmergency,
        status: 'found'
      };

      setLoading(true);
      
      // Check if we're editing a mock item (IDs starting with '20')
      const isMockItem = typeof id === 'string' && id.startsWith('20');
      console.log('Is mock item:', isMockItem, 'Item ID:', id);

      if (isEditing && id) {
        if (isMockItem) {
          console.log('Updating mock item, no API call needed');
          // For mock items, we'll update the item in localStorage
          const storedItems = localStorage.getItem('userFoundItems');
          if (storedItems) {
            const items = JSON.parse(storedItems);
            const updatedItems = items.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  name: itemData.name,
                  category: itemData.category,
                  description: itemData.description,
                  dateFound: itemData.dateFound ? new Date(itemData.dateFound).toISOString() : null,
                  date: itemData.dateFound ? new Date(itemData.dateFound).toISOString().split('T')[0] : item.date,
                  location: itemData.location,
                  color: itemData.color,
                  uniqueIdentifiers: itemData.uniqueIdentifiers,
                  contactInfo: itemData.contactInfo,
                  dropOffLocation: itemData.dropOffLocation,
                  isEmergency: itemData.isEmergency
                };
              }
              return item;
            });
            localStorage.setItem('userFoundItems', JSON.stringify(updatedItems));
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } else {
          // Update existing item via API
          await updateFoundItem(id, itemData);
        }
        alert('Your found item has been updated successfully!');
      } else {
        // Create new item
        await reportFoundItem(itemData);
        
        // Clear the form data from local storage after successful submission
        localStorage.removeItem('foundItemFormData');
        
        // Add the new item to the user's found items in localStorage
        const storedFoundItems = localStorage.getItem('userFoundItems') || '[]';
        const foundItems = JSON.parse(storedFoundItems);
        
        // Create a mock item for immediate display in profile
        const newItem = {
          id: `2${Date.now().toString().slice(-4)}`,
          name: itemData.name,
          category: itemData.category,
          description: itemData.description,
          date: itemData.dateFound ? new Date(itemData.dateFound).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          location: itemData.location,
          color: itemData.color,
          uniqueIdentifiers: itemData.uniqueIdentifiers,
          contactInfo: itemData.contactInfo,
          dropOffLocation: itemData.dropOffLocation,
          isEmergency: itemData.isEmergency,
          isResolved: false,
          image: 'https://via.placeholder.com/150'
        };
        
        // Add to the beginning of the array
        foundItems.unshift(newItem);
        localStorage.setItem('userFoundItems', JSON.stringify(foundItems));

        // Add notification for the found item
        const storedNotifications = localStorage.getItem('userNotifications') || '[]';
        const notifications = JSON.parse(storedNotifications);
        const newNotification = {
          id: Date.now(),
          type: 'found_item',
          message: `You reported a found item: ${itemData.name}`,
          date: new Date().toISOString().split('T')[0],
          isRead: false,
          itemId: newItem.id
        };
        
        notifications.unshift(newNotification);
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
        
        // Update user points for reporting a found item
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Add 50 points for reporting a found item
          const updatedPoints = (user.points || 0) + 50;
          // Check if user reached Gold status (500 points)
          const updatedLevel = updatedPoints >= 500 ? 'Gold' : user.level || 'Regular';
          
          // Update user data
          const updatedUser = {
            ...user,
            points: updatedPoints,
            level: updatedLevel
          };
          
          // Save updated user data
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Add points notification
          const pointsNotification = {
            id: Date.now() + 1,
            type: 'points',
            message: `You earned 50 points for reporting a found item!`,
            date: new Date().toISOString().split('T')[0],
            isRead: false
          };
          
          notifications.unshift(pointsNotification);
          localStorage.setItem('userNotifications', JSON.stringify(notifications));
          
          // Special alert for emergency items
          if (formData.isEmergency) {
            alert('EMERGENCY NOTICE: This valuable item has been reported with priority status. Our team will take immediate action to find the owner.');
          } else {
            alert('Thank you for reporting a found item! We will try to find its owner.');
          }
        }
      }
      
      setLoading(false);
      
      // Reset the form if not editing
      if (!isEditing) {
        setFormData({
          itemName: '',
          category: '',
          description: '',
          dateFound: null,
          location: '',
          color: '',
          uniqueIdentifiers: '',
          contactInfo: '',
          dropOffLocation: '',
          isEmergency: false,
          image: null
        });
      }
      
      // Navigate to profile with state information about the new item
      navigate('/profile', { 
        state: { 
          newItem: true, 
          itemType: 'found item',
          severity: formData.isEmergency ? 'warning' : 'success'
        } 
      });
    } catch (error) {
      setLoading(false);
      console.error('Error with found item:', error);
      setError('Failed to process found item. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Found Item' : 'Report Found Item'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isEmergency}
                    onChange={handleSwitchChange}
                    name="isEmergency"
                    color="error"
                  />
                }
                label={<Typography sx={{ fontWeight: formData.isEmergency ? 'bold' : 'normal', color: formData.isEmergency ? 'error.main' : 'inherit' }}>
                  Emergency Mode - Use for high-value items (IDs, passports, etc.)
                </Typography>}
              />
            </Grid>
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
                placeholder="Please describe the item in detail (size, brand, model, etc.)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Found"
                  value={formData.dateFound}
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
            <Grid item xs={12} sm={6}>
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
                required
                fullWidth
                select
                label="Drop-off Location"
                name="dropOffLocation"
                value={formData.dropOffLocation}
                onChange={handleChange}
              >
                {dropOffLocations.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
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

export default ReportFoundItem; 