/**
 * HomePage.js
 * Main landing page component for Steam Keeper application
 * Displays featured content, movies, and TV shows in various categories
 * Includes search functionality and responsive carousel displays
 */

import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box, Typography, Tabs, Tab } from '@mui/material';
import MainService from '../services/MainService';
import MediaDisplayCarousel from '../components/MediaDisplayCarousel/MediaDisplayCarousel';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';
import SearchBar from '../components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  /**
   * State Management
   * Separate states for different categories of movies and TV shows
   * Loading state for initial data fetch
   * Current movie state for featured content
   * Tab states for both movie and TV sections
   */
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState([]);
  const [onAirTVShows, setOnAirTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [movieTab, setMovieTab] = useState(0);
  const [tvTab, setTvTab] = useState(0);

  const navigate = useNavigate();

  /**
   * Initial Data Fetching
   * Loads popular movies and TV shows on component mount
   * Sets up featured content for the hero section
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch and instantiate popular movies
        const moviesData = await MainService.getPopularMovies();
        const movieInstances = (moviesData || []).map((movieData) => new Movie(movieData));
        setPopularMovies(movieInstances);
        setCurrentMovie(movieInstances[0] || null);

        // Fetch and instantiate popular TV shows
        const tvData = await MainService.getPopularTvShows();
        const tVShowInstances = (tvData || []).map((tvShowData) => new TVShow(tvShowData));
        setPopularTVShows(tVShowInstances);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /**
   * Lazy Loading Movies Data
   * Fetches additional movie categories on demand
   * Prevents unnecessary API calls by checking if data already exists
   * @param {number} tabIndex - Index of the selected movie tab
   */
  const fetchMoviesData = async (tabIndex) => {
    try {
      if (tabIndex === 1 && topRatedMovies.length === 0) {
        const data = await MainService.getTopRatedMovies();
        const movieInstances = (data || []).map((movieData) => new Movie(movieData));
        setTopRatedMovies(movieInstances);
      } else if (tabIndex === 2 && upcomingMovies.length === 0) {
        const data = await MainService.getUpcomingMovies();
        const movieInstances = (data || []).map((movieData) => new Movie(movieData));
        setUpcomingMovies(movieInstances);
      }
    } catch (error) {
      console.error('Error fetching movies data:', error);
    }
  };

  /**
   * Lazy Loading TV Shows Data
   * Fetches additional TV show categories on demand
   * Prevents unnecessary API calls by checking if data already exists
   * @param {number} tabIndex - Index of the selected TV show tab
   */
  const fetchTvData = async (tabIndex) => {
    try {
      if (tabIndex === 1 && topRatedTVShows.length === 0) {
        const data = await MainService.getTopRatedTvShows();
        const tVShowInstances = (data || []).map((tvShowData) => new TVShow(tvShowData));
        setTopRatedTVShows(tVShowInstances);
      } else if (tabIndex === 2 && onAirTVShows.length === 0) {
        const data = await MainService.getOnTheAirTvShows();
        const tVShowInstances = (data || [].map((tvShowData) => new TVShow(tvShowData)));
        setOnAirTVShows(tVShowInstances);
      }
    } catch (error) {
      console.error('Error fetching TV shows data:', error);
    }
  };

  /**
   * Tab Change Handlers
   * Update active tab states and trigger data fetching
   */
  const handleMovieTabChange = (event, newValue) => {
    setMovieTab(newValue);
  };

  const handleTvTabChange = (event, newValue) => {
    setTvTab(newValue);
  };

  /**
   * Search Handler
   * Placeholder for search functionality
   * @param {string} query - Search query string
   */
  const handleSearch = (query) => {
    console.log('Search triggered with query:', query);
  };

  /**
   * Navigation Handler
   * Manages routing to detailed info pages
   * @param {string} topic - Category name
   * @param {Array} mediaArray - Media items to display
   * @param {string} fetchFunction - Function name for loading more data
   */
  const handleNavigate = (topic, mediaArray, fetchFunction) => {
    navigate(`/info/${topic}`, { state: { mediaArray, fetchFunction } });
  };

  /**
   * Dynamic Content Selectors
   * Determine which content to display based on active tabs
   */
  const movieCarouselItems =
    movieTab === 0 ? popularMovies : movieTab === 1 ? topRatedMovies : upcomingMovies;
  const tVShowCarouselItems =
    tvTab === 0 ? popularTVShows : tvTab === 1 ? topRatedTVShows : onAirTVShows;

  /**
   * Double-Click Handlers for Tabs
   * Enable quick navigation to detailed views
   * @param {number} tabIndex - Index of the clicked tab
   */
  const handleMovieTabDoubleClick = (tabIndex) => {
    const topic =
      tabIndex === 0
        ? 'Popular Movies'
        : tabIndex === 1
        ? 'Top Rated Movies'
        : 'Upcoming Movies';
    const fetchFunction =
      tabIndex === 0
        ? 'getPopularMovies'
        : tabIndex === 1
        ? 'getTopRatedMovies'
        : 'getUpcomingMovies';
    handleNavigate(topic, movieCarouselItems, fetchFunction);
  };

  const handleTvTabDoubleClick = (tabIndex) => {
    const topic =
      tabIndex === 0
        ? 'Popular TV Shows'
        : tabIndex === 1
        ? 'Top Rated TV Shows'
        : 'On The Air TV Shows';
    const fetchFunction =
      tabIndex === 0
        ? 'getPopularTvShows'
        : tabIndex === 1
        ? 'getTopRatedTvShows'
        : 'getOnTheAirTvShows';
    handleNavigate(topic, tVShowCarouselItems, fetchFunction);
  };

  return (
    <Container>
      {/* Header Section */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" align="left" gutterBottom>
          Welcome to Steam Keeper
        </Typography>
      </Box>

      {/* Loading State Display */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box mt={4}>
          {/* Hero Section with Feature Carousel and Search */}
          <Box sx={{ position: 'relative', width: '100%', height: '70vh', mb: 6 }}>
            <MediaDisplayCarousel
              mediaItems={popularMovies || []}
              autoPlay={true}
              interval={5000}
              onItemChange={(item) => setCurrentMovie(item)}
            />
            {/* Overlay Search Bar */}
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '70%', md: '50%' },
                zIndex: 2,
                borderRadius: 2,
                padding: 2,
              }}
            >
              <SearchBar currentMovie={currentMovie} onSearch={handleSearch} />
            </Box>
          </Box>

          {/* Movies Section */}
          <Typography variant="h4" gutterBottom>
            Movies
          </Typography>
          {/* Clickable Section Title */}
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            onClick={() =>
              handleNavigate(
                movieTab === 0
                  ? 'Popular Movies'
                  : movieTab === 1
                  ? 'Top Rated Movies'
                  : 'Upcoming Movies',
                movieCarouselItems,
                movieTab === 0
                  ? 'getPopularMovies'
                  : movieTab === 1
                  ? 'getTopRatedMovies'
                  : 'getUpcomingMovies'
              )
            }
            sx={{ cursor: 'pointer', color: 'inherit' }}
          >
            {movieTab === 0
              ? 'Popular Movies'
              : movieTab === 1
              ? 'Top Rated Movies'
              : 'Upcoming Movies'}
          </Typography>
          {/* Movie Category Tabs */}
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
            <Tabs
              value={movieTab}
              onChange={handleMovieTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  color: 'red',
                  fontSize: {
                    xs: '0.75rem',
                    sm: '1rem',
                    md: '1.2rem'
                  },
                  padding: {
                    xs: '6px 8px',
                    sm: '8px 12px',
                    md: '12px 24px'
                  },
                  minWidth: {
                    xs: '60px',
                    sm: '80px',
                    md: '120px'
                  },
                  transition: 'all 0.3s ease',
                  '&:not(.Mui-selected):hover': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': { backgroundColor: 'red' },
              }}
            >
              <Tab
                label="Popular"
                onMouseEnter={() => fetchMoviesData(0)}
                onDoubleClick={() => handleMovieTabDoubleClick(0)}
              />
              <Tab
                label="Top Rated"
                onMouseEnter={() => fetchMoviesData(1)}
                onDoubleClick={() => handleMovieTabDoubleClick(1)}
              />
              <Tab
                label="Upcoming"
                onMouseEnter={() => fetchMoviesData(2)}
                onDoubleClick={() => handleMovieTabDoubleClick(2)}
              />
            </Tabs>
          </Box>
          {/* Movie Carousel Display */}
          <Box mt={4}>
            <DisplayCardCarousel
              items={movieCarouselItems || []}
              initialCarouselWidth={1200}
              carouselHeight={300}
              cardType="A"
            />
          </Box>

          {/* TV Shows Section */}
          <Typography variant="h4" gutterBottom>
            TV Shows
          </Typography>
          {/* Clickable Section Title */}
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            onClick={() =>
              handleNavigate(
                tvTab === 0
                  ? 'Popular TV Shows'
                  : tvTab === 1
                  ? 'Top Rated TV Shows'
                  : 'On The Air TV Shows',
                tVShowCarouselItems,
                tvTab === 0
                  ? 'getPopularTvShows'
                  : tvTab === 1
                  ? 'getTopRatedTvShows'
                  : 'getOnTheAirTvShows'
              )
            }
            sx={{ cursor: 'pointer', color: 'inherit' }}
          >
            {tvTab === 0
              ? 'Popular TV Shows'
              : tvTab === 1
              ? 'Top Rated TV Shows'
              : 'On The Air TV Shows'}
          </Typography>
          {/* TV Show Category Tabs */}
          <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
            <Tabs
              value={tvTab}
              onChange={handleTvTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  color: 'red',
                  fontSize: {
                    xs: '0.75rem',
                    sm: '1rem',
                    md: '1.2rem'
                  },
                  padding: {
                    xs: '6px 8px',
                    sm: '8px 12px',
                    md: '12px 24px'
                  },
                  minWidth: {
                    xs: '60px',
                    sm: '80px',
                    md: '120px'
                  },
                  transition: 'all 0.3s ease',
                  '&:not(.Mui-selected):hover': {
                    color: '#ffffff',
                  },
                },
                '& .MuiTabs-indicator': { backgroundColor: 'red' },
              }}
            >
              <Tab
                label="Popular"
                onMouseEnter={() => fetchTvData(0)}
                onDoubleClick={() => handleTvTabDoubleClick(0)}
              />
              <Tab
                label="Top Rated"
                onMouseEnter={() => fetchTvData(1)}
                onDoubleClick={() => handleTvTabDoubleClick(1)}
              />
              <Tab
                label="On The Air"
                onMouseEnter={() => fetchTvData(2)}
                onDoubleClick={() => handleTvTabDoubleClick(2)}
              />
            </Tabs>
          </Box>
          {/* TV Show Carousel Display */}
          <Box mt={4}>
            <DisplayCardCarousel
              items={tVShowCarouselItems || []}
              initialCarouselWidth={1200}
              carouselHeight={300}
              cardType="A"
            />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;