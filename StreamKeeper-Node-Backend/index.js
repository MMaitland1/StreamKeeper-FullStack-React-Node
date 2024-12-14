require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fetchFromTmdb = require('./helpers/tmdbHelper');

// Import controllers
const tmdbController = require('./controller/tmdbController');
const movieController = require('./controller/movieController');
const tvShowController = require('./controller/tvShowController');
const personController = require('./controller/personController');

const swaggerSetup = require('./swagger');

const validateApiKey = async () => {
  try {
    await fetchFromTmdb('/configuration');
    return true;
  } catch (error) {
    return false;
  }
};

const startServer = (port, controller, routePath) => {
  const app = express();

  app.use(express.json());
  app.use(cors());

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

  app.use(routePath, controller);

  swaggerSetup(app);

  app.listen(port, () => {
    console.log(`Server for ${routePath} running at http://localhost:${port}`);
  });
};

const initialize = async () => {
  const isValid = await validateApiKey();
  
  if (isValid) {
    startServer(3001, tmdbController, '/api');
    startServer(3002, movieController, '/api/movies');
    startServer(3003, tvShowController, '/api/tv');
    startServer(3004, personController, '/api/person');
  } else {
    process.exit(1);
  }
};

initialize();