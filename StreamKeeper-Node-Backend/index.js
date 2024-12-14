require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Import controllers
const tmdbController = require('./controller/tmdbController');
const movieController = require('./controller/movieController');
const tvShowController = require('./controller/tvShowController');
const personController = require('./controller/personController');

// Import Swagger setup for the movie server
const swaggerSetup = require('./swagger');

// Function to validate TMDb API key
const validateApiKey = async () => {
  const validationUrl = `${process.env.TMDB_BASE_URL}/configuration`;
  const requestParams = { api_key: process.env.TMDB_API_KEY };

  try {
    console.log('\n=== TMDb API Validation Request ===');
    console.log('URL:', validationUrl);
    console.log('Parameters:', JSON.stringify(requestParams, null, 2));

    const response = await axios.get(validationUrl, { params: requestParams });
    
    console.log('\x1b[32m%s\x1b[0m', 'TMDb API Key Validation: SUCCESS - API key is valid');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', 'TMDb API Key Validation: FAILED - API key is invalid or TMDB service is unavailable');
    console.error('\n=== Error Details ===');
    console.error('Request URL:', validationUrl);
    console.error('Request Parameters:', JSON.stringify(requestParams, null, 2));
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      console.error('Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    console.error('\nFull error stack:', error.stack);
    return false;
  }
};

// Function to create and start a new Express server on a specified port with a given controller
const startServer = (port, controller, routePath) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // Serve static files and validation only on the TMDb server
  if (port === 3001) {
    app.use(express.static(path.join(__dirname, 'view')));
    
    // Endpoint to validate the TMDb API key
    app.get('/validate', async (req, res) => {
      try {
        const validationUrl = `${process.env.TMDB_BASE_URL}/configuration`;
        const requestParams = { api_key: process.env.TMDB_API_KEY };
        
        console.log('\n=== Validation Endpoint Request ===');
        console.log('URL:', validationUrl);
        console.log('Parameters:', JSON.stringify(requestParams, null, 2));

        const response = await axios.get(validationUrl, { params: requestParams });
        console.log('Response Status:', response.status);
        console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
        
        res.status(200).send('API key is valid.');
      } catch (error) {
        console.error('\n=== Validation Endpoint Error ===');
        if (error.response) {
          console.error('Response Status:', error.response.status);
          console.error('Response Headers:', JSON.stringify(error.response.headers, null, 2));
          console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
          console.error('No response received from server');
          console.error('Request details:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        res.status(500).send('API key is invalid or TMDB service is unavailable.');
      }
    });
  }

  // Use the specified controller on its route path
  app.use(routePath, controller);

  swaggerSetup(app);

  // Start the server
  app.listen(port, () => {
    console.log(`Server for ${routePath} running at http://localhost:${port}`);
  });
};

// Main async function to run validation and start servers
const initialize = async () => {
  console.log('Starting TMDb API validation...');
  
  const isValid = await validateApiKey();
  
  if (isValid) {
    // Start each server with the respective controller and designated port
    startServer(3001, tmdbController, '/api');           // TMDb generic routes
    startServer(3002, movieController, '/api/movies');    // Movie-specific routes
    startServer(3003, tvShowController, '/api/tv');       // TV-specific routes
    startServer(3004, personController, '/api/person');   // Person-specific routes
  } else {
    console.error('\x1b[31m%s\x1b[0m', 'Server startup aborted due to invalid TMDb API key');
    process.exit(1);
  }
};

// Run the initialization
initialize();