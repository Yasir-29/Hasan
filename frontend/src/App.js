import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import ReportLostItem from './components/ReportLostItem';
import ReportFoundItem from './components/ReportFoundItem';
import SearchItems from './components/SearchItems';
import MapView from './components/MapView';
import Profile from './components/Profile';
import { isAuthenticated } from './services/authService';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchItems />} />
          <Route
            path="/report-lost"
            element={
              <ProtectedRoute>
                <ReportLostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-found"
            element={
              <ProtectedRoute>
                <ReportFoundItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-lost/:id"
            element={
              <ProtectedRoute>
                <ReportLostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-found/:id"
            element={
              <ProtectedRoute>
                <ReportFoundItem />
              </ProtectedRoute>
            }
          />
          <Route path="/map" element={<MapView />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
