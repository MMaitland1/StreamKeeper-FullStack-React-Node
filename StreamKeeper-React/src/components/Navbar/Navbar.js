import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Alert, Box, useMediaQuery } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService';
import SearchBar from '../SearchBar/SearchBar';



/**
 * Navbar.js
 * Main navigation component with health check functionality
 * 
 * Primary Features:
 * - Real-time service health monitoring with visual alerts
 * - Fully responsive design adapting to mobile/desktop views
 * - Intelligent search bar that appears contextually
 * - Dynamic content display based on current route
 * - Multi-service alert system with auto-dismissal
 * - Route prefetching for performance optimization
 * 
 * Component Architecture:
 * - AppBar (root container)
 *   - Toolbar (main navigation row)
 *     - Logo/Title section
 *     - Navigation controls section
 * - Alert system (fixed position)
 */

function Navbar() {
  /**
   * Navigation and Layout Hooks
   * - navigate: Programmatic routing
   * - location: Current route information
   * - isMobile: Responsive breakpoint flag (720px threshold)
   */
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:720px)');

  /**
   * Alert System State
   * - showAlerts: Visibility toggle
   * - alertType: 'success' or 'error'
   * - alertCount: Number of active alerts
   * - errorMessages: Array of messages to display
   */
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

  /**
   * Service Health Check Handler
   * Performs parallel health checks on all backend services:
   * 1. TMDB Service
   * 2. Movie Service
   * 3. TV Show Service
   * 4. Person Service
   * 5. TMDB API Key validation
   * 
   * Process:
   * - Executes all checks concurrently using Promise.allSettled
   * - Filters failed responses and formats error messages
   * - Updates alert state with results
   * - Displays alerts for 4 seconds (see useEffect below)
   */
  const handleTitleClick = async () => {
    try {
      const serviceNames = [
        'TMDB Service',
        'Movie Service',
        'TV Show Service',
        'Person Service',
        'TMDB API Key'
      ];

      const checks = [
        MainService.checkHealthTMDBService(),
        MainService.checkHealthMovieService(),
        MainService.checkHealthTvShowService(),
        MainService.checkHealthPersonService(),
        MainService.validateApiKey()
      ];

      const responses = await Promise.allSettled(checks);

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
   * Alert Auto-dismiss Timer Effect
   * - Sets a 4-second timeout when alerts are shown
   * - Cleans up timer on unmount or when showAlerts changes
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
   * Determines which elements to show based on:
   * - Current route (location.pathname)
   * - Viewport size (isMobile)
   */
  const shouldShowSearchBar = !isMobile && location.pathname !== '/' && !location.pathname.includes('search');
  const shouldShowBrowseButton = (location.pathname === '/' || !isMobile) && location.pathname !== '/browse';

  /**
   * Route Prefetching Handlers
   * Triggered on hover to preload:
   * - Browse page resources
   * - Home page resources
   */
  const handleBrowseHover = () => {
    PrefetchService.performPrefetch('Browse');
  };

  const handleNavbarHover = () => {
    PrefetchService.performPrefetch('Home');
  };

  return (
    <>
      {/* 
        Main Navigation Bar 
        Features:
        - Gradient background
        - Consistent border radius
        - Shadow effect
      */}
      <AppBar
        position="static"
        sx={{ 
          background: 'linear-gradient(120deg, black, #f20000)', 
          borderRadius: '12px' 
        }}
      >
        {/* 
          Toolbar Container 
          Layout:
          - Space-between alignment
          - Consistent padding
          - Shadow effect
        */}
        <Toolbar 
          sx={{ 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          {/* 
            Logo and Title Section
            Contains:
            - Clickable logo (triggers health check)
            - Home navigation text (conditionally shown)
          */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          </Box>

          {/* 
            Navigation Controls Section
            Conditionally renders:
            - Browse button
            - Search bar
          */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

            {/* 
              Search Bar 
              Only shown:
              - On non-mobile views
              - When not on home page
              - When not already on search page
            */}
            {shouldShowSearchBar && <SearchBar />}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 
        Alert Notification System
        Features:
        - Fixed position at bottom-left
        - Stacked alert messages
        - Auto-dismiss after 4 seconds
        - Success/error variants
      */}
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