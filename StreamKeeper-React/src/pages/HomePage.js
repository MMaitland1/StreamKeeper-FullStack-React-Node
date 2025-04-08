/**
 * HomePage.js
 * 
 * The main landing page featuring:
 * - Featured movie carousel with auto-rotation
 * - Search functionality with current movie context
 * - Tabbed browsing for movies and TV shows
 * - Responsive design for all screen sizes
 * - Lazy-loaded content sections
 * 
 * Key Features:
 * - Dynamic data fetching based on tab selection
 * - Double-click navigation to full category pages
 * - Hover-based prefetching
 * - Responsive typography and layouts
 * - Loading state management
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
  // State Management
  const [popularMovies, setPopularMovies] = useState([]); // Popular movies data
  const [topRatedMovies, setTopRatedMovies] = useState([]); // Top rated movies
  const [upcomingMovies, setUpcomingMovies] = useState([]); // Upcoming movies
  const [popularTVShows, setPopularTVShows] = useState([]); // Popular TV shows
  const [topRatedTVShows, setTopRatedTVShows] = useState([]); // Top rated TV shows
  const [onAirTVShows, setOnAirTVShows] = useState([]); // Currently airing TV shows
  const [loading, setLoading] = useState(true); // Loading state
  const [currentMovie, setCurrentMovie] = useState(null); // Currently featured movie
  const [movieTab, setMovieTab] = useState(0); // Active movies tab index
  const [tvTab, setTvTab] = useState(0); // Active TV shows tab index

  const navigate = useNavigate();

  /**
   * Initial Data Fetching
   * Loads popular movies and TV shows when component mounts
   * Sets the first movie as current featured item
   */
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch and process popular movies
        const moviesData = await MainService.getPopularMovies();
        const movieInstances = (moviesData || []).map((movieData) => new Movie(movieData));
        setPopularMovies(movieInstances);
        setCurrentMovie(movieInstances[0] || null);

        // Fetch and process popular TV shows
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
   * Fetches movie data based on tab selection
   * Implements lazy loading - only fetches when tab is selected
   * @param {number} tabIndex - The selected tab index
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
   * Fetches TV show data based on tab selection
   * Implements lazy loading - only fetches when tab is selected
   * @param {number} tabIndex - The selected tab index
   */
  const fetchTvData = async (tabIndex) => {
    try {
      if (tabIndex === 1 && topRatedTVShows.length === 0) {
        const data = await MainService.getTopRatedTvShows();
        const tVShowInstances = (data || []).map((tvShowData) => new TVShow(tvShowData));
        setTopRatedTVShows(tVShowInstances);
      } else if (tabIndex === 2 && onAirTVShows.length === 0) {
        const data = await MainService.getOnTheAirTvShows();
        const tVShowInstances = (data || []).map((tvShowData) => new TVShow(tvShowData));
        setOnAirTVShows(tVShowInstances);
      }
    } catch (error) {
      console.error('Error fetching TV shows data:', error);
    }
  };

  // Tab change handlers
  const handleMovieTabChange = (event, newValue) => {
    setMovieTab(newValue);
  };

  const handleTvTabChange = (event, newValue) => {
    setTvTab(newValue);
  };

  // Search handler (currently logs to console)
  const handleSearch = (query) => {
    console.log('Search triggered with query:', query);
  };

  /**
   * Navigation handler for category pages
   * @param {string} topic - The category title
   * @param {Array} mediaArray - The media items to display
   * @param {string} fetchFunction - The API function name for pagination
   */
  const handleNavigate = (topic, mediaArray, fetchFunction) => {
    navigate(`/info/${topic}`, { state: { mediaArray, fetchFunction } });
  };

  // Determine current carousel items based on active tab
  const movieCarouselItems =
    movieTab === 0 ? popularMovies : movieTab === 1 ? topRatedMovies : upcomingMovies;
  const tVShowCarouselItems =
    tvTab === 0 ? popularTVShows : tvTab === 1 ? topRatedTVShows : onAirTVShows;

  /**
   * Double-click handler for movie tabs
   * Navigates to full category page
   * @param {number} tabIndex - The clicked tab index
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

  /**
   * Double-click handler for TV tabs
   * Navigates to full category page
   * @param {number} tabIndex - The clicked tab index
   */
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
      {/* Page Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography 
          variant="h3" 
          align="left" 
          gutterBottom
          sx={{
            '@media (max-width: 400px)': {
              fontSize: 'h5.fontSize' // Responsive font scaling
            }
          }}
        >
          Welcome to Stream Keeper
        </Typography>
      </Box>

      {loading ? (
        // Loading State
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        // Main Content
        <Box mt={4}>
          {/* Featured Movie Carousel with Search Overlay */}
          <Box sx={{ position: 'relative', width: '100%', height: '70vh', mb: 6 }}>
            <MediaDisplayCarousel
              mediaItems={popularMovies || []}
              autoPlay={true}
              interval={5000} // 5 second rotation
              onItemChange={(item) => setCurrentMovie(item)}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '70%', md: '50%' }, // Responsive width
                zIndex: 2,
                borderRadius: 2,
                padding: 2,
              }}
            >
              <SearchBar currentMovie={currentMovie} onSearch={handleSearch} />
            </Box>
          </Box>

          {/* Movies Section */}
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              '@media (max-width: 720px)': {
                textAlign: 'center' // Mobile center alignment
              }
            }}
          >
            Movies
          </Typography>
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
            sx={{ 
              cursor: 'pointer', 
              color: 'inherit',
              '@media (max-width: 720px)': {
                textAlign: 'center'
              }
            }}
          >
            {movieTab === 0
              ? 'Popular Movies'
              : movieTab === 1
              ? 'Top Rated Movies'
              : 'Upcoming Movies'}
          </Typography>
          <Box 
            display="flex" 
            justifyContent="flex-start" 
            alignItems="center" 
            mb={2}
            sx={{
              '@media (max-width: 720px)': {
                justifyContent: 'center'
              }
            }}
          >
            <Tabs
              value={movieTab}
              onChange={handleMovieTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                zIndex: 10,
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
                onMouseEnter={() => fetchMoviesData(0)} // Prefetch on hover
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
          <Box sx={{ 
            '@media (max-width: 720px)': {
              transform: 'translateY(-45px)' // Mobile layout adjustment
            }
          }}>
            <DisplayCardCarousel
              items={movieCarouselItems || []}
              initialCarouselWidth={1200}
              carouselHeight={300}
              cardType="A"
            />
          </Box>

          {/* TV Shows Section */}
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{
              '@media (max-width: 720px)': {
                textAlign: 'center'
              }
            }}
          >
            TV Shows
          </Typography>
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
            sx={{ 
              cursor: 'pointer', 
              color: 'inherit',
              '@media (max-width: 720px)': {
                textAlign: 'center'
              }
            }}
          >
            {tvTab === 0
              ? 'Popular TV Shows'
              : tvTab === 1
              ? 'Top Rated TV Shows'
              : 'On The Air TV Shows'}
          </Typography>
          <Box 
            display="flex" 
            justifyContent="flex-start" 
            alignItems="center" 
            mb={2}
            sx={{
              '@media (max-width: 720px)': {
                justifyContent: 'center'
              }
            }}
          >
            <Tabs
              value={tvTab}
              onChange={handleTvTabChange}
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                zIndex: 10,
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
          <Box sx={{ 
            '@media (max-width: 720px)': {
              transform: 'translateY(-45px)'
            }
          }}>
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