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

function ProviderList({ mediaId, mediaType }) {
  const [watchProviders, setWatchProviders] = useState(null); // State to store watch provider data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  // Fetch watch provider data when component mounts or when mediaId/mediaType changes
  useEffect(() => {
    const fetchWatchProviders = async () => {
      try {
        let providerData;
        // Fetch watch provider data based on the media type (movie or TV)
        if (mediaType === 'movie') {
          providerData = await MainService.getMovieWatchProviders(mediaId);
        } else if (mediaType === 'tv') {
          providerData = await MainService.getTvShowWatchProviders(mediaId);
        } else {
          throw new Error('Invalid media type'); // Handle invalid media types
        }

        // Extract watch providers for the US or use the first available region
        const countryProviders =
          providerData && Object.keys(providerData).length > 0
            ? providerData.US || Object.values(providerData)[0]
            : null;

        setWatchProviders(countryProviders);
      } catch (error) {
        // Handle errors
        setErrorMessage('An error occurred while fetching watch providers.');
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    };

    // Only fetch data if mediaId and mediaType are provided
    if (mediaId && mediaType) fetchWatchProviders();
  }, [mediaId, mediaType]);

  // Display a loading indicator while data is being fetched
  if (loading) return <CircularProgress />;
  // Display an error message if an error occurred during data fetching
  if (errorMessage) return <Alert severity="error">{errorMessage}</Alert>;
  // Return null if no watch providers are found
  if (!watchProviders) return null;

  // Define provider categories to render dynamically
  const providerCategories = [
    { key: 'flatrate', label: 'Stream' },
    { key: 'rent', label: 'Rent' },
    { key: 'buy', label: 'Buy' },
    { key: 'ads', label: 'Watch with Ads' },
  ];

  return (
    <Box mt={2}>
      <Typography variant="h6">Where to Watch</Typography>
      {providerCategories.map(
        (category) =>
          watchProviders[category.key] && watchProviders[category.key].length > 0 && (
            <Box mt={1} key={category.key}>
              <Typography variant="subtitle1">{category.label}</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {watchProviders[category.key].map((provider) => (
                  <Chip
                    key={provider.provider_id} // Unique key for each provider
                    label={provider.provider_name} // Display provider name
                    avatar={
                      provider.logo_path ? ( // Display provider logo if available
                        <Avatar src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} />
                      ) : (
                        <Avatar>{provider.provider_name[0]}</Avatar> // Fallback to first letter of provider name
                      )
                    }
                    sx={{
                      backgroundColor: '#D3D3D3', // Pre-hover color (off-white)
                      color: '#000000', // Text color
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' ,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'white', // Hover color
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Drop shadow on hover
                        transform: 'translateY(-2px) scale(.95)', // Slight elevation
                         
                        
                      },
                    }}
                    component="a" // Render as a link
                    href={watchProviders.link} // Link to the provider's page
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
