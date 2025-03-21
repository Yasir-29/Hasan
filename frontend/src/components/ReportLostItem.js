import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { reportLostItem } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportLostItem = () => {
  const navigate = useNavigate();
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
    image: null
  });

  // Load form data from local storage when component mounts
  useEffect(() => {
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

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to report a lost item');
      navigate('/login');
    }
  }, [navigate]);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Accessories', 'Documents', 
    'Keys', 'Wallet/Purse', 'Bag/Backpack', 'Other'
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
    localStorage.setItem('lostItemFormData', JSON.stringify(dataForStorage));
  };

  const handleDateChange = (date) => {
    const updatedFormData = {
      ...formData,
      dateLost: date
    };
    setFormData(updatedFormData);
    
    // Save to local storage (excluding the image)
    const dataForStorage = { ...updatedFormData };
    delete dataForStorage.image;
    localStorage.setItem('lostItemFormData', JSON.stringify(dataForStorage));
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
        status: 'lost'
      };

      // Send data to backend
      await reportLostItem(itemData);
      
      // Clear the form data from local storage after successful submission
      localStorage.removeItem('lostItemFormData');
      
      // Reset the form
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
        image: null
      });
      
      alert('Your lost item has been reported successfully!');
      navigate('/dashboard'); // or wherever you want to redirect after success
    } catch (error) {
      console.error('Error reporting lost item:', error);
      alert('Failed to report lost item. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Report a Lost Item
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please provide as much detail as possible to help us find your item.
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
                placeholder="Please describe your item in detail (size, brand, model, etc.)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Lost"
                  value={formData.dateLost}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Location Lost"
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

export default ReportLostItem; 