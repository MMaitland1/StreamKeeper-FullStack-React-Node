require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const Person = require('../models/Person');
const TVShow = require('../models/TVShow');
const fetchFromTmdb = require('../helpers/tmdbHelper');
const tmdbApiKey = process.env.TMDB_API_KEY;
const tmdbBaseUrl = process.env.TMDB_BASE_URL.endsWith('/') ? process.env.TMDB_BASE_URL.slice(0, -1) : process.env.TMDB_BASE_URL;


/**
 * @swagger
 * tags:
 *   name: TMDB
 *   description: Routes to search TMDb for collections, companies, multi-search, and keywords
 */


// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the TMDB API is running
 *     tags: [TMDB]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'TMDb API is running' });
});



// Route to validate TMDb API key
/**
 * @swagger
 * /auth/validate:
 *   get:
 *     summary: Validate TMDb API Key
 *     description: Check if the TMDb API key is valid by trying to retrieve a new token.
 *     tags: [TMDB]
 *     responses:
 *       200:
 *         description: API Key is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid API Key
 */
router.get('/auth/validate', async (req, res) => {
  try {
    await fetchFromTmdb('/authentication/token/new');
    res.status(200).json({ message: 'API Key is valid' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid API Key' });
  }
});
// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the TMDb API is running
 *     tags:
 *       - TMDB
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'TMDb API is running' });
});


// Search for collections
/**
 * @swagger
 * /search/collection:
 *   get:
 *     summary: Search collections
 *     description: Search for movie collections by name
 *     tags: [TMDB]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: List of collections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       poster_path:
 *                         type: string
 *                       backdrop_path:
 *                         type: string
 *       500:
 *         description: Error fetching collections
 */
router.get('/search/collection', async (req, res) => {
  const query = req.query.query;
  try {
    const data = await fetchFromTmdb('/search/collection', { query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Search for companies
/**
 * @swagger
 * /search/company:
 *   get:
 *     summary: Search companies
 *     description: Search for companies by name
 *     tags: [TMDB]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       logo_path:
 *                         type: string
 *       500:
 *         description: Error fetching companies
 */
router.get('/search/company', async (req, res) => {
  const query = req.query.query;
  try {
    const data = await fetchFromTmdb('/search/company', { query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Multi-search (search across movies, TV shows, and people)
/**
 * @swagger
 * /search/multi:
 *   get:
 *     summary: Multi-search
 *     description: Search across movies, TV shows, and people
 *     tags: [TMDB]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: Multi-search results, returning different object structures based on media type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     oneOf:
 *                       - $ref: '#/components/schemas/Movie'
 *                       - $ref: '#/components/schemas/TVShow'
 *                       - $ref: '#/components/schemas/Person'
 *       500:
 *         description: Error fetching multi-search results
 */
router.get('/search/multi', async (req, res) => {
  const query = req.query.query;
  try {
    const data = await fetchFromTmdb('/search/multi', { query });
    
    // Process results using the respective classes for each media type
    const searchResults = data.results.map(item => {
      switch (item.media_type) {
        case 'movie':
          return new Movie(item); // Creates a Movie instance
        case 'tv':
          return new TVShow(item); // Creates a TVShow instance
        case 'person':
          return new Person(item); // Creates a Person instance
        default:
          return item; // Fallback in case of unexpected media types
      }
    });

    res.json({ searchResults });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch multi-search results' });
  }
});

// Search for keywords
/**
 * @swagger
 * /search/keyword:
 *   get:
 *     summary: Search keywords
 *     description: Search for keywords by name
 *     tags: [TMDB]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: List of keywords
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: Error fetching keywords
 */
router.get('/search/keyword', async (req, res) => {
  const query = req.query.query;
  try {
    const data = await fetchFromTmdb('/search/keyword', { query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch keywords' });
  }
});

module.exports = router;
