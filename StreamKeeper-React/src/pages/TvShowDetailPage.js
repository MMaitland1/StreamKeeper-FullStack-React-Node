import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import hook to access route parameters
import MainService from '../services/MainService'; // Service to fetch TV show data
import { Container, Typography, CircularProgress, Alert, Box, Grid, Rating } from '@mui/material';
import TvShow from '../models/TvShow'; // TVShow model
import ProviderList from '../components/ProviderList/ProviderList'; // Component for displaying watch providers
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel'; // Carousel component for recommendations and similar shows

// Define color variables
const WHITE = "white";
const OFF_WHITE = "#D3D3D4";

function TvShowDetailPage() {
  const { id } = useParams(); // Get TV show ID from route parameters
  const [tvShow, setTvShow] = useState(null); // State to store TV show details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const [recommendations, setRecommendations] = useState([]); // State for storing recommended shows
  const [similarTvShows, setSimilarTvShows] = useState([]); // State for storing similar TV shows

  // Fetch TV show details and related data when component mounts or when the ID changes
  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        const data = await MainService.getTvShowById(id); // Fetch TV show details using service
        const tvShowInstance = new TvShow(data); // Create a new TvShow instance
        setTvShow(tvShowInstance);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the TV show details.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    const fetchRecommendations = async () => {
      try {
        const recommendedData = await MainService.getTvShowRecommendations(id); // Fetch recommended TV shows
        const transformedRecommendations = recommendedData.map(item => new TvShow(item));
        setRecommendations(transformedRecommendations);
      } catch (error) {
        setErrorMessage('Failed to fetch recommendations.');
      }
    };
  
    const fetchSimilarTvShows = async () => {
      try {
        const similarData = await MainService.getSimilarTvShows(id); // Fetch similar TV shows
        const transformedSimilarShows = similarData.map(item => new TvShow(item));
        setSimilarTvShows(transformedSimilarShows);
      } catch (error) {
        setErrorMessage('Failed to fetch similar TV shows.');
      }
    };

    if (id) {
      fetchTvShowDetails();
      fetchRecommendations();
      fetchSimilarTvShows();
    }
  }, [id]); // Dependency array ensures this runs when the ID changes

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <Container style={{ marginTop: '20px', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Display an error message if an error occurs
  if (errorMessage) {
    return (
      <Container style={{ marginTop: '20px' }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Grid container spacing={4}>
        {/* Left Column: TV Show Poster and Watch Providers */}
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={tvShow?.posterUrl || 'placeholder.jpg'} // Display TV show poster or placeholder image
              alt={tvShow?.name || 'TV Show Poster'}
              style={{ 
                width: '100%', 
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' // Drop shadow added here
              }}
            />
          </Box>
          {/* Display watch providers */}
          <ProviderList mediaId={id} mediaType="tv" />
        </Grid>

        {/* Right Column: TV Show Details */}
        <Grid item xs={12} md={8}>
          {/* TV Show Title and Release Year */}
          <Typography variant="h4" gutterBottom style={{ color: WHITE }}>
            {tvShow?.name || 'N/A'}{' '}
            <Typography variant="subtitle1" component="span" style={{ color: WHITE }}>
              (
              {tvShow?.firstAirDate ? tvShow.firstAirDate.split('-')[0] : 'Unknown'}
              )
            </Typography>
          </Typography>
          {/* Display Original Name */}
          <Typography variant="subtitle1" style={{ color: WHITE }} gutterBottom>
            Original Name: <span style={{ color: OFF_WHITE }}>{tvShow?.originalName || 'N/A'}</span>
          </Typography>
          {/* Display Overview */}
          <Typography variant="body1" paragraph style={{ color: OFF_WHITE }}>
            {tvShow?.overview || 'No overview available.'}
          </Typography>

          {/* TV Show Metadata */}
          <Box my={2}>
            <Typography variant="h6" style={{ color: WHITE }}>TV Show Information</Typography>
            <Grid container spacing={2}>
              {/* First Air Date */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  First Air Date:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.firstAirDate || 'Unknown'}</Typography>
              </Grid>
              {/* Popularity */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Popularity:
                </Typography>
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.popularity?.toFixed(1) || 'N/A'}</Typography>
              </Grid>
              {/* Vote Average */}
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: WHITE }}>
                  Vote Average:
                </Typography>
                <Rating
                  name="read-only"
                  value={tvShow?.voteAverage / 2 || 0} // Convert 10-point scale to 5-point scale for display
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
                <Typography variant="body1" style={{ color: OFF_WHITE }}>{tvShow?.voteCount || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Backdrop Image */}
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
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' // Drop shadow added here
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Recommended TV Shows Carousel */}
      {recommendations.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Recommended TV Shows
          </Typography>
          <DisplayCardCarousel items={recommendations} cardType="A" />
        </Box>
      )}

      {/* Similar TV Shows Carousel */}
      {similarTvShows.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: WHITE }}>
            Similar TV Shows
          </Typography>
          <DisplayCardCarousel items={similarTvShows} cardType="A" />
        </Box>
      )}
    </Container>
  );
}

export default TvShowDetailPage;
