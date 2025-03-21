import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Lost & Found
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/report-lost">Report Lost</Button>
          <Button color="inherit" component={Link} to="/report-found">Report Found</Button>
          <Button color="inherit" component={Link} to="/search">Search</Button>
          <Button color="inherit" component={Link} to="/map">Map</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 