require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');  // Require the 'https' module
const fs = require('fs');        // For reading SSL certificates
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

// Set up HTTP server with SSL (HTTPS)
const startServer = (port, controller, routePath) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // Serve the frontend static files for port 3001
  if (port === 3001) {
    app.use(express.static(path.join(__dirname, 'view')));
    
    app.get('/validate', async (req, res) => {
      try {
        await fetchFromTmdb('/configuration');
        res.status(200).send('API key is valid.');
      } catch (error) {
        res.status(500).send('API key is invalid or TMDB service is unavailable.');
      }
    });
  }

  // Set up routes for all APIs
  app.use(routePath, controller);

  swaggerSetup(app);

  // Listen on HTTPS (use your SSL certificate files)
  const sslOptions = {
    key: fs.readFileSync('./ssl/private/key.key'),
    cert: fs.readFileSync('./ssl/certs/cert.crt'),
  };

  https.createServer(sslOptions, app).listen(port, () => {
    console.log(`Server for ${routePath} running at https://localhost:${port}`);
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
  } else {
    process.exit(1);
  }
};

initialize();
