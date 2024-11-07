# StreamKeeper-Node-Backend

## Overview

The Movie and TV Show Backend API provides a robust solution for accessing data from The Movie Database (TMDb) API. It offers endpoints for retrieving, searching, and managing information on movies, TV shows, and people, complete with detailed Swagger documentation. This API serves as an integration layer, offering clean, structured, and well-documented routes for easy access to TMDb's extensive database.

### Key Features

- **Multi-Server Architecture**: Dedicated servers for movies, TV shows, persons, and general TMDb queries, running on separate ports for modularity.
- **Swagger Integration**: API documentation generated using Swagger for better visualization and interaction.
- **Flexible Search**: Multi-search capabilities for movies, TV shows, and persons with enhanced query handling.
- **Error Handling**: Robust error handling for seamless user experience.
- **Health Check Routes**: To monitor and validate API status and availability.

### Technology Stack

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building server-side APIs.
- **Axios**: For HTTP requests to TMDb.
- **Swagger**: For API documentation.
- **dotenv**: For loading environment variables.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Routes](#available-routes)
- [Models](#models)
  - [Media](#media)
  - [TVShow](#tvshow)
  - [Movie](#movie)
  - [Person](#person)
  - [Review](#review)
- [Helper Functions](#helper-functions)
- [Microservices Architecture](#microservices-architecture)
- [License](#license)

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version >= 12.x recommended)
- **npm** (Node package manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project directory**:
   ```bash
   cd <project-directory>
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   - Create a `.env` file in the root directory and add the following:
     ```
     TMDB_API_KEY=your_tmdb_api_key
     TMDB_BASE_URL=https://api.themoviedb.org/3
     ```
   - Replace `your_tmdb_api_key` with a valid TMDb API key.

5. **Run the application**:
   ```bash
   node <entry-file.js>  # For example, server.js
   ```

---

## Environment Variables

The application requires the following environment variables:

- `TMDB_API_KEY`: API key for accessing TMDb.
- `TMDB_BASE_URL`: Base URL for TMDb API (default: `https://api.themoviedb.org/3`).

---

## Project Structure

```
project-directory/
├── controllers/
│   ├── movieController.js       // Controller for handling movie-related routes and logic
│   ├── personController.js      // Controller for handling person-related routes and logic
│   ├── tvShowController.js      // Controller for handling TV show-related routes and logic
│   └── tmdbController.js        // Controller for handling routes and logic related to The Movie Database (TMDb) API
├── helpers/
│   └── tmdbHelper.js            // Helper functions for interacting with the TMDb API
├── models/
│   ├── Media.js                 // Base model representing common attributes of different media types
│   ├── Movie.js                 // Model representing a Movie, extending or inheriting from Media
│   ├── Person.js                // Model representing a Person (e.g., actor, director)
│   ├── Review.js                // Model representing user reviews for media items
│   └── TVShow.js                // Model representing a TV Show, extending or inheriting from Media
├── routes/
│   ├── movies.js                // Route definitions and endpoints for movie-related operations
│   ├── persons.js               // Route definitions and endpoints for person-related operations
│   ├── tvShows.js               // Route definitions and endpoints for TV show-related operations
│   └── tmdb.js                  // Route definitions and endpoints for TMDb API-related operations
├── swagger/
│   └── swagger.js               // Swagger configuration for API documentation
└── index.js                     // Main entry point of the application

```

---

## Available Routes

### General TMDb Routes (`/api`)
- **`GET /health`**: Health check endpoint for TMDb API.
- **`GET /auth/validate`**: Validates the TMDb API key.

### TV Show Routes (`/api/tv`)
- **`GET /popular`**: Fetches popular TV shows.
- **`GET /latest`**: Fetches the latest TV show.
- **`GET /airing_today`**: Fetches TV shows airing today.
- **`GET /on_the_air`**: Fetches TV shows currently on the air.
- **`GET /top_rated`**: Fetches top-rated TV shows.
- **`GET /search/tv?query={query}`**: Searches for TV shows.
- **`GET /:series_id`**: Fetches details for a TV show by its series ID.
- Additional endpoints for fetching videos, images, credits, recommendations, etc.

### Movie Routes (`/api/movies`)
- **`GET /popular`**: Fetches popular movies.
- **`GET /now_playing`**: Fetches now-playing movies.
- **`GET /top_rated`**: Fetches top-rated movies.
- **`GET /upcoming`**: Fetches upcoming movies.
- **`GET /search?query={query}`**: Searches for movies.
- **`GET /:movie_id`**: Fetches details for a movie by its ID.
- Additional endpoints for images, credits, reviews, recommendations, etc.

### Person Routes (`/api/person`)
- **`GET /popular`**: Fetches popular persons.
- **`GET /search?query={query}`**: Searches for persons.
- **`GET /:id`**: Fetches details for a person by their ID.
- Additional endpoints for movie and TV credits, images, and external IDs.

---

## Models

### Media

The base class representing common media attributes. This class is extended by `Movie`, `TVShow`, and `Person`.

- **Properties**:
  - `id`: Unique identifier.
  - `mediaType`: Type of the media (default: `'unknown'`).
  - `popularity`: Popularity score.
  - `overview`: Summary or description.
  - `posterPath`: Path to the poster image.
  - `backdropPath`: Path to the backdrop image.

### TVShow

Extends `Media` to add attributes specific to TV shows.

- **Additional Properties**:
  - `name`: TV show's name.
  - `originalName`: Original name of the show.
  - `firstAirDate`: Date of the first episode.
  - `genreIds`: Array of genre identifiers.
  - `voteAverage`: Average user rating.
  - `voteCount`: Number of votes.

### Movie

Extends `Media` to add attributes specific to movies.

- **Additional Properties**:
  - `title`: Movie title.
  - `originalTitle`: Original movie title.
  - `releaseDate`: Release date.
  - `genreIds`: Array of genre identifiers.
  - `voteAverage`: Average user rating.
  - `voteCount`: Number of votes.

### Person

Extends `Media` to add attributes specific to persons.

- **Additional Properties**:
  - `name`: Person's name.
  - `knownFor`: List of movies/TV shows the person is known for.
  - `gender`: Gender identifier.
  - `knownForDepartment`: Person's known department in production.

### Review

Represents a review with details such as author, content, created/updated timestamps, and rating.

---

## Helper Functions

### `fetchFromTmdb(endpoint, params)`

A utility function located in `tmdbHelper.js` that handles requests to the TMDb API. It takes an API `endpoint` and optional query `params`.

---

## Microservices Architecture

The API employs a microservices architecture, enabling modular development, better scalability, and more maintainable codebases by isolating specific responsibilities across different services. Each microservice runs independently and communicates over HTTP, allowing for efficient handling of movies, TV shows, persons, and general TMDb queries.

### Overview of Microservices

- **Movie Service**:
  - **Description**: Handles all endpoints related to movies, such as fetching popular, now-playing, top-rated, and upcoming movies. Also manages movie-specific searches, details, images, credits, and reviews.
  - **Port**: Runs on a dedicated port for isolation.
  - **Endpoints**: Exposes all routes under `/api/movies`.

- **TV Show Service**:
  - **Description**: Manages TV show data, including fetching popular, airing today, on-the-air, top-rated shows, and performing searches. Provides details, videos, images, credits, and more.
  - **Port**: Operates on a separate port for modularity.
  - **Endpoints**: Routes are exposed under `/api/tv`.

- **Person Service**:
  - **Description**: Focuses on endpoints related to persons, such as fetching popular persons, searching persons, and retrieving details, images, and credits.
  - **Port**: Runs on its own dedicated port.
  - **Endpoints**: Exposes all routes under `/api/person`.

- **TMDb General Service**:
  - **Description**: Handles general TMDb queries such as API validation and health check routes. This microservice serves as an integration point for general TMDb API access.
  - **Port**: Operates independently on a dedicated port.
  - **Endpoints**: Routes are exposed under `/api`.

### Benefits of Microservices

- **Modularity**: Each microservice can be independently developed, tested, deployed, and maintained.
- **Scalability**: Services can be scaled independently based

 on demand.
- **Fault Isolation**: Issues in one microservice do not affect others, improving system resilience.
- **Independent Deployment**: Faster deployment cycles and greater flexibility in updates and improvements.

### Communication Between Microservices

- **HTTP Requests**: Microservices communicate using HTTP-based calls, ensuring a lightweight and stateless interaction model.
- **Load Balancing**: Each service can be load-balanced independently to ensure efficient resource utilization.

This modular design ensures that any changes, enhancements, or bug fixes in one service do not impact the functionality of others, making it an ideal approach for a scalable and flexible Movie and TV Show API solution.



