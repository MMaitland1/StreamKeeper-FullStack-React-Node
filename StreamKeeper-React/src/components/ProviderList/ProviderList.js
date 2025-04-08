/**
 * ProviderList.js
 * Displays available streaming providers for movies/TV shows
 * 
 * Features:
 * - Fetches and displays watch providers from TMDB API
 * - Organizes providers by category (Stream/Rent/Buy/Ads)
 * - Responsive chip-based UI with hover effects
 * - Loading and error states
 * - Fallback avatar for providers without logos
 * 
 * Component Structure:
 * - Loading indicator (during fetch)
 * - Error message (if fetch fails)
 * - Provider categories section
 *   - Category heading
 *   - Provider chips (with logos)
 */

import React, { useEffect, useState } from 'react';
import MainService from '../../services/MainService';
import {
  Typography,
  CircularProgress,
  Box,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';

/**
 * ProviderList Component
 * @param {string} mediaId - TMDB ID of the movie/TV show
 * @param {string} mediaType - Type of media ('movie' or 'tv')
 */
function ProviderList({ mediaId, mediaType }) {
  // Component State
  const [watchProviders, setWatchProviders] = useState(null); // Stores normalized provider data
  const [loading, setLoading] = useState(true); // Tracks data fetching status
  const [errorMessage, setErrorMessage] = useState(''); // Stores error messages

  /**
   * Data Fetching Effect
   * Fetches watch providers when component mounts or mediaId/mediaType changes
   * Handles:
   * - Different API endpoints for movies vs TV shows
   * - Region prioritization (US first)
   * - Error states
   * - Loading states
   */
  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        let providerData;
        
        // Route to appropriate service based on media type
        if (mediaType === 'movie') {
          providerData = await MainService.getMovieWatchProviders(mediaId);
        } else if (mediaType === 'tv') {
          providerData = await MainService.getTvShowWatchProviders(mediaId);
        } else {
          throw new Error('Invalid media type');
        }

        // Normalize provider data - prefer US region or fallback to first available
        const countryProviders =
          providerData && Object.keys(providerData).length > 0
            ? providerData.US || Object.values(providerData)[0]
            : null;

        setWatchProviders(countryProviders);
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMessage('An error occurred while fetching watch providers.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if required props are available
    if (mediaId && mediaType) fetchWatchProviders();
  }, [mediaId, mediaType]);

  /**
   * Render States
   * Handles conditional rendering based on component state
   */
  if (loading) return <CircularProgress />; // Loading indicator
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>; // Error state
  if (!watchProviders) return null; // No providers available

  /**
   * Provider Categories Configuration
   * Defines the display structure for different purchase types
   * Each category will only render if providers exist for that type
   */
  const providerCategories = [
    { key: 'flatrate', label: 'Stream' }, // Subscription services
    { key: 'rent', label: 'Rent' }, // Rental options
    { key: 'buy', label: 'Buy' }, // Purchase options
    { key: 'ads', label: 'Watch with Ads' }, // Ad-supported viewing
  ];

  return (
    <Box mt={2}>
      {/* Section Header */}
      <Typography variant="h6">Where to Watch</Typography>
      
      {/* Dynamic Provider Categories */}
      {providerCategories.map(
        (category) =>
          // Only render category if providers exist
          watchProviders[category.key] && watchProviders[category.key].length > 0 && (
            <Box mt={1} key={category.key}>
              {/* Category Heading */}
              <Typography variant="subtitle1">{category.label}</Typography>
              
              {/* Provider Chips Container */}
              <Box display="flex" flexWrap="wrap" gap={1}>
                {watchProviders[category.key].map((provider) => (
                  <Chip
                    key={provider.provider_id}
                    label={provider.provider_name}
                    avatar={
                      provider.logo_path ? (
                        // TMDB logo image (45px width)
                        <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                      ) : (
                        // Fallback avatar with first letter
                        <Avatar>{provider.provider_name[0]}</Avatar>
                      )
                    }
                    sx={{
                      // Base chip styling
                      backgroundColor: '#D3D3D3',
                      color: '#000000',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)',
                      transition: 'all 0.3s ease-in-out',
                      
                      // Hover effects
                      '&:hover': {
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-2px) scale(.95)',
                      },
                    }}
                    // Link behavior
                    component="a"
                    href={watchProviders.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                  />
                ))}
              </Box>
            </Box>
          )
      )}
    </Box>
  );
}

export default ProviderList;