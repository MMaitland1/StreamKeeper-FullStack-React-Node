const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Media API',
      version: '1.0.0',
      description: 'API documentation for various media types (Movies, TV Shows, Persons, Reviews)',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'General API routes',
      },
      {
        url: 'http://localhost:3002/api/movies', 
        description: 'Movie-specific routes',
      },
      {
        url: 'http://localhost:3003/api/tv', 
        description: 'TV Show-specific routes',
      },
      {
        url: 'http://localhost:3004/api/person',
        description: 'Person-specific routes',
      },
    ],
    components: {
      schemas: {
        Media: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the media',
            },
            mediaType: {
              type: 'string',
              description: 'Type of media (e.g., Movie, TV Show, Person)',
              default: 'unknown',
            },
            popularity: {
              type: 'number',
              format: 'float',
              description: 'Popularity score of the media',
            },
            overview: {
              type: 'string',
              description: 'Overview or description of the media',
            },
            posterPath: {
              type: 'string',
              description: 'Path to the poster image',
            },
            backdropPath: {
              type: 'string',
              description: 'Path to the backdrop image',
            },
          },
        },
        Movie: {
          allOf: [
            { $ref: '#/components/schemas/Media' },
            {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the movie',
                },
                originalTitle: {
                  type: 'string',
                  description: 'Original title of the movie',
                },
                releaseDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Release date of the movie',
                },
                genreIds: {
                  type: 'array',
                  items: {
                    type: 'integer',
                  },
                  description: 'List of genre IDs associated with the movie',
                },
                voteAverage: {
                  type: 'number',
                  format: 'float',
                  description: 'Average vote for the movie',
                },
                voteCount: {
                  type: 'integer',
                  description: 'Total number of votes for the movie',
                },
              },
            },
          ],
        },
        Person: {
          allOf: [
            { $ref: '#/components/schemas/Media' },
            {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the person',
                },
                knownFor: {
                  type: 'array',
                  items: { type: 'object' },
                  description: 'Known works or projects for the person',
                },
                gender: {
                  type: 'integer',
                  description: 'Gender of the person',
                },
                knownForDepartment: {
                  type: 'string',
                  description: 'Known department for the person',
                },
              },
            },
          ],
        },
        TVShow: {
          allOf: [
            { $ref: '#/components/schemas/Media' },
            {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the TV show',
                },
                originalName: {
                  type: 'string',
                  description: 'Original name of the TV show',
                },
                firstAirDate: {
                  type: 'string',
                  format: 'date',
                  description: 'First air date of the TV show',
                },
                genreIds: {
                  type: 'array',
                  items: { type: 'integer' },
                  description: 'List of genre IDs for the TV show',
                },
                voteAverage: {
                  type: 'number',
                  format: 'float',
                  description: 'Average vote for the TV show',
                },
                voteCount: {
                  type: 'integer',
                  description: 'Total vote count for the TV show',
                },
              },
            },
          ],
        },
        Review: {
          type: 'object',
          properties: {
            author: {
              type: 'string',
              description: 'Author of the review',
            },
            content: {
              type: 'string',
              description: 'Content of the review',
            },
            created: {
              type: 'string',
              format: 'date-time',
              description: 'Date the review was created',
            },
            updated: {
              type: 'string',
              format: 'date-time',
              description: 'Date the review was last updated',
            },
            rating: {
              type: 'number',
              description: 'Rating given by the author',
              default: 0,
            },
          },
        },
      },
    },
  },
  apis: [
    './controller/tmdbController.js',
    './controller/movieController.js', 
    './controller/tvShowController.js', 
    './controller/personController.js'
  ],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
