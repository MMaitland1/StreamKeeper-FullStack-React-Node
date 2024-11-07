require('dotenv').config();
console.log('TMDB_BASE_URL:', process.env.TMDB_BASE_URL);
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
        await axios.get(`${process.env.TMDB_BASE_URL}/configuration`, {
          params: { api_key: process.env.TMDB_API_KEY },
        });
        res.status(200).send('API key is valid.');
      } catch (error) {
        console.error('Error validating API key:', error.message);
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

// Start each server with the respective controller and designated port
startServer(3001, tmdbController, '/api');           // TMDb generic routes
startServer(3002, movieController, '/api/movies');    // Movie-specific routes
startServer(3003, tvShowController, '/api/tv');       // TV-specific routes
startServer(3004, personController, '/api/person');   // Person-specific routes
