// helpers/tmdbHelper.js
require('dotenv').config();


const axios = require('axios');

const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL.endsWith('/') ? process.env.TMDB_BASE_URL.slice(0, -1) : process.env.TMDB_BASE_URL;

// Helper function to make TMDb API calls
const fetchFromTmdb = async (endpoint, params = {}) => {
  const url = `${tmdbBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const fullParams = { api_key: tmdbApiKey, ...params };

  // Log the request details for each call to TMDb
  console.log(`\n[Sending Request to TMDb]`);
  console.log(`- URL: ${url}`);
  console.log(`- Params: ${JSON.stringify(fullParams)}\n`);

  try {
    const response = await axios.get(url, { params: fullParams });
    return response.data;
  } catch (error) {
    console.error(`[TMDb Error] ${error.message}`);
    throw error;
  }
};

module.exports = fetchFromTmdb;
