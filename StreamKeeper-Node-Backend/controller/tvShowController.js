const express = require('express');
const router = express.Router();
const fetchFromTmdb = require('../helpers/tmdbHelper'); // Import the helper function
const TVShow = require('../models/TVShow');
const Review = require('../models/Review');
const Person = require('../models/Person');

/**
 * @swagger
 * tags:
 *   - name: TvShows
 *     description: TV Show management and retrieval
 */

// Health check route
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: TV Show API is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'TV Show API is running' });
});

// Fetch popular TV shows
/**
 * @swagger
 * /popular:
 *   get:
 *     summary: Get popular TV shows
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: List of popular TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Failed to fetch popular TV shows
 */
router.get('/popular', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/tv/popular');
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular TV shows' });
  }
});

// Fetch latest TV show
/**
 * @swagger
 * /latest:
 *   get:
 *     summary: Get latest TV show
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: Latest TV show details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Failed to fetch latest TV show
 */
router.get('/latest', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/tv/latest');
    res.json(new TVShow(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest TV show' });
  }
});

// Fetch airing today TV shows
/**
 * @swagger
 * /airing_today:
 *   get:
 *     summary: Get TV shows airing today
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: List of TV shows airing today
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Failed to fetch airing today TV shows
 */
router.get('/airing_today', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/tv/airing_today');
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch airing today TV shows' });
  }
});

// Fetch TV shows currently on the air
/**
 * @swagger
 * /on_the_air:
 *   get:
 *     summary: Get TV shows currently on the air
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: List of TV shows currently on the air
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Failed to fetch TV shows on the air
 */
router.get('/on_the_air', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/tv/on_the_air');
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TV shows on the air' });
  }
});

// Fetch top-rated TV shows
/**
 * @swagger
 * /top_rated:
 *   get:
 *     summary: Get top-rated TV shows
 *     tags: [TvShows]
 *     responses:
 *       200:
 *         description: List of top-rated TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       500:
 *         description: Failed to fetch top-rated TV shows
 */
router.get('/top_rated', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/tv/top_rated');
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top-rated TV shows' });
  }
});

// Search for TV shows
/**
 * @swagger
 * /search/tv:
 *   get:
 *     summary: Search for TV shows
 *     tags: [TvShows]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of TV shows matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       400:
 *         description: Query parameter is required
 *       500:
 *         description: Failed to search TV shows
 */
router.get('/search/tv', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  try {
    const data = await fetchFromTmdb(`/search/tv?query=${encodeURIComponent(query)}`);
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to search TV shows' });
  }
});

// Validation Middleware for Series ID
const validateSeriesId = (req, res, next) => {
  const { series_id } = req.params;
  if (!/^\d+$/.test(series_id)) {
    return res.status(400).json({ error: 'Invalid series_id format. It must be a number.' });
  }
  next();
};

/**
 * @swagger
 * /{series_id}:
 *   get:
 *     summary: Get TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: TV show details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TVShow'
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch TV show with the given ID
 */
router.get('/:series_id', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}`);
    res.json(new TVShow(data));
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/videos:
 *   get:
 *     summary: Get videos for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of videos for the TV show
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch videos for the TV show with the given ID
 */
router.get('/:series_id/videos', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/videos`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch videos for TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/watch/providers:
 *   get:
 *     summary: Get watch providers for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of watch providers for the TV show
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch watch providers for the TV show with the given ID
 */
router.get('/:series_id/watch/providers', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/watch/providers`);
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch watch providers for TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/images:
 *   get:
 *     summary: Get images for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of images for the TV show
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch images for the TV show with the given ID
 */
router.get('/:series_id/images', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/images`);
    res.json(data.backdrops);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch images for TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/credits:
 *   get:
 *     summary: Get credits for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of credits for the TV show
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cast:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'  # Assuming you have a Person schema defined
 *                 crew:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Person'  # Assuming you have a Person schema defined
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch credits for the TV show with the given ID
 */
router.get('/:series_id/credits', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/credits`);
    const cast = data.cast.map((person) => new Person(person));
    const crew = data.crew.map((person) => new Person(person));
    res.json({ cast, crew });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch credits for TV show with id ${series_id}` });
  }
});


/**
 * @swagger
 * /{series_id}/reviews:
 *   get:
 *     summary: Get reviews for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews for the TV show
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch reviews for the TV show with the given ID
 */
router.get('/:series_id/reviews', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/reviews`);
    const reviews = data.results.map(reviewData => new Review(reviewData));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch reviews for TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/recommendations:
 *   get:
 *     summary: Get recommendations for a TV show by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of recommended TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch recommendations for the TV show with the given ID
 */
router.get('/:series_id/recommendations', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/recommendations`);
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch recommendations for TV show with id ${series_id}` });
  }
});

/**
 * @swagger
 * /{series_id}/similar:
 *   get:
 *     summary: Get similar TV shows by series ID
 *     tags: [TvShows]
 *     parameters:
 *       - name: series_id
 *         in: path
 *         required: true
 *         description: The ID of the TV show
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of similar TV shows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVShow'
 *       400:
 *         description: Invalid series_id format
 *       500:
 *         description: Failed to fetch similar TV shows for the given ID
 */
router.get('/:series_id/similar', validateSeriesId, async (req, res) => {
  const { series_id } = req.params;
  try {
    const data = await fetchFromTmdb(`/tv/${series_id}/similar`);
    res.json(data.results.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch similar TV shows for id ${series_id}` });
  }
});

module.exports = router;
