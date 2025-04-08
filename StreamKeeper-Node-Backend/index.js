require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');  // Changed from https to http
const fetchFromTmdb = require('./helpers/tmdbHelper');

// Import controllers
const tmdbController = require('./controller/tmdbController');
const movieController = require('./controller/movieController');
const tvShowController = require('./controller/tvShowController');
const personController = require('./controller/personController');

const swaggerSetup = require('./swagger');

// Validate API key by making a request to TMDb
const validateApiKey = async () => {
  try {
    await fetchFromTmdb('/configuration');
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Set up an HTTP server for handling API requests.
 * No SSL is needed for local development.
 * @param {number} port - The port number for the server.
 * @param {Function} controller - The controller handling API routes.
 * @param {string} routePath - The base route path for the API.
 */
const startServer = (port, controller, routePath) => {
  // Initialize Express application
  const app = express();

  // Enable JSON parsing and CORS support
  app.use(express.json());
  app.use(cors());

  /**
   * Serve static files for the frontend when running on port 3001.
   * This ensures the frontend is accessible in a local development environment.
   */
  if (port === 3001) {
      app.use(express.static(path.join(__dirname, 'view')));

      /**
       * Endpoint to validate the TMDB API key.
       * Fetches the TMDB configuration endpoint to verify connectivity.
       */
      app.get('/validate', async (req, res) => {
          try {
              await fetchFromTmdb('/configuration');
              res.status(200).send('API key is valid.');
          } catch (error) {
              res.status(500).send('API key is invalid or TMDB service is unavailable.');
          }
      });
  }

  // Set up routes for API handling
  app.use(routePath, controller);

  // Configure Swagger for API documentation
  swaggerSetup(app);

  // Create and start an HTTP server instance
  const server = http.createServer(app);
  server.listen(port, () => {
      console.log(`Server for ${routePath} running at http://localhost:${port}`);
  });
};


const initialize = async () => {
  const isValid = await validateApiKey();
  
  if (isValid) {
    // Start the backend services
    startServer(3001, tmdbController, '/api');
    startServer(3002, movieController, '/api/movies');
    startServer(3003, tvShowController, '/api/tv');
    startServer(3004, personController, '/api/person');
    console.log('All services started successfully');
  } else {
    console.error('Failed to validate API key');
    process.exit(1);
  }
};

initialize();