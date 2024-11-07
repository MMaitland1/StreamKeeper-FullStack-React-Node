const express = require('express');
const router = express.Router();
const fetchFromTmdb = require('../helpers/tmdbHelper');
const Movie = require('../models/Movie');
const Person = require('../models/Person');
const Review = require('../models/Review');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management and retrieval
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Movie API is running' });
});

/**
 * @swagger
 * /{movie_id}/images:
 *   get:
 *     summary: Fetch movie images by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:movie_id/images', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/images`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie images' });
  }
});


/**
 * @swagger
 * /{movie_id}/credits:
 *   get:
 *     summary: Fetch movie credits by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie credits, including cast and crew
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cast:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 *                 crew:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'
 */
router.get('/:movie_id/credits', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/credits`);
    const cast = data.cast.map((person) => new Person(person));
    const crew = data.crew.map((person) => new Person(person));
    res.json({ cast, crew });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie credits' });
  }
});


/**
 * @swagger
 * /{movie_id}/external_ids:
 *   get:
 *     summary: Fetch movie external IDs by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: External IDs for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imdb_id:
 *                   type: string
 *                 facebook_id:
 *                   type: string
 *                 instagram_id:
 *                   type: string
 *                 twitter_id:
 *                   type: string
 */
router.get('/:movie_id/external_ids', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/external_ids`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie external IDs' });
  }
});



/**
 * @swagger
 * /{movie_id}/recommendations:
 *   get:
 *     summary: Fetch movie recommendations by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of recommended movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/:movie_id/recommendations', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/recommendations`);
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie recommendations' });
  }
});

/**
 * @swagger
 * /{movie_id}/reviews:
 *   get:
 *     summary: Fetch movie reviews by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of movie reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/:movie_id/reviews', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/reviews`);
    
    // Map each review in the response data to a Review instance
    const reviews = data.results.map(reviewData => new Review(reviewData));

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie reviews' });
  }
});

module.exports = router;

/**
 * @swagger
 * /{movie_id}/similar:
 *   get:
 *     summary: Fetch similar movies by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of similar movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/:movie_id/similar', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/similar`);
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch similar movies' });
  }
});

/**
 * @swagger
 * /{movie_id}/videos:
 *   get:
 *     summary: Fetch movie videos by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of movie videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 */
router.get('/:movie_id/videos', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/videos`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie videos' });
  }
});

/**
 * @swagger
 * /{movie_id}/watch/providers:
 *   get:
 *     summary: Fetch movie watch providers by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Watch providers for the movie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/:movie_id/watch/providers', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/movie/${req.params.movie_id}/watch/providers`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie watch providers' });
  }
});

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Search query for movies
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  try {
    const data = await fetchFromTmdb(`/search/movie`, { query });
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

/**
 * @swagger
 * /popular:
 *   get:
 *     summary: Fetch popular movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of popular movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/popular', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/movie/popular');
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

/**
 * @swagger
 * /now_playing:
 *   get:
 *     summary: Fetch now playing movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of now playing movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/now_playing', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/movie/now_playing');
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch now playing movies' });
  }
});

/**
 * @swagger
 * /top_rated:
 *   get:
 *     summary: Fetch top-rated movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of top-rated movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/top_rated', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/movie/top_rated');
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
});

/**
 * @swagger
 * /upcoming:
 *   get:
 *     summary: Fetch upcoming movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of upcoming movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/upcoming', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/movie/upcoming');
    res.json(data.results.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
});

/**
 * @swagger
 * /{movie_id}:
 *   get:
 *     summary: Fetch movie details by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movie_id
 *         required: true
 *         description: ID of the movie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
router.get('/:movie_id(\\d+)', async (req, res) => {
  const movieId = Number(req.params.movie_id);
  
  try {
    const data = await fetchFromTmdb(`/movie/${movieId}`);
    res.json(new Movie(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

module.exports = router;
