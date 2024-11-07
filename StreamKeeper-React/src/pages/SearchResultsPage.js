import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook to access URL parameters
import { Box, CircularProgress, Typography } from '@mui/material';
import MainService from '../services/MainService'; // Service for API requests
import Movie from '../models/Movie'; // Movie model
import TVShow from '../models/TvShow'; // TVShow model
import Person from '../models/Person'; // Person model
import Media from '../models/Media'; // Generic Media model
import DisplayCardA from '../components/DisplayCardA/DisplayCardA'; // Component for displaying media items
import SearchBar from '../components/SearchBar/SearchBar'; // Search bar component

function SearchResultsPage() {
  const { query } = useParams(); // Retrieve the search query from the URL
  const [mediaArray, setMediaArray] = useState([]); // State to store search results
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch search results when the component mounts or when the query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true); // Start loading
      try {
        // Fetch search results using the service
        const data = await MainService.multiSearch(query);

        const resultsArray = data?.searchResults;
        // Ensure the results are an array before proceeding
        if (!Array.isArray(resultsArray)) {
          console.error('Expected an array but got:', data);
          setMediaArray([]); // Clear results if invalid data is received
          return;
        }

        // Process each search result based on its media type
        const processedMediaArray = await Promise.all(
          resultsArray.map(async (result) => {
            let mediaInstance;
            const mediaType = result.mediaType?.toLowerCase(); // Normalize media type to lowercase

            switch (mediaType) {
              case 'movie':
                mediaInstance = new Movie(result); // Create a Movie instance
                break;
              case 'tvshow':
                mediaInstance = new TVShow(result); // Create a TVShow instance
                break;
              case 'person':
                mediaInstance = new Person(result); // Create a Person instance
                try {
                  // Fetch additional image data for persons
                  const imagesData = await MainService.getPersonImages(result.id);
                  if (imagesData.profiles && imagesData.profiles.length > 0) {
                    mediaInstance.imageUrl = `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`;
                  } else {
                    mediaInstance.imageUrl = 'placeholder.jpg'; // Fallback image
                  }
                } catch (error) {
                  console.error(`Error fetching images for person ID ${result.id}:`, error);
                  mediaInstance.imageUrl = 'placeholder.jpg'; // Fallback image on error
                }
                break;
              default:
                // Handle unhandled media types
                console.warn('Unhandled mediaType:', result.mediaType);
                mediaInstance = new Media(result); // Fallback to a generic Media instance
            }
            return mediaInstance;
          })
        );

        setMediaArray(processedMediaArray); // Update state with processed results
      } catch (error) {
        console.error('Error fetching search results:', error); // Log any errors
        setMediaArray([]); // Clear results on error
      } finally {
        setLoading(false); // End loading
      }
    };

    if (query) fetchSearchResults(); // Call the function if a query exists
  }, [query]); // Dependency array ensures this runs when the query changes

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 3 }}>
      {/* Render the search bar with the current query as default value */}
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <SearchBar defaultValue={query} />
      </Box>
      {/* Display the search query as a heading */}
      <Typography variant="h4" align="center" sx={{ mt: 2 }}>
        Search Results for "{query}"
      </Typography>
      {loading ? (
        // Show a loading spinner while results are being fetched
        <CircularProgress />
      ) : (
        <>
          {/* Display results if available */}
          {mediaArray.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {mediaArray.map((media) => (
                <Box key={media.id}>
                  <DisplayCardA
                    media={media} // Pass media data to DisplayCardA component
                    minWidth={300} // Set minimum width for the card
                    maxWidth={300} // Set maximum width for the card
                    minHeight={500} // Set minimum height for the card
                    maxHeight={500} // Set maximum height for the card
                  />
                </Box>
              ))}
            </Box>
          ) : (
            // Display a message if no results are found
            <Typography variant="body1" color="textSecondary">
              No results found for "{query}".
            </Typography>
          )}

          {/* Display raw JSON data for debugging purposes */}
          <Box sx={{ width: '100%', mt: 4, p: 2, backgroundColor: '#f4f4f4', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Raw JSON Data:
            </Typography>
            <Typography
              variant="body2"
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflowX: 'auto' }}
            >
              {JSON.stringify(mediaArray, null, 2)} {/* Pretty-print JSON data */}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

export default SearchResultsPage;
