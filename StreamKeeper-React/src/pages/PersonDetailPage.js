/**
 * PersonDetailPage.js
 * 
 * A comprehensive page displaying detailed information about a person (actor/director/etc.)
 * including their filmography across movies and TV shows.
 * 
 * Key Features:
 * - Complete person biography and details
 * - Image gallery
 * - Movie credits carousel
 * - TV show credits carousel
 * - Responsive layout
 * - Error handling and loading states
 * 
 * Component Structure:
 * 1. Loading state
 * 2. Error state
 * 3. Main content:
 *   3.1 Person header (image + basic info)
 *   3.2 Movie credits section
 *   3.3 TV credits section
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  CardMedia,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import MainService from '../services/MainService';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';

const PersonDetailPage = () => {
  // Router hook to get person ID from URL
  const { id } = useParams();

  // Component state
  const [person, setPerson] = useState(null);
  const [personImages, setPersonImages] = useState([]);
  const [movieCredits, setMovieCredits] = useState([]);
  const [tvCredits, setTvCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Color constants for consistent styling
  const COLORS = {
    primary: '#1976d2',
    textPrimary: 'rgba(0, 0, 0, 0.87)',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
  };

  /**
   * Data fetching effect
   * Runs when component mounts or when person ID changes
   * Fetches:
   * - Person details
   * - Person images
   * - Movie credits
   * - TV credits
   */
  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [details, images, movies, tvShows] = await Promise.all([
          MainService.getPersonById(id),
          MainService.getPersonImages(id),
          MainService.getPersonMovieCredits(id),
          MainService.getPersonTvCredits(id)
        ]);

        // Process person details
        setPerson(details);

        // Process images
        setPersonImages(images.profiles || []);

        // Process movie credits
        const processedMovies = (movies || []).map(item => ({
          ...new Movie(item),
          mediaType: 'Movie'
        }));
        setMovieCredits(processedMovies);

        // Process TV credits
        const processedTvShows = (tvShows || []).map(item => ({
          ...new TVShow(item),
          mediaType: 'TvShow'
        }));
        setTvCredits(processedTvShows);

      } catch (error) {
        console.error('Error fetching person data:', error);
        setErrorMessage('Failed to load person details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPersonData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ fontSize: '1.1rem' }}>
          {errorMessage}
        </Alert>
      </Container>
    );
  }

  // Main content render
  return (
    <Container sx={{ 
      mt: 4,
      mb: 6,
      px: { xs: 2, md: 4 } // Responsive padding
    }}>
      {/* Person header section */}
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 4,
        borderRadius: '12px',
        backgroundColor: 'background.paper'
      }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          {/* Person image */}
          {personImages.length > 0 && (
            <Box sx={{
              minWidth: 250,
              maxWidth: 300,
              alignSelf: 'center',
              '& img': {
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                width: '100%',
                height: 'auto'
              }
            }}>
              <CardMedia
                component="img"
                image={`https://image.tmdb.org/t/p/w500${personImages[0].file_path}`}
                alt={person?.name}
                onError={(e) => {
                  e.target.src = '/person-placeholder.jpg'; // Fallback image
                }}
              />
            </Box>
          )}

          {/* Person details */}
          <Box flex={1}>
            <Typography variant="h3" sx={{ 
              fontWeight: 600,
              mb: 2,
              color: COLORS.textPrimary
            }}>
              {person?.name}
            </Typography>

            {/* Basic info */}
            <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
              {person?.knownForDepartment && (
                <Chip 
                  label={person.knownForDepartment} 
                  color="primary"
                  size="small"
                />
              )}
              {person?.birthday && (
                <Chip 
                  label={`Born: ${person.birthday}`}
                  variant="outlined"
                  size="small"
                />
              )}
              {person?.placeOfBirth && (
                <Chip 
                  label={`From: ${person.placeOfBirth}`}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>

            {/* Biography */}
            {person?.biography && (
              <>
                <Typography variant="h6" sx={{ mb: 1, color: COLORS.textPrimary }}>
                  Biography
                </Typography>
                <Typography variant="body1" sx={{ color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  {person.biography}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* Movie credits section */}
      {movieCredits.length > 0 && (
        <Box mb={6}>
          <Typography variant="h4" sx={{ 
            mb: 3,
            fontWeight: 500,
            color: COLORS.textPrimary,
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: COLORS.primary,
              mt: 1,
              borderRadius: '2px'
            }
          }}>
            Movie Credits
          </Typography>
          <DisplayCardCarousel 
            items={movieCredits} 
            cardType="A"
            sx={{ py: 2 }}
          />
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* TV credits section */}
      {tvCredits.length > 0 && (
        <Box mb={6}>
          <Typography variant="h4" sx={{ 
            mb: 3,
            fontWeight: 500,
            color: COLORS.textPrimary,
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              backgroundColor: COLORS.primary,
              mt: 1,
              borderRadius: '2px'
            }
          }}>
            TV Show Credits
          </Typography>
          <DisplayCardCarousel 
            items={tvCredits} 
            cardType="B"
            carouselHeight={500}
            sx={{ py: 2 }}
          />
        </Box>
      )}
    </Container>
  );
};

export default PersonDetailPage;