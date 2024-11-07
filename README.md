# StreamKeeper - Full Stack Media Application

![StreamKeeper Logo]([public/Logo.png](https://imgur.com/7LgzqQ8))

## Overview

StreamKeeper is a full-stack application designed for movie and TV show enthusiasts to explore, search, and learn about their favorite content using The Movie Database (TMDb) API. The solution combines a Node.js backend API and a React frontend interface to deliver a seamless and dynamic user experience with robust functionality for discovering movies, TV shows, and related content.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Backend (Node.js API)](#backend-nodejs-api)
  - [Frontend (React)](#frontend-react)
  - [Microservices](#microservices)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Applications](#running-the-applications)
- [Available Routes](#available-routes)
  - [Backend Routes](#backend-routes)
    - [Backend API Servers](#backend-api-servers)
  - [Frontend Routes](#frontend-routes)
- [Testing](#testing)
- [License](#license)
- [Contact](#contact)

## Key Features

### Backend (Node.js API)

- **Multi-Server Architecture:**  
  The API is modularized into separate servers handling specific routes for movies, TV shows, persons, and general TMDb queries. This separation enhances modularity, maintainability, and scalability, allowing easy upgrades or modifications for individual components.

- **Swagger-Documented Endpoints:**  
  Provides a detailed and user-friendly interface for exploring and testing available routes within the API. This documentation improves developer experience and ensures a clear understanding of available operations.

- **Flexible Search Functionality:**  
  A powerful search feature enables optimized and flexible querying of movies, TV shows, and persons from the database. Search queries are handled efficiently to ensure accurate and fast results.

- **Comprehensive Error Handling:**  
  Robust error handling mechanisms ensure consistent and informative API responses, contributing to a seamless user experience and easier debugging.

- **Health Check Routes:**  
  Built-in health check endpoints offer simple and effective monitoring and validation of API status and availability.

### Frontend (React)

- **Responsive Design:**  
  The frontend is built with responsive design principles to ensure it adapts gracefully to various devices, including desktops, tablets, and mobile devices. Users experience a consistent and optimized interface regardless of screen size.

- **Real-Time Search:**  
  Features an interactive search bar for quick searches of movies, TV shows, and people. The search provides instant results, improving user engagement and experience.

- **Detailed Media Pages:**  
  Users can access comprehensive information on movies and TV shows, including ratings, reviews, trailers, and related content. This provides an enriched media experience.

- **Efficient Caching Mechanism:**  
  The frontend utilizes caching to reduce redundant API calls, improving load times and ensuring a faster, smoother user experience.

- **User-Friendly Navigation:**  
  The navigation system is designed to be intuitive, with clear links for browsing content, searching, and viewing specific details. This makes the application easy to use for all users.

### Microservices

- **Scalable Architecture:**  
  Each service operates independently, handling a distinct domain, such as movies, TV shows, or user data. This isolation supports horizontal scaling, making it easier to deploy, maintain, and upgrade individual services without affecting the overall system.

- **Service Communication:**  
  Microservices communicate via lightweight, standardized protocols (e.g., REST, gRPC, or message queues). This ensures efficient data exchange and minimizes coupling between services.

- **Load Balancing:**  
  Traffic is evenly distributed across multiple services, providing fault tolerance and optimizing resource usage. Load balancers ensure high availability and consistent performance.

- **Independent Deployment:**  
  Services can be developed, deployed, and maintained independently. This accelerates development cycles and supports continuous integration and deployment (CI/CD) practices.

- **Dedicated Databases:**  
  Each microservice may have its dedicated database, ensuring optimal data modeling and reducing potential conflicts with other services.

## Technology Stack

- **Backend:**  
  - Node.js
  - Express.js
  - Axios (for API requests)
  - Swagger (for API documentation)

- **Frontend:**  
  - React
  - Context API (for state management)
  - Axios (for API calls)
  - Jest and React Testing Library (for testing)

- **Additional Tools:**  
  - dotenv (for environment variables in the backend)
  - Modern CSS (for styling in the frontend)

## Project Structure

### Backend Structure

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

### Frontend Structure

```
streamkeeper-react/
├── node_modules/                                    # Directory for npm packages
├── public/                                          # Publicly accessible files
│   ├── Logo.png                                     # Logo image
│   └── index.html                                   # Main HTML file
├── src/                                             # Source files for the React application
│   ├── cache/                                       # Caching mechanism for API responses
│   │   └── cache.js                                 # Cache implementation
│   ├── components/                                  # Reusable React components
│   │   ├── BrowseCard/                              # BrowseCard component directory
│   │   │   ├── BrowseCard.js                        # BrowseCard component logic
│   │   │   ├── BrowseCard.styled.js                 # Styled components for BrowseCard
│   │   │   └── BrowseCard.test.js                   # Tests for BrowseCard component
│   │   ├── DisplayCardA/                            # DisplayCardA component directory
│   │   │   ├── DisplayCardA.js                      # DisplayCardA component logic
│   │   │   ├── DisplayCardA.styled.js               # Styled components for DisplayCardA
│   │   │   └── DisplayCardA.test.js                 # Tests for DisplayCardA component
│   │   ├── DisplayCardB/                            # DisplayCardB component directory
│   │   │   ├── DisplayCardB.js                      # DisplayCardB component logic
│   │   │   ├── DisplayCardB.styled.js               # Styled components for DisplayCardB
│   │   │   └── DisplayCardB.test.js                 # Tests for DisplayCardB component
│   │   ├── DisplayCardCarousel/                     # DisplayCardCarousel component directory
│   │   │   ├── DisplayCardCarousel.js               # DisplayCardCarousel component logic
│   │   │   ├── DisplayCardCarousel.styled.js        # Styled components for DisplayCardCarousel
│   │   │   └── DisplayCardCarousel.test.js          # Tests for DisplayCardCarousel component
│   │   ├── MediaDisplayCarousel/                    # MediaDisplayCarousel component directory
│   │   │   ├── MediaDisplayCarousel.js              # MediaDisplayCarousel component logic
│   │   │   ├── MediaDisplayCarousel.styled.js       # Styled components for MediaDisplayCarousel
│   │   │   └── MediaDisplayCarousel.test.js         # Tests for MediaDisplayCarousel component
│   │   ├── Navbar/                                  # Navbar component directory
│   │   │   ├── Navbar.js                            # Navbar component logic
│   │   │   ├── Navbar.styled.js                     # Styled components for Navbar
│   │   │   └── Navbar.test.js                       # Tests for Navbar component
│   │   ├── ProviderList/                            # ProviderList component directory
│   │   │   ├── ProviderList.js                      # ProviderList component logic
│   │   │   ├── ProviderList.styled.js               # Styled components for ProviderList
│   │   │   └── ProviderList.test.js                 # Tests for ProviderList component
│   │   └── SearchBar/                               # SearchBar component directory
│   │       ├── SearchBar.js                         # SearchBar component logic
│   │       ├── SearchBar.styled.js                  # Styled components for SearchBar
│   │       └── SearchBar.test.js                    # Tests for SearchBar component
│   ├── images/                                      # Directory for image assets
│   ├── models/                                      # Data models representing different entities
│   │   ├── Card.js                                  # Card model
│   │   ├── Media.js                                 # Media model
│   │   ├── Movie.js                                 # Movie model
│   │   ├── Person.js                                # Person model
│   │   └── TVShow.js                                # TV Show model
│   ├── pages/                                       # Page components for routing
│   │   ├── BrowsePage.js                            # BrowsePage component
│   │   ├── HomePage.js                              # HomePage component
│   │   ├── InfoDisplayPage.js                       # InfoDisplayPage component
│   │   ├── MovieDetailPage.js                       # MovieDetailPage component
│   │   ├── PersonDetailPage.js                      # PersonDetailPage component
│   │   ├── SearchResultsPage.js                     # SearchResultsPage component
│   │   └── TvShowDetailPage.js                      # TvShowDetailPage component
│   ├── services/                                    # API service files
│   │   ├── MainService.js                           # Main service for API calls
│   │   ├── MovieService.js                          # Service for movie-related API calls
│   │   ├── PersonService.js                         # Service for person-related API calls
│   │   ├── PrefetchService.js                       # Service for pre-fetching data
│   │   └── TvShowService.js                         # Service for TV show-related API calls
│   ├── App.css                                      # Main application styles
│   ├── App.js                                       # Main application component
│   ├── index.js                                     # Entry point of the application
│   └── reportWebVitals.js                           # Web vitals reporting
├── .gitignore                                       # Specifies files to ignore in Git
├── package-lock.json                                # Lock file for npm packages
├── package.json                                     # Project metadata and dependencies
└── README.md                                        # Project documentation
```

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (version >= 12.x recommended)
- **npm** (Node Package Manager)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to project directories and install dependencies:**

   - **Backend:**

     ```bash
     cd streamkeeper-node-backend
     npm install
     ```

   - **Frontend:**

     ```bash
     cd streamkeeper-react
     npm install
     ```

### Environment Variables

1. **Set up environment variables for the Backend:**

   Create a `.env` file in the `streamkeeper-node-backend` directory:

   ```env
   TMDB_API_KEY=your_tmdb_api_key
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

   Replace `your_tmdb_api_key` with a valid TMDb API key. You can obtain one by signing up at [The Movie Database](https://www.themoviedb.org/).

### Running the Applications

1. **Start the Backend Servers:**

   The backend is divided into multiple servers, each handling specific routes. Open separate terminal windows or tabs for each server and run the following commands:

   - **General TMDb Routes Server:**

     ```bash
     cd streamkeeper-node-backend
     npm run server:api
     ```

     **Running at:** [http://localhost:3001](http://localhost:3001)

   - **Movies Routes Server:**

     ```bash
     cd streamkeeper-node-backend
     npm run server:movies
     ```

     **Running at:** [http://localhost:3002](http://localhost:3002)

   - **TV Shows Routes Server:**

     ```bash
     cd streamkeeper-node-backend
     npm run server:tv
     ```

     **Running at:** [http://localhost:3003](http://localhost:3003)

   - **Persons Routes Server:**

     ```bash
     cd streamkeeper-node-backend
     npm run server:person
     ```

     **Running at:** [http://localhost:3004](http://localhost:3004)

   **Note:** Ensure that each server script (`server:api`, `server:movies`, etc.) is defined in your `package.json` under the `scripts` section.

2. **Start the Frontend:**

   ```bash
   cd streamkeeper-react
   npm start
   ```

3. **Access the Frontend:**

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## Available Routes

### Backend Routes

#### Backend API Servers

StreamKeeper's backend is structured using a multi-server architecture to enhance modularity and scalability. Each server handles a specific domain of the application and runs on a dedicated port.

| **Server**            | **Route Prefix** | **URL**                     | **Description**                                   |
|-----------------------|------------------|-----------------------------|---------------------------------------------------|
| **General API Server**| `/api`           | [http://localhost:3001/api](http://localhost:3001/api) | Handles health checks, API key validation, etc.   |
| **Movies Server**     | `/api/movies`    | [http://localhost:3002/api/movies](http://localhost:3002/api/movies) | Manages movie-related operations like fetching popular movies, searching, and retrieving movie details. |
| **TV Shows Server**   | `/api/tv`        | [http://localhost:3003/api/tv](http://localhost:3003/api/tv) | Manages TV show-related operations such as fetching popular TV shows, searching, and retrieving TV show details. |
| **Persons Server**    | `/api/person`    | [http://localhost:3004/api/person](http://localhost:3004/api/person) | Handles person-related operations including fetching popular persons, searching, and retrieving person details. |

**Note:** Ensure all backend servers are running concurrently to enable full functionality of the application.

### Frontend Routes

- `/` : Home Page
- `/browse` : Browse Page
- `/movie/:id` : Movie Detail Page
- `/tv/:id` : TV Show Detail Page
- `/search` : Search Results Page

## Testing

- **Backend:**  
  Uses Jest for testing API routes and business logic.

- **Frontend:**  
  Utilizes Jest and React Testing Library for component and UI testing.


