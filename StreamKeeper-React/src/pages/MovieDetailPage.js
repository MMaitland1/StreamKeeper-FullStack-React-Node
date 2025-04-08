/**
 * MovieDetailPage.js
 * 
 * A comprehensive movie details page featuring:
 * - Complete movie information display
 * - Streaming provider listings
 * - Recommendations and similar movies
 * - Responsive layout
 * - Error handling and loading states
 * 
 * Key Features:
 * - Dynamic data fetching based on movie ID
 * - Multi-section layout with clear information hierarchy
 * - Interactive rating display
 * - Genre tagging system
 * - Related content carousels
 * 
 * Component Structure:
 * 1. Loading state
 * 2. Error state
 * 3. Main content:
 *   3.1 Poster and providers (left column)
 *   3.2 Movie details (right column)
 *   3.3 Recommendations carousel
 *   3.4 Similar movies carousel
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainService from "../services/MainService";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Chip,
  Rating,
} from "@mui/material";
import Movie from "../models/Movie";
import ProviderList from "../components/ProviderList/ProviderList";
import DisplayCardCarousel from "../components/DisplayCardCarousel/DisplayCardCarousel";

// Color constants for consistent styling
const COLORS = {
  title: "white",
  text: "#D3D3D3",
  shadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
};

function MovieDetailPage() {
  // Router hook to get movie ID from URL
  const { id } = useParams();

  // Component state
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  /**
   * Data fetching effect
   * Runs when component mounts or when movie ID changes
   * Fetches:
   * - Movie details
   * - Recommendations
   * - Similar movies
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch primary movie data
        const movieData = await MainService.getMovieById(id);
        setMovie(new Movie(movieData));

        // Fetch related content in parallel
        const [recsData, similarData] = await Promise.all([
          MainService.getMovieRecommendations(id),
          MainService.getSimilarMovies(id)
        ]);

        // Process recommendations
        setRecommendations((recsData || []).map(m => new Movie(m)));
        
        // Process similar movies
        setSimilarMovies((similarData || []).map(m => new Movie(m)));

      } catch (error) {
        console.error("Data fetching error:", error);
        setErrorMessage("Failed to load movie details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Container sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh" 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  // Error state
  if (errorMessage) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ fontSize: "1.1rem" }}>
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
      {/* Main content grid - poster + details */}
      <Grid container spacing={4}>
        {/* Left column - Poster and providers */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            position: "relative",
            "&:hover": {
              transform: "translateY(-4px)",
              transition: "transform 0.3s ease"
            }
          }}>
            <img
              src={movie?.posterUrl || "/placeholder.jpg"}
              alt={movie?.title || "Movie poster"}
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: COLORS.shadow,
                aspectRatio: "2/3", // Maintain poster aspect ratio
                objectFit: "cover"
              }}
              onError={(e) => {
                e.target.src = "/placeholder.jpg"; // Fallback for broken images
              }}
            />
          </Box>

          {/* Watch providers section */}
          <Box mt={4}>
            <ProviderList 
              mediaId={id} 
              mediaType="movie" 
              sx={{ 
                mt: 2,
                "& .MuiChip-root": {
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)"
                  }
                }
              }}
            />
          </Box>
        </Grid>

        {/* Right column - Movie details */}
        <Grid item xs={12} md={8}>
          {/* Title section */}
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              color: COLORS.title,
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            {movie?.title || "N/A"}
            <Typography
              component="span"
              sx={{ 
                color: COLORS.title,
                ml: 1.5,
                fontSize: "1.5rem",
                opacity: 0.8
              }}
            >
              ({movie?.releaseDate?.split("-")[0] || "Unknown"})
            </Typography>
          </Typography>

          {/* Original title */}
          {movie?.originalTitle && movie.originalTitle !== movie.title && (
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ 
                color: COLORS.title,
                fontStyle: "italic",
                opacity: 0.8
              }}
            >
              Original Title: {movie.originalTitle}
            </Typography>
          )}

          {/* Overview */}
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ 
              color: COLORS.text,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              mt: 2
            }}
          >
            {movie?.overview || "No overview available."}
          </Typography>

          {/* Metadata grid */}
          <Box my={4}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: COLORS.title,
                mb: 2,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                pb: 1
              }}
            >
              Movie Details
            </Typography>
            
            <Grid container spacing={3}>
              {/* Release date */}
              <Grid item xs={12} sm={6}>
                <DetailItem 
                  label="Release Date" 
                  value={movie?.releaseDate || "Unknown"} 
                />
              </Grid>
              
              {/* Popularity */}
              <Grid item xs={12} sm={6}>
                <DetailItem 
                  label="Popularity" 
                  value={movie?.popularity?.toFixed(1) || "N/A"} 
                />
              </Grid>
              
              {/* Rating */}
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: COLORS.title }}>
                    Rating
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                    <Rating
                      value={(movie?.voteAverage || 0) / 2}
                      precision={0.1}
                      readOnly
                      sx={{
                        "& .MuiRating-icon": {
                          filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))",
                          color: "#ffd700" // Gold color for stars
                        },
                      }}
                    />
                    <Typography sx={{ color: COLORS.text }}>
                      {movie?.voteAverage?.toFixed(1) || "N/A"} / 10
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {/* Vote count */}
              <Grid item xs={12} sm={6}>
                <DetailItem 
                  label="Vote Count" 
                  value={movie?.voteCount?.toLocaleString() || "N/A"} 
                />
              </Grid>
            </Grid>
          </Box>

          {/* Genres */}
          {movie?.genreIds?.length > 0 && (
            <Box my={4}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: COLORS.title,
                  mb: 2,
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  pb: 1
                }}
              >
                Genres
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {movie.genreIds.map(genreId => (
                  <Chip
                    key={genreId}
                    label={`Genre ${genreId}`}
                    variant="outlined"
                    sx={{ 
                      color: COLORS.title,
                      borderColor: "rgba(255,255,255,0.3)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)"
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Backdrop image */}
          {movie?.backdropUrl && (
            <Box my={4}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: COLORS.title,
                  mb: 2,
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  pb: 1
                }}
              >
                Backdrop
              </Typography>
              <img
                src={movie.backdropUrl}
                alt={`${movie.title} backdrop`}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  boxShadow: COLORS.shadow,
                  maxHeight: "400px",
                  objectFit: "cover"
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <Box my={6}>
          <SectionHeader title="Recommended Movies" />
          <DisplayCardCarousel 
            items={recommendations} 
            cardType="A"
            sx={{ py: 2 }}
          />
        </Box>
      )}

      {/* Similar movies section */}
      {similarMovies.length > 0 && (
        <Box my={6}>
          <SectionHeader title="Similar Movies" />
          <DisplayCardCarousel 
            items={similarMovies} 
            cardType="A"
            sx={{ py: 2 }}
          />
        </Box>
      )}
    </Container>
  );
}

/**
 * Reusable detail item component
 */
const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="body2" sx={{ color: COLORS.title }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color: COLORS.text, mt: 0.5 }}>
      {value}
    </Typography>
  </Box>
);

/**
 * Reusable section header component
 */
const SectionHeader = ({ title }) => (
  <Typography 
    variant="h4" 
    gutterBottom 
    sx={{ 
      color: COLORS.title,
      fontWeight: 500,
      fontSize: { xs: "1.8rem", md: "2rem" },
      mb: 3,
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: -8,
        left: 0,
        width: "80px",
        height: "4px",
        backgroundColor: "primary.main",
        borderRadius: "2px"
      }
    }}
  >
    {title}
  </Typography>
);

export default MovieDetailPage;