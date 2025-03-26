import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip, Avatar, Divider, List, ListItem, ListItemText, ListItemAvatar, Badge, TextField, LinearProgress, Alert, Collapse, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DiamondIcon from '@mui/icons-material/Diamond';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BadgeIcon from '@mui/icons-material/Badge';
import PublicIcon from '@mui/icons-material/Public';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LaptopIcon from '@mui/icons-material/Laptop';
import CloseIcon from '@mui/icons-material/Close';
import { deleteLostItem, deleteFoundItem } from '../services/api';

// Badge definitions with descriptions and icons
const badgeDefinitions = {
  'First Find': { 
    description: 'Awarded for reporting your first found item', 
    icon: SearchIcon,
    color: '#2196f3' // blue
  },
  'Helpful Citizen': { 
    description: 'Awarded for reporting 5 found items', 
    icon: VolunteerActivismIcon,
    color: '#4caf50' // green
  },
  'Community Hero': { 
    description: 'Awarded for reporting 10 found items', 
    icon: SecurityIcon,
    color: '#ff9800' // orange
  },
  'Lost & Found Expert': { 
    description: 'Awarded for reporting 20 found items', 
    icon: EmojiEventsIcon,
    color: '#f44336' // red
  },
  'Good Samaritan': { 
    description: 'Awarded for returning your first item to its owner', 
    icon: CardGiftcardIcon,
    color: '#9c27b0' // purple
  },
  'Returned With Care': { 
    description: 'Awarded for returning 5 items to their owners', 
    icon: CardGiftcardIcon,
    color: '#673ab7' // deep purple
  },
  'Reunion Master': { 
    description: 'Awarded for returning 10 items to their owners', 
    icon: EmojiEventsIcon,
    color: '#ffd700' // gold
  },
  'Tech Finder': { 
    description: 'Awarded for finding electronic items', 
    icon: LaptopIcon,
    color: '#607d8b' // blue grey
  },
  'Treasure Hunter': { 
    description: 'Awarded for finding jewelry', 
    icon: DiamondIcon,
    color: '#e91e63' // pink
  },
  'Document Rescuer': { 
    description: 'Awarded for finding important documents', 
    icon: InsertDriveFileIcon,
    color: '#795548' // brown
  },
  'Wallet Saver': { 
    description: 'Awarded for finding wallets or purses', 
    icon: AccountBalanceWalletIcon,
    color: '#ff5722' // deep orange
  },
  'ID Guardian': { 
    description: 'Awarded for finding identification', 
    icon: BadgeIcon,
    color: '#3f51b5' // indigo
  },
  'Global Citizen Helper': { 
    description: 'Awarded for finding passports', 
    icon: PublicIcon,
    color: '#009688' // teal
  },
  'Financial Protector': { 
    description: 'Awarded for finding credit/debit cards', 
    icon: CreditCardIcon,
    color: '#00bcd4' // cyan
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [reportedItems, setReportedItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Check for newly added items
  useEffect(() => {
    // This effect runs when the component mounts or when location changes
    // We'll use the presence of the state property from navigation to determine
    // if we should show the alert
    if (location.state?.newItem) {
      const itemType = location.state.itemType || 'item';
      setAlertMessage(`Your ${itemType} has been successfully added to your profile.`);
      setAlertSeverity(location.state.severity || 'success');
      setShowAlert(true);
      
      // Set the appropriate tab
      if (itemType === 'lost item') {
        setTabValue(0);
      } else if (itemType === 'found item') {
        setTabValue(1);
      }
      
      // Clear the navigation state to prevent the alert from showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setEditFormData(parsedUser);
    } else {
      // Mock user data for demonstration
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        bio: 'I am a software developer who loves to help others find their lost items.',
        points: 120,
        badges: ['Good Samaritan', 'Frequent Finder', 'Community Hero'],
        level: 'Gold'
      };
      setUserData(mockUser);
      setEditFormData(mockUser);
    }

    // Load lost items
    const storedLostItems = localStorage.getItem('userLostItems');
    if (storedLostItems) {
      setReportedItems(JSON.parse(storedLostItems));
    } else {
      // Create sample lost items for testing
      const sampleLostItems = [
        {
          id: '1001',
          name: 'iPhone 13',
          category: 'Electronics',
          description: 'Black iPhone 13 with red case. Lock screen has a picture of a dog.',
          date: '2023-08-15',
          location: 'Central Park near the fountain',
          isResolved: false,
          reward: '$50',
          image: 'https://via.placeholder.com/150'
        },
        {
          id: '1002',
          name: 'Gold Watch',
          category: 'Jewelry',
          description: 'Vintage gold watch with brown leather strap. Has engraving on the back.',
          date: '2023-09-01',
          location: 'Downtown bus stop',
          isResolved: true,
          resolvedDate: '2023-09-10',
          image: 'https://via.placeholder.com/150'
        }
      ];
      setReportedItems(sampleLostItems);
      localStorage.setItem('userLostItems', JSON.stringify(sampleLostItems));
    }

    // Load found items
    const storedFoundItems = localStorage.getItem('userFoundItems');
    if (storedFoundItems) {
      setFoundItems(JSON.parse(storedFoundItems));
    } else {
      // Create sample found items for testing
      const sampleFoundItems = [
        {
          id: '2001',
          name: 'Blue Wallet',
          category: 'Wallet/Purse',
          description: 'Small blue leather wallet containing some cash and credit cards.',
          date: '2023-08-20',
          location: 'Coffee shop on Main St',
          isResolved: false,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: '2002',
          name: 'Umbrella',
          category: 'Accessories',
          description: 'Black and white striped umbrella with wooden handle.',
          date: '2023-09-05',
          location: 'Library entrance',
          isResolved: true,
          resolvedDate: '2023-09-12',
          pointsEarned: 30,
          image: 'https://via.placeholder.com/150'
        }
      ];
      setFoundItems(sampleFoundItems);
      localStorage.setItem('userFoundItems', JSON.stringify(sampleFoundItems));
    }
    
    // Load notifications from localStorage
    const storedNotifications = localStorage.getItem('userNotifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Create sample notifications for testing
      const sampleNotifications = [
        {
          id: 1,
          type: 'match',
          message: 'We found a potential match for your lost iPhone!',
          date: '2023-03-03',
          isRead: false
        },
        {
          id: 2,
          type: 'points',
          message: 'You earned 50 points for reporting a found item!',
          date: '2023-03-05',
          isRead: true
        },
        {
          id: 3,
          type: 'badge',
          message: 'Congratulations! You earned the "Good Samaritan" badge.',
          date: '2023-03-05',
          isRead: true
        }
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem('userNotifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Mark notifications as read when the notifications tab is selected
    if (newValue === 2 && notifications.some(n => !n.isRead)) {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      setNotifications(updatedNotifications);
      localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    }
  };

  // Function to mark a lost item as found
  const handleMarkAsFound = (itemId) => {
    if (!itemId) {
      setError("Cannot update item: Item ID is missing");
      return;
    }
    
    try {
      console.log("Marking lost item as found:", itemId);
      
      const updatedItems = reportedItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            isResolved: true,
            resolvedDate: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      });
      
      setReportedItems(updatedItems);
      localStorage.setItem('userLostItems', JSON.stringify(updatedItems));
      
      // Show feedback
      alert('Item has been marked as found!');
    } catch (err) {
      setError("Failed to mark item as found");
      console.error("Error marking item as found:", err);
    }
  };

  // Function to mark a found item as returned
  const handleMarkAsReturned = (itemId) => {
    if (!itemId) {
      setError("Cannot update item: Item ID is missing");
      return;
    }
    
    try {
      console.log("Marking found item as returned:", itemId);
      
      const updatedItems = foundItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            isResolved: true,
            resolvedDate: new Date().toISOString().split('T')[0],
            pointsEarned: 50 // Arbitrary points for returning an item
          };
        }
        return item;
      });
      
      setFoundItems(updatedItems);
      localStorage.setItem('userFoundItems', JSON.stringify(updatedItems));
      
      // Update user points
      if (userData) {
        const updatedPoints = (userData.points || 0) + 50;
        const updatedLevel = updatedPoints >= 500 ? 'Gold' : userData.level || 'Regular';
        
        const updatedUser = {
          ...userData,
          points: updatedPoints,
          level: updatedLevel
        };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Add notification for earning points
        const newNotification = {
          id: Date.now(),
          type: updatedLevel === 'Gold' && userData.level !== 'Gold' ? 'gold' : 'points',
          message: updatedLevel === 'Gold' && userData.level !== 'Gold'
            ? `Congratulations! You've earned 50 points and reached Gold Member status!`
            : `You earned 50 points for returning a found item!`,
          date: new Date().toISOString().split('T')[0],
          isRead: false
        };
        
        const updatedNotifications = [newNotification, ...notifications];
        setNotifications(updatedNotifications);
        localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
        
        // Award badges based on number of returned items
        const returnedItems = foundItems.filter(item => item.isResolved || item.id === itemId).length;
        
        // Determine which badges to award for returning items
        let newBadges = [];
        if (returnedItems >= 1 && !userData.badges?.includes('Good Samaritan')) {
          newBadges.push('Good Samaritan');
        }
        if (returnedItems >= 5 && !userData.badges?.includes('Returned With Care')) {
          newBadges.push('Returned With Care');
        }
        if (returnedItems >= 10 && !userData.badges?.includes('Reunion Master')) {
          newBadges.push('Reunion Master');
        }
        
        // If there are new badges, update user badges
        if (newBadges.length > 0) {
          const currentBadges = userData.badges || [];
          const updatedBadges = [...currentBadges, ...newBadges];
          
          // Update user with new badges
          const userWithBadges = {
            ...updatedUser,
            badges: updatedBadges
          };
          
          setUserData(userWithBadges);
          localStorage.setItem('user', JSON.stringify(userWithBadges));
          
          // Add notifications for each new badge
          const badgeNotifications = newBadges.map(badge => ({
            id: Date.now() + Math.random(), // Ensure unique ID
            type: 'badge',
            message: `Congratulations! You've earned the "${badge}" badge!`,
            date: new Date().toISOString().split('T')[0],
            isRead: false
          }));
          
          const updatedWithBadges = [...badgeNotifications, ...updatedNotifications];
          setNotifications(updatedWithBadges);
          localStorage.setItem('userNotifications', JSON.stringify(updatedWithBadges));
          
          // Show badge alert along with the points notification
          const badgeMessage = newBadges.length === 1
            ? `You've also earned the "${newBadges[0]}" badge!`
            : `You've also earned ${newBadges.length} new badges: ${newBadges.join(', ')}!`;
          
          alert(`Item has been marked as returned! You earned 50 points.\n\nCongratulations! ${badgeMessage}`);
          return; // Skip the standard alert below
        }
      }
      
      // Show feedback
      alert('Item has been marked as returned! You earned 50 points.');
    } catch (err) {
      setError("Failed to mark item as returned");
      console.error("Error marking item as returned:", err);
    }
  };

  // Function to navigate to the edit page for a lost item
  const handleEditLostItem = (item) => {
    // Make sure item has an ID, if not, don't attempt to navigate
    if (!item.id) {
      setError("Cannot edit item: Item ID is missing");
      return;
    }
    
    console.log("Editing lost item:", item);
    navigate(`/edit-lost/${item.id}`, { state: { isEditing: true, item } });
  };

  // Function to navigate to the edit page for a found item
  const handleEditFoundItem = (item) => {
    // Make sure item has an ID, if not, don't attempt to navigate
    if (!item.id) {
      setError("Cannot edit item: Item ID is missing");
      return;
    }
    
    console.log("Editing found item:", item);
    navigate(`/edit-found/${item.id}`, { state: { isEditing: true, item } });
  };

  // Function to delete a lost item
  const handleDeleteLostItem = async (itemId) => {
    // Check if the ID exists
    if (!itemId) {
      setError("Cannot delete item: Item ID is missing");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Deleting lost item with ID:", itemId);
      
      // Handle mock data (IDs starting with '10')
      const isMockItem = typeof itemId === 'string' && itemId.startsWith('10');
      
      if (!isMockItem) {
        // Call API to delete the item (only for real items)
        await deleteLostItem(itemId);
      } else {
        // Simulate API delay for mock items
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Update local state
      const updatedItems = reportedItems.filter(item => item.id !== itemId);
      setReportedItems(updatedItems);
      localStorage.setItem('userLostItems', JSON.stringify(updatedItems));
      
      setLoading(false);
      alert('Item deleted successfully');
    } catch (err) {
      setLoading(false);
      const errorMsg = err.message || 'Failed to delete item. Please try again.';
      setError(errorMsg);
      console.error('Error deleting lost item:', err);
    }
  };

  // Function to delete a found item
  const handleDeleteFoundItem = async (itemId) => {
    // Check if the ID exists
    if (!itemId) {
      setError("Cannot delete item: Item ID is missing");
      return;
    }
    
    try {
      setLoading(true);
      console.log("Deleting found item with ID:", itemId);
      
      // Handle mock data (IDs starting with '20')
      const isMockItem = typeof itemId === 'string' && itemId.startsWith('20');
      
      if (!isMockItem) {
        // Call API to delete the item (only for real items)
        await deleteFoundItem(itemId);
      } else {
        // Simulate API delay for mock items
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Update local state
      const updatedItems = foundItems.filter(item => item.id !== itemId);
      setFoundItems(updatedItems);
      localStorage.setItem('userFoundItems', JSON.stringify(updatedItems));
      
      setLoading(false);
      alert('Item deleted successfully');
    } catch (err) {
      setLoading(false);
      const errorMsg = err.message || 'Failed to delete item. Please try again.';
      setError(errorMsg);
      console.error('Error deleting found item:', err);
    }
  };

  // Handle profile edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setUserData(editFormData);
    localStorage.setItem('user', JSON.stringify(editFormData));
    setIsEditing(false);
  };

  if (!userData) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Alert for newly added items */}
      <Collapse in={showAlert}>
        <Alert 
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowAlert(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            {isEditing ? (
              // Edit Profile Form
              <Box component="form">
                <Typography variant="h6" gutterBottom>
                  Edit Profile
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Full Name"
                      value={editFormData.name || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      value={editFormData.email || ''}
                      onChange={handleEditFormChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="phone"
                      label="Phone"
                      value={editFormData.phone || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address"
                      label="Address"
                      value={editFormData.address || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="city"
                      label="City"
                      value={editFormData.city || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="state"
                      label="State"
                      value={editFormData.state || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="zipCode"
                      label="Zip Code"
                      value={editFormData.zipCode || ''}
                      onChange={handleEditFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="bio"
                      label="Bio"
                      value={editFormData.bio || ''}
                      onChange={handleEditFormChange}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="outlined" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              // Profile Display
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography variant="h5" component="div" gutterBottom>
                    {userData.name}
                  </Typography>
                  <Chip 
                    label={`${userData.level} Member`} 
                    color={userData.level === 'Gold' ? 'warning' : 'primary'} 
                    sx={{ 
                      mb: 1,
                      fontWeight: userData.level === 'Gold' ? 'bold' : 'normal',
                      bgcolor: userData.level === 'Gold' ? 'gold' : undefined,
                      color: userData.level === 'Gold' ? 'black' : undefined
                    }}
                    icon={userData.level === 'Gold' ? <EmojiEventsIcon /> : undefined}
                  />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ mb: 2 }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                      {userData.email}
                    </Box>
                  </Typography>
                  {userData.phone && (
                    <Typography variant="body2" gutterBottom>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: 'small', color: 'text.secondary' }} />
                        {userData.phone}
                      </Box>
                    </Typography>
                  )}
                  {(userData.address || userData.city) && (
                    <Typography variant="body2" gutterBottom>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, mt: 0.5, fontSize: 'small', color: 'text.secondary' }} />
                        <Box>
                          {userData.address && <span>{userData.address}</span>}
                          {userData.address && (userData.city || userData.state) && <br />}
                          {userData.city && userData.state && (
                            <span>{`${userData.city}, ${userData.state} ${userData.zipCode || ''}`}</span>
                          )}
                        </Box>
                      </Box>
                    </Typography>
                  )}
                </Box>

                {userData.bio && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                      About Me
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {userData.bio}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon color="primary" sx={{ mr: 1 }} />
                      Points: {userData.points}
                    </Box>
                  </Typography>
                  
                  {/* Points progress bar for Gold membership */}
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress to Gold Membership
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userData.points}/500 points
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((userData.points / 500) * 100, 100)} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: userData.level === 'Gold' ? 'gold' : 'primary.main',
                        }
                      }}
                    />
                    
                    {userData.level !== 'Gold' && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Need {500 - userData.points} more points to become a Gold Member
                      </Typography>
                    )}
                    
                    {userData.level === 'Gold' && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'gold', fontWeight: 'bold' }}>
                        Congratulations! You are a Gold Member
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Report found items to earn 50 points each!
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                      Badges
                    </Box>
                  </Typography>
                  {userData.badges && userData.badges.length > 0 ? (
                    <Grid container spacing={1}>
                      {userData.badges.map((badge, index) => {
                        const badgeInfo = badgeDefinitions[badge] || { 
                          description: 'Achievement badge', 
                          icon: EmojiEventsIcon,
                          color: '#757575' // default grey
                        };
                        const BadgeIcon = badgeInfo.icon;
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper 
                              elevation={2}
                              sx={{ 
                                p: 1.5, 
                                display: 'flex', 
                                alignItems: 'center',
                                borderLeft: `4px solid ${badgeInfo.color}`,
                                height: '100%'
                              }}
                            >
                              <Avatar 
                                sx={{ 
                                  bgcolor: badgeInfo.color,
                                  mr: 1.5
                                }}
                              >
                                <BadgeIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="bold">
                                  {badge}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {badgeInfo.description}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No badges earned yet. Report found items to earn badges!
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                <Tab label="Lost Items" />
                <Tab label="Found Items" />
                <Tab label={
                  <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                    Notifications
                  </Badge>
                } />
              </Tabs>
            </Box>

            {/* Lost Items Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Lost Items ({reportedItems.length})
                </Typography>
                {reportedItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    You haven't reported any lost items yet.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {reportedItems.map((item) => (
                      <Grid item xs={12} sm={6} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.image}
                            alt={item.name}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography gutterBottom variant="h6" component="div">
                                {item.name}
                              </Typography>
                              <Chip 
                                label={item.isResolved ? 'Found' : 'Still Lost'} 
                                color={item.isResolved ? 'success' : 'error'} 
                                size="small" 
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description && item.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Date Lost:</strong> {item.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Location:</strong> {item.location}
                            </Typography>
                            {item.reward && (
                              <Typography variant="body2" color="error">
                                <strong>Reward:</strong> {item.reward}
                              </Typography>
                            )}
                            {item.isResolved && (
                              <Typography variant="body2" color="success.main">
                                <strong>Found on:</strong> {item.resolvedDate}
                              </Typography>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleEditLostItem(item)}
                              disabled={loading}
                            >
                              Edit
                            </Button>
                            {!item.isResolved && (
                              <Button 
                                size="small" 
                                color="primary" 
                                onClick={() => handleMarkAsFound(item.id)}
                                disabled={loading}
                              >
                                Mark as Found
                              </Button>
                            )}
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteLostItem(item.id)}
                              disabled={loading}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Found Items Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Items You Found ({foundItems.length})
                </Typography>
                {foundItems.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    You haven't reported any found items yet.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {foundItems.map((item) => (
                      <Grid item xs={12} sm={6} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.image}
                            alt={item.name}
                          />
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography gutterBottom variant="h6" component="div">
                                {item.name}
                              </Typography>
                              <Chip 
                                label={item.isResolved ? 'Returned' : 'Not Returned'} 
                                color={item.isResolved ? 'success' : 'warning'} 
                                size="small" 
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description && item.description.substring(0, 100)}...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Date Found:</strong> {item.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Location:</strong> {item.location}
                            </Typography>
                            {item.isResolved && (
                              <>
                                <Typography variant="body2" color="success.main">
                                  <strong>Returned on:</strong> {item.resolvedDate}
                                </Typography>
                                {item.pointsEarned && (
                                  <Typography variant="body2" color="primary">
                                    <strong>Points Earned:</strong> {item.pointsEarned}
                                  </Typography>
                                )}
                              </>
                            )}
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              color="primary" 
                              onClick={() => handleEditFoundItem(item)}
                              disabled={loading}
                            >
                              Edit
                            </Button>
                            {!item.isResolved && (
                              <Button 
                                size="small" 
                                color="primary" 
                                onClick={() => handleMarkAsReturned(item.id)}
                                disabled={loading}
                              >
                                Mark as Returned
                              </Button>
                            )}
                            <Button 
                              size="small" 
                              color="error" 
                              onClick={() => handleDeleteFoundItem(item.id)}
                              disabled={loading}
                            >
                              Delete
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Notifications Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                {notifications.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    You don't have any notifications yet.
                  </Typography>
                ) : (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem 
                        key={notification.id}
                        sx={{ 
                          bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ 
                            bgcolor: notification.isRead ? 'grey.400' : 
                              notification.type === 'gold' ? 'warning.main' :
                              notification.type === 'points' ? 'success.main' :
                              'primary.main' 
                          }}>
                            {notification.type === 'match' && <PersonIcon />}
                            {notification.type === 'points' && <StarIcon />}
                            {notification.type === 'badge' && (
                              // Try to extract badge name from message
                              (() => {
                                const badgeNameMatch = notification.message.match(/earned the "([^"]+)"/);
                                const badgeName = badgeNameMatch ? badgeNameMatch[1] : '';
                                const badgeInfo = badgeDefinitions[badgeName];
                                
                                if (badgeInfo) {
                                  const BadgeIcon = badgeInfo.icon;
                                  return <BadgeIcon style={{ color: badgeInfo.color }} />;
                                }
                                return <EmojiEventsIcon />;
                              })()
                            )}
                            {notification.type === 'gold' && <EmojiEventsIcon />}
                            {!['match', 'points', 'badge', 'gold'].includes(notification.type) && <NotificationsIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={notification.message} 
                          secondary={notification.date} 
                          primaryTypographyProps={{
                            fontWeight: notification.isRead ? 'normal' : 'bold'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 