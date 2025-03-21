import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { reportFoundItem } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportFoundItem = () => {
  const navigate = useNavigate();
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
    image: null
  });

  // Load form data from local storage when component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem('foundItemFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      if (parsedData.dateFound) {
        parsedData.dateFound = new Date(parsedData.dateFound);
      }
      setFormData(parsedData);
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to report a found item');
      navigate('/login');
    }
  }, [navigate]);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Accessories', 'Documents', 
    'Keys', 'Wallet/Purse', 'Bag/Backpack', 'Other'
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
    
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('foundItemFormData', JSON.stringify(dataForStorage));
  };

  const handleDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      dateFound: date
    };
    setFormData(updatedFormData);
    
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('foundItemFormData', JSON.stringify(dataForStorage));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        status: 'found'
      };

      // Send data to backend
      await reportFoundItem(itemData);
      
      // Clear the form data from local storage after successful submission
      localStorage.removeItem('foundItemFormData');
      
      // Reset the form
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
        image: null
      });
      
      alert('Thank you for reporting a found item! We will try to find its owner.');
      navigate('/dashboard'); // or wherever you want to redirect after success
    } catch (error) {
      console.error('Error reporting found item:', error);
      alert('Failed to report found item. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Report a Found Item
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please provide as much detail as possible to help us find the owner.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                placeholder="Please describe the item in detail (size, brand, model, etc.)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Found"
                  value={formData.dateFound}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location Found"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Be as specific as possible"
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
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                Submit Report
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportFoundItem; 