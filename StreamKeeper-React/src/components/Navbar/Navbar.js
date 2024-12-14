/**
 * Navbar.js
 * Main navigation component with health check functionality
 * Features:
 * - Service health monitoring
 * - Responsive design
 * - Dynamic search bar
 * - Route-based content display
 * - Alert system for service status
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Alert, Box, useTheme, useMediaQuery } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService';
import SearchBar from '../SearchBar/SearchBar';

function Navbar() {
  /**
   * Hooks for routing and responsive design
   */
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:720px)');

  /**
   * Alert System State Management
   */
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  /**
   * Service Health Check Handler
   * Performs parallel health checks on all services
   * Updates alert state based on responses
   */
  const handleTitleClick = async () => {
    try {
      // Service definitions for health checks
      const serviceNames = [
        'TMDB Service',
        'Movie Service',
        'TV Show Service',
        'Person Service',
        'TMDB API Key'
      ];

      // Parallel health check requests
      const checks = [
        MainService.checkHealthTMDBService(),
        MainService.checkHealthMovieService(),
        MainService.checkHealthTvShowService(),
        MainService.checkHealthPersonService(),
        MainService.validateApiKey()
      ];

      const responses = await Promise.allSettled(checks);

      // Process health check responses
      const failedResponses = responses
        .map((res, index) => {
          if (res.status === 'rejected' || !res.value) {
            return index === 4
              ? 'Key is invalid'
              : `${serviceNames[index]} is not Available`;
          }
          return null;
        })
        .filter(Boolean);

      // Update alert state based on results
      if (failedResponses.length === 0) {
        setAlertType('success');
        setAlertCount(1);
        setErrorMessages([]);
      } else {
        setAlertType('error');
        setAlertCount(failedResponses.length);
        setErrorMessages(failedResponses);
      }
      setShowAlerts(true);
    } catch (error) {
      setAlertType('error');
      setAlertCount(1);
      setErrorMessages(['Unexpected error occurred while checking services.']);
      setShowAlerts(true);
    }
  };

  /**
   * Alert Auto-dismiss Timer
   * Hides alerts after 4 seconds
   */
  useEffect(() => {
    let timer;
    if (showAlerts) {
      timer = setTimeout(() => {
        setShowAlerts(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showAlerts]);

  /**
   * Conditional Display Logic
   * Determines when to show search bar and browse button based on route and screen size
   */
  const shouldShowSearchBar = !isMobile && location.pathname !== '/' && !location.pathname.includes('search');
  const shouldShowBrowseButton = (location.pathname === '/' || !isMobile) && location.pathname !== '/browse';

  /**
   * Route Prefetching Handlers
   * Preloads data for smoother navigation
   */
  const handleBrowseHover = () => {
    PrefetchService.performPrefetch('Browse');
  };

  const handleNavbarHover = () => {
    PrefetchService.performPrefetch('Home');
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <AppBar
        position="static"
        sx={{ background: 'linear-gradient(120deg, black, #f20000)', borderRadius: '12px' }}
      >
        <Toolbar 
          sx={{ 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          {/* Logo with Health Check Trigger */}
          <img
            src={logo}
            alt="App Logo"
            style={{
              width: 150,
              height: 'auto',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
            onClick={handleTitleClick}
          />
          
          {/* Desktop Search Bar Container */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              {shouldShowSearchBar && <SearchBar />}
            </Box>
          )}
          
          {/* Navigation Controls */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            marginLeft: 'auto'
          }}>
            {/* Home Navigation */}
            {location.pathname !== '/' && (
              <Typography
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={handleNavbarHover}
                onClick={() => navigate('/')}
              >
                Stream Keeper
              </Typography>
            )}
            
            {/* Browse Navigation */}
            {shouldShowBrowseButton && (
              <Button
                color="inherit"
                component={Link}
                to="/browse"
                onMouseEnter={handleBrowseHover}
                sx={{
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: 'inherit'
                  },
                  transition: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                Browse
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Alert System */}
      {showAlerts && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 10,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {alertType === 'success' ? (
            <Alert variant="filled" severity="success" sx={{ borderRadius: '8px' }}>
              Success! All services are healthy.
            </Alert>
          ) : (
            errorMessages.map((message, index) => (
              <Alert key={index} variant="filled" severity="error" sx={{ borderRadius: '8px' }}>
                {message}
              </Alert>
            ))
          )}
        </Box>
      )}
    </>
  );
}

export default Navbar;