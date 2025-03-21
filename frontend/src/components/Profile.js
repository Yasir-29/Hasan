import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Grid, Card, CardContent, CardMedia, CardActions, Button, Chip, Avatar, Divider, List, ListItem, ListItemText, ListItemAvatar, Badge } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportedItems, setReportedItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    points: 120,
    badges: ['Good Samaritan', 'Frequent Finder', 'Community Hero'],
    level: 'Gold'
  };

  // Load items from localStorage when component mounts
  useEffect(() => {
    // Load lost items
    const storedLostItems = localStorage.getItem('userLostItems');
    if (storedLostItems) {
      setReportedItems(JSON.parse(storedLostItems));
    }

    // Load found items
    const storedFoundItems = localStorage.getItem('userFoundItems');
    if (storedFoundItems) {
      setFoundItems(JSON.parse(storedFoundItems));
    }
  }, []);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'match',
      message: 'We found a potential match for your lost iPhone!',
      date: '2023-03-03',
      isRead: false
    },
    {
      id: 2,
      type: 'reward',
      message: 'You earned 50 points for returning the Gold Ring!',
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Function to mark a lost item as found
  const handleMarkAsFound = (itemId) => {
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
  };

  // Function to mark a found item as returned
  const handleMarkAsReturned = (itemId) => {
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
  };

  // Function to delete a lost item
  const handleDeleteLostItem = (itemId) => {
    const updatedItems = reportedItems.filter(item => item.id !== itemId);
    setReportedItems(updatedItems);
    localStorage.setItem('userLostItems', JSON.stringify(updatedItems));
  };

  // Function to delete a found item
  const handleDeleteFoundItem = (itemId) => {
    const updatedItems = foundItems.filter(item => item.id !== itemId);
    setFoundItems(updatedItems);
    localStorage.setItem('userFoundItems', JSON.stringify(updatedItems));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" component="div" gutterBottom>
                {user.name}
              </Typography>
              <Chip 
                label={`${user.level} Member`} 
                color="primary" 
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.phone}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon color="primary" sx={{ mr: 1 }} />
                  Points: {user.points}
                </Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                  Badges
                </Box>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.badges.map((badge, index) => (
                  <Chip key={index} label={badge} variant="outlined" />
                ))}
              </Box>
            </Box>
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
                            {item.description.substring(0, 100)}...
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
                          <Button size="small" color="primary">Edit</Button>
                          {!item.isResolved && (
                            <Button size="small" color="primary" onClick={() => handleMarkAsFound(item.id)}>Mark as Found</Button>
                          )}
                          <Button size="small" color="error" onClick={() => handleDeleteLostItem(item.id)}>Delete</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Found Items Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Items You Found ({foundItems.length})
                </Typography>
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
                              label={item.isResolved ? 'Returned' : 'Not Claimed'} 
                              color={item.isResolved ? 'success' : 'warning'} 
                              size="small" 
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {item.description.substring(0, 100)}...
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
                              <Typography variant="body2" color="primary">
                                <strong>Points earned:</strong> {item.pointsEarned}
                              </Typography>
                            </>
                          )}
                        </CardContent>
                        <CardActions>
                          <Button size="small" color="primary">Edit</Button>
                          {!item.isResolved && (
                            <Button size="small" color="primary" onClick={() => handleMarkAsReturned(item.id)}>Mark as Returned</Button>
                          )}
                          <Button size="small" color="error" onClick={() => handleDeleteFoundItem(item.id)}>Delete</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Notifications Tab */}
            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <List>
                  {notifications.map((notification) => (
                    <ListItem 
                      key={notification.id}
                      sx={{ 
                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: notification.isRead ? 'grey.400' : 'primary.main' }}>
                          {notification.type === 'match' ? 'M' : notification.type === 'reward' ? 'R' : 'B'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={notification.message} 
                        secondary={notification.date}
                      />
                      {!notification.isRead && (
                        <Button size="small" variant="outlined">
                          Mark as Read
                        </Button>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 