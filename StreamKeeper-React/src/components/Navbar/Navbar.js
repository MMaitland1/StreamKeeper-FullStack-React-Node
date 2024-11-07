import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Alert, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../images/Logo.png';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService'; // Import PrefetchService
import SearchBar from '../SearchBar/SearchBar'; // Import the SearchBar component

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertCount, setAlertCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);

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

  const shouldShowSearchBar = location.pathname !== '/' && !location.pathname.includes('search');
  const shouldShowBrowseButton = location.pathname !== '/browse';

  // New hover handler for prefetching data
  const handleNavbarHover = () => {
    PrefetchService.performPrefetch('Home'); // Example prefetch; change 'Home' to your desired page
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ background: 'linear-gradient(120deg, black, #f20000)  ' , borderRadius: '12px'  }}
      >
        <Toolbar sx={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}> {/* Drop shadow for Toolbar */}
          <img
            src={logo}
            alt="App Logo"
            style={{
              marginRight: 16,
              width: 150,
              height: 'auto',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
            onClick={handleTitleClick}
          />
          <div style={{ flexGrow: 1 }}>
            {location.pathname !== '/' && (
              <Typography
                variant="h6"
                sx={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px'
                }}
                onMouseEnter={handleNavbarHover}
                onClick={() => navigate('/')}
              >
                Stream Keeper
              </Typography>
            )}
          </div>
          {shouldShowSearchBar && <SearchBar />}
          {shouldShowBrowseButton && (
            <Button
              color="inherit"
              component={Link}
              to="/browse"
              sx={{
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: 'inherit' // No hover background color change
                },
                transition: 'none' // No hover animation
              }}
            >
              Browse
            </Button>
          )}
        </Toolbar>
      </AppBar>
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
