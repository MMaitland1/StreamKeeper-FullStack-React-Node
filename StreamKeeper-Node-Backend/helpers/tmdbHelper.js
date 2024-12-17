require('dotenv').config(); // Load environment variables from a .env file
const axios = require('axios'); // Import axios for HTTP requests
const cacheManager = require('../cache/CacheManager'); // Import the custom CacheManager for caching responses

// Retrieve API configuration from environment variables
const tmdbApiKey = process.env.TMDB_API_KEY; // TMDB API key for authentication
const tmdbBaseUrl = process.env.TMDB_BASE_URL.endsWith('/') ? 
    process.env.TMDB_BASE_URL.slice(0, -1) : process.env.TMDB_BASE_URL; // Ensure base URL does not end with a trailing slash

/**
 * Fetch data from the TMDB API with caching support
 * @param {string} endpoint - The API endpoint to fetch (e.g., /movie/popular)
 * @param {object} params - Query parameters to include in the request
 * @returns {Promise<object>} - Returns the data fetched from the TMDB API
 */
const fetchFromTmdb = async (endpoint, params = {}) => {
    /**
     * Function to make an API call to TMDB
     * Constructs the full URL and query parameters before sending the GET request.
     */
    const makeApiCall = async () => {
        // Construct the full API endpoint URL
        const url = `${tmdbBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        // Combine API key with additional query parameters
        const fullParams = { api_key: tmdbApiKey, ...params };

        try {
            // Perform the GET request using axios
            const response = await axios.get(url, { params: fullParams });
            return response.data; // Return only the response data
        } catch (error) {
            // Handle errors by throwing a custom message with the original error message
            throw new Error(`TMDB API Error: ${error.message}`);
        }
    };

    // Use the CacheManager to handle caching logic
    try {
        return await cacheManager.handle(endpoint, params, makeApiCall);
    } catch (error) {
        throw error; // Re-throw the error for external handling
    }
};

module.exports = fetchFromTmdb; // Export the function for use in other modules
