const express = require('express');
const router = express.Router();
const fetchFromTmdb = require('../helpers/tmdbHelper');
const Person = require('../models/Person');
const TVShow = require('../models/TVShow');
const Movie = require('../models/Movie');

/**
 * @swagger
 * tags:
 *   name: Person
 *   description: Person management
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [Person]
 *     responses:
 *       200:
 *         description: Person API is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Person API is running' });
});

/**
 * @swagger
 * /popular:
 *   get:
 *     summary: Get popular persons
 *     tags: [Person]
 *     responses:
 *       200:
 *         description: List of popular persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Failed to fetch popular persons
 */
router.get('/popular', async (req, res) => {
  try {
    const data = await fetchFromTmdb('/person/popular');
    res.json(data.results.map((item) => new Person(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular persons' });
  }
});

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for a person
 *     tags: [Person]
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: The search query for the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results for the person
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Failed to perform search
 */
router.get('/search', async (req, res) => {
  const query = req.query.query;
  try {
    const data = await fetchFromTmdb(`/search/person?query=${query}`);
    res.json(data.results.map((item) => new Person(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

/**
 * @swagger
 * /{id}/movie_credits:
 *   get:
 *     summary: Get person's movie credits
 *     tags: [Person]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Person's movie credits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       500:
 *         description: Failed to fetch person movie credits
 */
router.get('/:id(\\d+)/movie_credits', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/person/${req.params.id}/movie_credits`);
    res.json(data.cast.map((item) => new Movie(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person movie credits' });
  }
});

/**
 * @swagger
 * /{id}/tv_credits:
 *   get:
 *     summary: Get person's TV credits
 *     tags: [Person]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Person's TV credits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       500:
 *         description: Failed to fetch person TV credits
 */
router.get('/:id(\\d+)/tv_credits', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/person/${req.params.id}/tv_credits`);
    res.json(data.cast.map((item) => new TVShow(item)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person TV credits' });
  }
});

/**
 * @swagger
 * /{id}/images:
 *   get:
 *     summary: Get person images
 *     tags: [Person]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Person's images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to fetch person images
 */
router.get('/:id(\\d+)/images', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/person/${req.params.id}/images`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person images' });
  }
});

/**
 * @swagger
 * /{id}/external_ids:
 *   get:
 *     summary: Get external IDs for a person
 *     tags: [Person]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: External IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to fetch external IDs
 */
router.get('/:id(\\d+)/external_ids', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/person/${req.params.id}/external_ids`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch external IDs' });
  }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get person details by ID
 *     tags: [Person]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the person
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Person details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Person'
 *       500:
 *         description: Failed to fetch person details
 */
router.get('/:id(\\d+)', async (req, res) => {
  try {
    const data = await fetchFromTmdb(`/person/${req.params.id}`);
    res.json(new Person(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch person details' });
  }
});

module.exports = router;  // Export the router
