/**
 * TvShowDetailPage.js
 * 
 * This component displays detailed information about a TV show, including:
 * - Show poster and basic info
 * - Streaming provider availability
 * - Show overview and metadata
 * - Recommendations and similar shows
 * 
 * Data Flow:
 * 1. Gets TV show ID from URL parameters
 * 2. Fetches show details, recommendations, and similar shows
 * 3. Displays loading state while fetching
 * 4. Renders content or error message
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import MainService from '../services/MainService'; // Service for API requests
import { Container, Typography, CircularProgress, Alert, Box, Grid, Rating } from '@mui/material';
import TvShow from '../models/TvShow'; // TVShow model class
import ProviderList from '../components/ProviderList/ProviderList'; // Component for streaming providers
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel'; // Component for recommendations

// Color constants for consistent styling
const WHITE = "white"; // Primary text color
const OFF_WHITE = "#D3D3D4"; // Secondary text color

function TvShowDetailPage() {
  // Get TV show ID from URL parameters
  const { id } = useParams();

  // State management
  const [tvShow, setTvShow] = useState(null); // Stores TV show details
  const [loading, setLoading] = useState(true); // Toggles loading state
  const [errorMessage, setErrorMessage] = useState(''); // Stores error messages
  const [recommendations, setRecommendations] = useState([]); // Stores recommended shows
  const [similarTvShows, setSimilarTvShows] = useState([]); // Stores similar shows

  /**
   * useEffect hook for data fetching
   * Runs when component mounts or when ID changes
   * Fetches:
   * - TV show details
   * - Recommended shows
   * - Similar shows
   */
  useEffect(() => {
    // Fetches primary TV show details
    const fetchTvShowDetails = async () => {
      try {
        const data = await MainService.getTvShowById(id); // API call
        const tvShowInstance = new TvShow(data); // Create TvShow model instance
        setTvShow(tvShowInstance); // Update state
      } catch (error) {
        setErrorMessage('An error occurred while fetching the TV show details.');
      } finally {
        setLoading(false); // End loading
      }
    };

    // Fetches recommended TV shows
    const fetchRecommendations = async () => {
      try {
        const recommendedData = await MainService.getTvShowRecommendations(id);
        const transformedRecommendations = recommendedData.map(item => new TvShow(item));
        setRecommendations(transformedRecommendations);
      } catch (error) {
        setErrorMessage('Failed to fetch recommendations.');
      }
    };
  
    // Fetches similar TV shows
    const fetchSimilarTvShows = async () => {
      try {
        const similarData = await MainService.getSimilarTvShows(id);
        const transformedSimilarShows = similarData.map(item => new TvShow(item));
        setSimilarTvShows(transformedSimilarShows);
      } catch (error) {
        setErrorMessage('Failed to fetch similar TV shows.');
      }
    };

    // Execute all fetches if ID exists
    if (id) {
      fetchTvShowDetails();
      fetchRecommendations();
      fetchSimilarTvShows();
    }
  }, [id]); // Dependency array ensures effect runs when ID changes

  // Loading state UI
  if (loading) {
    return (
      <Container style={{ marginTop: '20px', textAlign: 'center' }}>
        <CircularProgress /> {/* Material-UI loading spinner */}
      </Container>
    );
  }

  // Error state UI
  if (errorMessage) {
    return (
      <Container style={{ marginTop: '20px' }}>
        <Alert severity="error">{errorMessage}</Alert> {/* Material-UI error alert */}
      </Container>
    );
  }

  // Main component render
  return (
    <Container style={{ marginTop: '20px' }}>
      {/* Main content grid - 2 columns on desktop, stacked on mobile */}
      <Grid container spacing={4}>
        {/* Left Column (Poster and Providers) */}
        <Grid item xs={12} md={4}>
          {/* TV Show Poster Image */}
          <Box>
            <img
              src={tvShow?.posterUrl || 'placeholder.jpg'} // Fallback to placeholder if no poster
              alt={tvShow?.name || 'TV Show Poster'}
              style={{ 
                width: '100%', 
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' // Visual enhancement
              }}
            />
          </Box>
          
          {/* Streaming Providers List */}
          <ProviderList 
            mediaId={id} 
            mediaType="tv" // Specifies we're showing TV providers
          />
        </Grid>

        {/* Right Column (Show Details) */}
        <Grid item xs={12} md={8}>
          {/* Show Title and Year */}
          <Typography variant="h4" gutterBottom style={{ color: WHITE }}>
            {tvShow?.name || 'N/A'}{' '}
            <Typography variant="subtitle1" component="span" style={{ color: WHITE }}>
              ({tvShow?.firstAirDate ? tvShow.firstAirDate.split('-')[0] : 'Unknown'})
            </Typography>
          </Typography>
          
          {/* Original Title */}
          <Typography variant="subtitle1" style={{ color: WHITE }} gutterBottom>
            Original Name: <span style={{ color: OFF_WHITE }}>{tvShow?.originalName || 'N/A'}</span>
          </Typography>
          
          {/* Show Overview */}
          <Typography variant="body1" paragraph style={{ color: OFF_WHITE }}>
            {tvShow?.overview || 'No overview available.'}
          </Typography>

          {/* Show Metadata Section */}
          <Box my={2}>
            <Typography variant="h6" style={{ color: WHITE }}>TV Show Information</Typography>
            
            {/* Metadata Grid - 2 columns on mobile, 4 on desktop */}
            <Grid container spacing={2}>
              {/* First Air Date */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  First Air Date:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>
                  {tvShow?.firstAirDate || 'Unknown'}
                </Typography>
              </Grid>
              
              {/* Popularity Score */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Popularity:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>
                  {tvShow?.popularity?.toFixed(1) || 'N/A'}
                </Typography>
              </Grid>
              
              {/* User Rating */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Vote Average:
                </Typography>
                {/* Material-UI rating component (converted from 10 to 5 star scale) */}
                <Rating
                  name="read-only"
                  value={tvShow?.voteAverage / 2 || 0}
                  readOnly
                  precision={0.1}
                />
                <Typography variant="body1" style={{ color: OFF_WHITE }}>
                  {tvShow?.voteAverage ? tvShow.voteAverage.toFixed(1) : 'N/A'} / 10
                </Typography>
              </Grid>
              
              {/* Vote Count */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Vote Count:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>
                  {tvShow?.voteCount || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Backdrop Image (if available) */}
          {tvShow?.backdropUrl && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: WHITE }}>Backdrop</Typography>
              <img
                src={tvShow.backdropUrl}
                alt={`${tvShow.name} backdrop`}
                style={{ 
                  width: '100%', 
                  borderRadius: '8px', 
                  marginTop: '10px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)'
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Recommended Shows Carousel */}
      {recommendations.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Recommended TV Shows
          </Typography>
          <DisplayCardCarousel 
            items={recommendations} 
            cardType="A" // Specifies card style
          />
        </Box>
      )}

      {/* Similar Shows Carousel */}
      {similarTvShows.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Similar TV Shows
          </Typography>
          <DisplayCardCarousel 
            items={similarTvShows} 
            cardType="A" // Specifies card style
          />
        </Box>
      )}
    </Container>
  );
}

export default TvShowDetailPage;