/**
 * SearchResultsPage.js
 * 
 * Displays search results across multiple media types (movies, TV shows, people)
 * 
 * Features:
 * - Fetches and displays unified search results
 * - Processes different media types appropriately
 * - Shows loading state during data fetch
 * - Handles empty results and errors
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import { Box, CircularProgress, Typography } from '@mui/material';
import MainService from '../services/MainService'; // Service for API requests
import Movie from '../models/Movie'; // Movie model class
import TVShow from '../models/TvShow'; // TVShow model class
import Person from '../models/Person'; // Person model class
import Media from '../models/Media'; // Generic Media model class
import DisplayCardA from '../components/DisplayCardA/DisplayCardA'; // Component for media cards
import SearchBar from '../components/SearchBar/SearchBar'; // Search input component

function SearchResultsPage() {
  // Get search query from URL parameters
  const { query } = useParams();

  // State to store processed search results
  const [mediaArray, setMediaArray] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);

  /**
   * useEffect hook for fetching and processing search results
   * Runs when component mounts or when search query changes
   */
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true); // Activate loading state
      try {
        // Fetch raw search results from API
        const data = await MainService.multiSearch(query);
        const resultsArray = data?.searchResults;

        // Validate API response format
        if (!Array.isArray(resultsArray)) {
          console.error('Expected an array but got:', data);
          setMediaArray([]);
          return;
        }

        // Process each result based on media type
        const processedMediaArray = await Promise.all(
          resultsArray.map(async (result) => {
            let mediaInstance;
            const mediaType = result.mediaType?.toLowerCase(); // Normalize media type

            // Create appropriate model instance
            switch (mediaType) {
              case 'movie':
                mediaInstance = new Movie(result);
                break;
              case 'tvshow':
                mediaInstance = new TVShow(result);
                break;
              case 'person':
                mediaInstance = new Person(result);
                try {
                  // Fetch additional images for person results
                  const imagesData = await MainService.getPersonImages(result.id);
                  mediaInstance.imageUrl = imagesData.profiles?.length
                    ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
                    : 'placeholder.jpg';
                } catch (error) {
                  console.error(`Error fetching images for person ID ${result.id}:`, error);
                  mediaInstance.imageUrl = 'placeholder.jpg';
                }
                break;
              default:
                console.warn('Unhandled mediaType:', result.mediaType);
                mediaInstance = new Media(result);
            }
            return mediaInstance;
          })
        );

        setMediaArray(processedMediaArray);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setMediaArray([]);
      } finally {
        setLoading(false); // Deactivate loading state
      }
    };

    if (query) fetchSearchResults();
  }, [query]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 3 }}>
      {/* Search bar with current query as default value */}
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <SearchBar defaultValue={query} />
      </Box>

      {/* Search results heading */}
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Search Results for "{query}"
      </Typography>

      {/* Conditional rendering based on loading state */}
      {loading ? (
        <CircularProgress /> // Loading spinner
      ) : (
        <>
          {/* Results grid or empty state message */}
          {mediaArray.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {mediaArray.map((media) => (
                <Box key={media.id}>
                  <DisplayCardA
                    media={media}
                    minWidth={300}
                    maxWidth={300}
                    minHeight={500}
                    maxHeight={500}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No results found for "{query}".
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default SearchResultsPage;