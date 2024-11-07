// src/pages/PersonDetailPage.js

import MainService from '../services/MainService'; // Import service for API requests
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import hook to access route parameters
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  CardMedia,
  Paper,
} from '@mui/material';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel'; // Component for displaying media in a carousel
import Movie from '../models/Movie'; // Movie model
import TVShow from '../models/TvShow'; // TVShow model

const PersonDetailPage = () => {
  const { id } = useParams(); // Get person ID from route parameters
  const [person, setPerson] = useState(null); // State to store person details
  const [personImage, setPersonImage] = useState(null); // State to store person image
  const [movieCredits, setMovieCredits] = useState([]); // State to store movie credits
  const [tvCredits, setTvCredits] = useState([]); // State to store TV show credits
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  // Fetch person details, images, and credits when component mounts or ID changes
  useEffect(() => {
    const fetchPersonDetails = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch person details, images, and credits using the service
        const personData = await MainService.getPersonById(id);
        const imagesData = await MainService.getPersonImages(id);
        const movieCreditsData = await MainService.getPersonMovieCredits(id);
        const tvCreditsData = await MainService.getPersonTvCredits(id);

        // Update state with fetched data
        setPerson(personData);
        setPersonImage(
          imagesData.profiles?.length
            ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
            : null
        );

        // Process movie credits and create Movie instances
        const processedMovieCredits = movieCreditsData
          ? movieCreditsData.map((item) => {
              const movieInstance = new Movie(item);
              return { ...movieInstance, mediaType: 'Movie' }; // Add mediaType for display purposes
            })
          : [];
        setMovieCredits(processedMovieCredits);

        // Process TV show credits and create TVShow instances
        const processedTvCredits = tvCreditsData
          ? tvCreditsData.map((item) => {
              const tvShowInstance = new TVShow(item);
              return { ...tvShowInstance, mediaType: 'TvShow' }; // Add mediaType for display purposes
            })
          : [];
        setTvCredits(processedTvCredits);
      } catch (error) {
        setErrorMessage('An error occurred while fetching the person details.'); // Handle errors
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPersonDetails(); // Call the function
  }, [id]); // Dependency array ensures this runs when the ID changes

  // Display a loading spinner while fetching data
  if (loading) {
    return (
      <Container sx={{ mt: 2, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Display an error message if an error occurs
  if (errorMessage) {
    return (
      <Container sx={{ mt: 2 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Display person details in a Paper component */}
        <Paper elevation={5} sx={{ p: 2, mb: 2, width: '80%', textAlign: 'center' }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: 'column', md: 'row' }} // Responsive layout
          >
            {/* Display person image */}
            {personImage && (
              <CardMedia
                component="img"
                height="300"
                image={personImage}
                alt={person?.name || 'Person Image'}
                sx={{ borderRadius: '10px', width: 200, mr: 2 }}
              />
            )}
            {/* Display person details */}
            <Box flex={1} ml={{ xs: 0, md: 3 }}>
              <Typography variant="h4" gutterBottom>
                {person?.name || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Department: {person?.knownForDepartment || 'N/A'}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Popularity: {person?.popularity || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Display movie credits if available */}
        {movieCredits.length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 2, mb: 1 }}>
              Movies
            </Typography>
            <DisplayCardCarousel items={movieCredits} cardType="A" />
          </>
        )}

        {/* Display TV credits if available */}
        {tvCredits.length > 0 && (
          <>
            <Typography variant="h3" sx={{ mt: 4, mb: 1 }}>
              TV Shows
            </Typography>
            <DisplayCardCarousel items={tvCredits} cardType="B" carouselHeight={500} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default PersonDetailPage;
