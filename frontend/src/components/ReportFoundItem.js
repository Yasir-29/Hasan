import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper, FormControlLabel, Switch, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { reportFoundItem, updateFoundItem, getFoundItemById } from '../services/api';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ReportFoundItem = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID from URL if editing
  const location = useLocation();
  const isEditing = location.state?.isEditing || false;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    image: null
  });

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
          id: `2${Date.now().toString().slice(-4)}`, // Create a mock ID starting with '2'
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
          image: 'https://via.placeholder.com/150' // Default placeholder image
        };
        
        // Add to the beginning of the array
        foundItems.unshift(newItem);
        localStorage.setItem('userFoundItems', JSON.stringify(foundItems));
        
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
          
          // Award badges based on number of found items
          const totalFoundItems = foundItems.length + 1; // +1 for the current item being reported
          
          // Determine which badges to award
          let newBadges = [];
          if (totalFoundItems >= 1 && !user.badges?.includes('First Find')) {
            newBadges.push('First Find');
          }
          if (totalFoundItems >= 5 && !user.badges?.includes('Helpful Citizen')) {
            newBadges.push('Helpful Citizen');
          }
          if (totalFoundItems >= 10 && !user.badges?.includes('Community Hero')) {
            newBadges.push('Community Hero');
          }
          if (totalFoundItems >= 20 && !user.badges?.includes('Lost & Found Expert')) {
            newBadges.push('Lost & Found Expert');
          }
          
          // Category-specific badges
          const categoryBadges = {
            'Electronics': 'Tech Finder',
            'Jewelry': 'Treasure Hunter',
            'Important Documents': 'Document Rescuer',
            'Wallet/Purse': 'Wallet Saver',
            'Identification': 'ID Guardian',
            'Passport': 'Global Citizen Helper',
            'Credit/Debit Cards': 'Financial Protector'
          };
          
          // Check if user has found an item in this category before
          const categoryName = formData.category;
          if (categoryBadges[categoryName] && !user.badges?.includes(categoryBadges[categoryName])) {
            // Check if this is their first item in this category
            const itemsInCategory = foundItems.filter(item => item.category === categoryName).length;
            if (itemsInCategory === 0) {
              // This is their first item in this category
              newBadges.push(categoryBadges[categoryName]);
            }
          }
          
          // If there are new badges, update user badges
          if (newBadges.length > 0) {
            const currentBadges = user.badges || [];
            const updatedBadges = [...currentBadges, ...newBadges];
            
            // Update user with new badges
            const userWithBadges = {
              ...updatedUser,
              badges: updatedBadges
            };
            
            localStorage.setItem('user', JSON.stringify(userWithBadges));
            
            // Add notifications for each new badge
            newBadges.forEach(badge => {
              const badgeNotification = {
                id: Date.now() + Math.random(), // Ensure unique ID
                type: 'badge',
                message: `Congratulations! You've earned the "${badge}" badge!`,
                date: new Date().toISOString().split('T')[0],
                isRead: false
              };
              
              notifications.unshift(badgeNotification);
            });
            
            // Save updated notifications
            localStorage.setItem('userNotifications', JSON.stringify(notifications));
            
            // Show badge alert
            if (newBadges.length === 1) {
              alert(`Congratulations! You've earned the "${newBadges[0]}" badge!`);
            } else if (newBadges.length > 1) {
              alert(`Congratulations! You've earned ${newBadges.length} new badges: ${newBadges.join(', ')}!`);
            }
          }
          
          // Add a notification about earning points
          const storedNotifications = localStorage.getItem('userNotifications') || '[]';
          const notifications = JSON.parse(storedNotifications);
          const newNotification = {
            id: Date.now(), // Use timestamp as unique ID
            type: updatedLevel === 'Gold' && user.level !== 'Gold' ? 'gold' : 'points',
            message: updatedLevel === 'Gold' && user.level !== 'Gold' 
              ? `Congratulations! You've earned 50 points and reached Gold Member status!` 
              : `You earned 50 points for reporting a found item!`,
            date: new Date().toISOString().split('T')[0],
            isRead: false
          };
          
          notifications.unshift(newNotification); // Add to beginning of array
          localStorage.setItem('userNotifications', JSON.stringify(notifications));
          
          // Show appropriate message about points and status
          if (updatedLevel === 'Gold' && user.level !== 'Gold') {
            alert(`Congratulations! You've earned 50 points (total: ${updatedPoints}) and have been upgraded to Gold Member status!`);
          } else {
            alert(`Thank you for reporting a found item! You've earned 50 points (total: ${updatedPoints}).`);
          }
        }
        
        // Special alert for emergency items
        if (formData.isEmergency) {
          alert('EMERGENCY NOTICE: This valuable item has been reported with priority status. Our team will take immediate action to find the owner.');
        } else {
          alert('Thank you for reporting a found item! We will try to find its owner.');
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Edit Found Item' : 'Report a Found Item'}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Please provide as much detail as possible to help us find the owner.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {isHighValueItem() && !formData.isEmergency && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This appears to be a high-value item. Consider enabling Emergency Mode for faster processing.
          </Alert>
        )}

        {formData.isEmergency && (
          <Alert severity="error" sx={{ mb: 2 }}>
            EMERGENCY MODE ACTIVE: This item will be prioritized for faster processing.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportFoundItem; 