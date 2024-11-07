import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainService from "../services/MainService"; // Import the main service for data fetching
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
import Movie from "../models/Movie"; // Import the Movie model
import ProviderList from "../components/ProviderList/ProviderList"; // Component to display watch providers
import DisplayCardCarousel from "../components/DisplayCardCarousel/DisplayCardCarousel"; // Carousel component for displaying recommendations and similar movies

function MovieDetailPage() {
  const { id } = useParams(); // Retrieve the movie ID from the URL
  const [movie, setMovie] = useState(null); // State to store movie details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages
  const [recommendations, setRecommendations] = useState([]); // State for recommended movies
  const [similarMovies, setSimilarMovies] = useState([]); // State for similar movies

  const titleColor = "white"; // Color for titles
  const textColor = "#D3D3D3"; // Color for text

  // Fetch movie details and related data when component mounts or when the movie ID changes
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await MainService.getMovieById(id); // Fetch movie details using the movie ID
        const movieInstance = new Movie(data); // Create a new Movie instance
        setMovie(movieInstance);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setErrorMessage("An error occurred while fetching the movie details."); // Set error message on failure
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    // Fetch recommendations and similar movies
    const fetchRecommendationsAndSimilarMovies = async () => {
      try {
        const recommendationsData = await MainService.getMovieRecommendations(
          id
        ); // Fetch movie recommendations
        const formattedRecommendations = (recommendationsData || []).map(
          (movieData) => new Movie(movieData)
        );
        setRecommendations(formattedRecommendations);

        const similarMoviesData = await MainService.getSimilarMovies(id); // Fetch similar movies
        const formattedSimilarMovies = (similarMoviesData || []).map(
          (movieData) => new Movie(movieData)
        );
        setSimilarMovies(formattedSimilarMovies);
      } catch (error) {
        console.error(
          "Error fetching recommendations and similar movies:",
          error
        );
      }
    };

    if (id) {
      fetchMovieDetails();
      fetchRecommendationsAndSimilarMovies();
    }
  }, [id]); // Run the effect whenever the movie ID changes

  // Show a loading spinner while data is being fetched
  if (loading) {
    return (
      <Container style={{ marginTop: "20px", textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Display an error message if an error occurred during data fetching
  if (errorMessage) {
    return (
      <Container style={{ marginTop: "20px" }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "20px" }}>
      <Grid container spacing={4}>
        {/* Left column: Movie poster and provider list */}
        <Grid item xs={12} md={4}>
          <Box>
            <img
              src={movie?.posterUrl || "placeholder.jpg"} // Display movie poster or a placeholder image
              alt={movie?.title || "Movie Poster"}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
              }}
            />
          </Box>
          {/* Display watch providers */}
          <ProviderList mediaId={id} mediaType="movie" />
        </Grid>

        {/* Right column: Movie details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom style={{ color: titleColor }}>
            {movie?.title || "N/A"}{" "}
            <Typography
              variant="subtitle1"
              component="span"
              style={{ color: titleColor }}
            >
              (
              {movie?.releaseDate ? movie.releaseDate.split("-")[0] : "Unknown"}
              ) {/* Display release year */}
            </Typography>
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            style={{ color: titleColor }}
          >
            Original Title: {movie?.originalTitle || "N/A"}
          </Typography>
          <Typography variant="body1" paragraph style={{ color: textColor }}>
            {movie?.overview || "No overview available."}{" "}
            {/* Display movie overview */}
          </Typography>

          {/* Display movie information in a grid */}
          <Box my={2}>
            <Typography variant="h6" style={{ color: titleColor }}>
              Movie Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Release Date:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.releaseDate || "Unknown"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Popularity:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.popularity?.toFixed(1) || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Vote Average:
                </Typography>
                {/* Display movie rating */}
                <Rating
                  name="read-only"
                  value={movie?.voteAverage / 2 || 0} // Convert 10-point scale to 5-point scale for display
                  readOnly
                  precision={0.1}
                  sx={{
                    "& .MuiRating-icon": {
                      filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.6))", // Adding a drop shadow effect
                    },
                  }}
                />

                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.voteAverage ? movie.voteAverage.toFixed(1) : "N/A"} /
                  10
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" style={{ color: titleColor }}>
                  Vote Count:
                </Typography>
                <Typography variant="body1" style={{ color: textColor }}>
                  {movie?.voteCount || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Display genres if available */}
          {movie?.genreIds && movie.genreIds.length > 0 && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: titleColor }}>
                Genres
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {movie.genreIds.map((genreId) => (
                  <Chip
                    key={genreId}
                    label={`Genre ${genreId}`}
                    variant="outlined"
                    style={{ color: titleColor }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Display backdrop image if available */}
          {movie?.backdropUrl && (
            <Box my={2}>
              <Typography variant="h6" style={{ color: titleColor }}>
                Backdrop
              </Typography>
              <img
                src={movie.backdropUrl}
                alt={`${movie.title} backdrop`}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Display recommended movies if available */}
      {recommendations.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: titleColor }}>
            Recommended Movies
          </Typography>
          <DisplayCardCarousel items={recommendations} cardType="A" />
        </Box>
      )}

      {/* Display similar movies if available */}
      {similarMovies.length > 0 && (
        <Box my={4}>
          <Typography variant="h5" gutterBottom style={{ color: titleColor }}>
            Similar Movies
          </Typography>
          <DisplayCardCarousel items={similarMovies} cardType="A" />
        </Box>
      )}
    </Container>
  );
}

export default MovieDetailPage;
