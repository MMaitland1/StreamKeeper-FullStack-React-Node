# StreamKeeper - Full Stack Media Application

## Overview
StreamKeeper is a full-stack application designed for movie and TV show enthusiasts to explore, search, and learn about their favorite content using The Movie Database (TMDb) API. The solution combines a Node.js backend API and a React frontend interface to deliver a seamless and dynamic user experience with robust functionality for discovering movies, TV shows, and related content.

## Key Features

## Backend (Node.js API)
- **Multi-Server Architecture**:  
  The API is modularized into separate servers handling specific routes for movies, TV shows, persons, and general TMDb queries. This separation enhances modularity, maintainability, and scalability, allowing easy upgrades or modifications for individual components.
- **Swagger-Documented Endpoints**:  
  Provides a detailed and user-friendly interface for exploring and testing available routes within the API. This documentation improves developer experience and ensures a clear understanding of available operations.
- **Flexible Search Functionality**:  
  A powerful search feature enables optimized and flexible querying of movies, TV shows, and persons from the database. Search queries are handled efficiently to ensure accurate and fast results.
- **Comprehensive Error Handling**:  
  Robust error handling mechanisms ensure consistent and informative API responses, contributing to a seamless user experience and easier debugging.
- **Health Check Routes**:  
  Built-in health check endpoints offer simple and effective monitoring and validation of API status and availability.
  
## Frontend (React)
- **Responsive Design**:  
  The frontend is built with responsive design principles to ensure it adapts gracefully to various devices, including desktops, tablets, and mobile devices. Users experience a consistent and optimized interface regardless of screen size.
- **Real-Time Search**:  
  Features an interactive search bar for quick searches of movies, TV shows, and people. The search provides instant results, improving user engagement and experience.
- **Detailed Media Pages**:  
  Users can access comprehensive information on movies and TV shows, including ratings, reviews, trailers, and related content. This provides an enriched media experience.
- **Efficient Caching Mechanism**:  
  The frontend utilizes caching to reduce redundant API calls, improving load times and ensuring a faster, smoother user experience.
- **User-Friendly Navigation**:  
  The navigation system is designed to be intuitive, with clear links for browsing content, searching, and viewing specific details. This makes the application easy to use for all users.

## Microservices
- **Scalable Architecture**:  
  Each service operates independently, handling a distinct domain, such as movies, TV shows, or user data. This isolation supports horizontal scaling, making it easier to deploy, maintain, and upgrade individual services without affecting the overall system.
- **Service Communication**:  
  Microservices communicate via lightweight, standardized protocols (e.g., REST, gRPC, or message queues). This ensures efficient data exchange and minimizes coupling between services.
- **Load Balancing**:  
  Traffic is evenly distributed across multiple services, providing fault tolerance and optimizing resource usage. Load balancers ensure high availability and consistent performance.
- **Independent Deployment**:  
  Services can be developed, deployed, and maintained independently. This accelerates development cycles and supports continuous integration and deployment (CI/CD) practices.
- **Dedicated Databases**:  
  Each microservice may have its dedicated database, ensuring optimal data modeling and reducing potential conflicts with other services.

## Technology Stack
- **Backend**: Node.js, Express.js, Axios for API requests, and Swagger for API documentation.
- **Frontend**: React with Context API for state management, Axios for API calls, Jest, and React Testing Library for testing.
- **Additional Tools**: dotenv for environment variables (backend) and modern CSS for styling (frontend).

## Project Structure

### Backend Structure
- `controllers/`: Handles request logic for movies, TV shows, persons, etc.
- `helpers/`: Utility functions for TMDb API interactions.
- `models/`: Data models for Media, Movie, TVShow, Person, and Review.
- `routes/`: Route definitions for different API functionalities.
- `swagger/`: Configuration for generating Swagger documentation.

### Frontend Structure
- `components/`: Reusable React components like Navbar, SearchBar, DisplayCards, etc.
- `pages/`: Page components for Home, Browse, Movie/TV Details, etc.
- `services/`: Handles API calls and data fetching.
- `cache/`: Implements caching for improved performance.

## Getting Started

### Prerequisites
- Node.js (version >= 12.x recommended)
- npm (Node Package Manager)

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
3. **Set up environment variables (Backend):**
   Create a `.env` file:
   ```plaintext
   TMDB_API_KEY=your_tmdb_api_key
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```
   Replace `your_tmdb_api_key` with a valid TMDb API key.

4. **Run the applications:**
   - **Backend:**
     ```bash
     node index.js
     ```
   - **Frontend:**
     ```bash
     npm start
     ```
   Access the frontend at `http://localhost:3000`.

## Available Routes

### Backend Routes
- **General TMDb Routes** (`/api`): Health checks, API key validation, etc.
- **TV Show Routes** (`/api/tv`): Popular shows, search, details, etc.
- **Movie Routes** (`/api/movies`): Popular movies, search, details, etc.
- **Person Routes** (`/api/person`): Popular persons, search, details, etc.

### Frontend Routes
- `/`: Home Page
- `/browse`: Browse Page
- `/movie/:id`: Movie Detail Page
- `/tv/:id`: TV Show Detail Page
- `/search`: Search Results Page

## Testing
- **Backend**: Use Jest for testing API routes and business logic.
- **Frontend**: Jest and React Testing Library for component and UI testing.

