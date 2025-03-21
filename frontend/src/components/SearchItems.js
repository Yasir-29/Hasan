import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Paper, Card, CardContent, CardMedia, CardActions, Chip, Divider, CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { searchItems, getAllItems } from '../services/api';

const SearchItems = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    dateFrom: null,
    dateTo: null,
    location: '',
    color: '',
    status: 'all' // 'lost', 'found', 'all'
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all items when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const items = await getAllItems();
        setSearchResults(items);
        setError(null);
      } catch (err) {
        setError('Failed to load items. Please try again later.');
        console.error('Error loading items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const categories = [
    'Electronics', 'Jewelry', 'Clothing', 'Accessories', 'Documents', 
    'Keys', 'Wallet/Purse', 'Bag/Backpack', 'Other'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'lost', label: 'Lost Items' },
    { value: 'found', label: 'Found Items' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleDateFromChange = (date) => {
    setSearchParams({
      ...searchParams,
      dateFrom: date
    });
  };

  const handleDateToChange = (date) => {
    setSearchParams({
      ...searchParams,
      dateTo: date
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Prepare search parameters
      const params = {
        ...searchParams,
        dateFrom: searchParams.dateFrom ? searchParams.dateFrom.toISOString() : null,
        dateTo: searchParams.dateTo ? searchParams.dateTo.toISOString() : null
      };

      // Remove null/empty values
      Object.keys(params).forEach(key => 
        (params[key] === null || params[key] === '') && delete params[key]
      );

      const results = await searchItems(params);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search items. Please try again.');
      console.error('Error searching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchParams({
      keyword: '',
      category: '',
      dateFrom: null,
      dateTo: null,
      location: '',
      color: '',
      status: 'all'
    });

    try {
      setLoading(true);
      setError(null);
      const items = await getAllItems();
      setSearchResults(items);
    } catch (err) {
      setError('Failed to reset search. Please try again.');
      console.error('Error resetting search:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter results based on status
  const filteredResults = searchParams.status === 'all' 
    ? searchResults 
    : searchResults.filter(item => item.status === searchParams.status);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Lost & Found Items
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSearch}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Keyword"
                name="keyword"
                value={searchParams.keyword}
                onChange={handleChange}
                placeholder="Search by name, description, etc."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={searchParams.category}
                onChange={handleChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                placeholder="City, landmark, etc."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date From"
                  value={searchParams.dateFrom}
                  onChange={handleDateFromChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date To"
                  value={searchParams.dateTo}
                  onChange={handleDateToChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                value={searchParams.color}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={searchParams.status}
                onChange={handleChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Search Results ({filteredResults.length})
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {filteredResults.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  <Chip 
                    label={item.status === 'lost' ? 'Lost' : 'Found'} 
                    color={item.status === 'lost' ? 'error' : 'success'} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {item.description.substring(0, 100)}...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Category:</strong> {item.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date:</strong> {item.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Location:</strong> {item.location}
                </Typography>
                {item.reward && (
                  <Typography variant="body2" color="error">
                    <strong>Reward:</strong> {item.reward}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">View Details</Button>
                <Button size="small" color="primary">Contact</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchItems; 