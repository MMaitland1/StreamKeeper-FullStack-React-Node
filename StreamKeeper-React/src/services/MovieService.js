import axios from 'axios';

class MovieService {
  constructor() {
    // Create an Axios instance for making API requests with a base URL set
    this.api = axios.create({
      baseURL: 'http://localhost:3002/api/movies', // Update to your actual backend URL
    });
  }

  // Method to check the health status of the backend service
  async checkHealth() {
    try {
      const response = await this.api.get(`/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  }

  // Method to fetch details of a movie by its ID
  async getMovieById(movieId) {
    try {
      const response = await this.api.get(`/${movieId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch images related to a movie by its ID
  async getMovieImages(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch credits (cast and crew) of a movie by its ID
  async getMovieCredits(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching credits for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch external IDs (e.g., IMDB ID) for a movie by its ID
  async getMovieExternalIds(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/external_ids`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching external IDs for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch movie recommendations based on a given movie ID
  async getMovieRecommendations(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/recommendations`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recommendations for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch movies similar to a given movie by its ID
  async getSimilarMovies(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/similar`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching similar movies for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch videos (e.g., trailers) related to a movie by its ID
  async getMovieVideos(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/videos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch watch providers for a movie by its ID
  async getMovieWatchProviders(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/watch/providers`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching watch providers for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch user reviews for a movie by its ID
  async getMovieReviews(movieId) {
    try {
      const response = await this.api.get(`/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for movie ID ${movieId}:`, error);
      throw error;
    }
  }

  // Method to fetch a list of popular movies
  async getPopularMovies() {
    try {
      const response = await this.api.get(`/popular`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  // Method to fetch movies that are currently playing in theaters
  async getNowPlayingMovies() {
    try {
      const response = await this.api.get(`/now_playing`);
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  // Method to fetch top-rated movies
  async getTopRatedMovies() {
    try {
      const response = await this.api.get(`/top_rated`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top-rated movies:', error);
      throw error;
    }
  }

  // Method to fetch upcoming movies
  async getUpcomingMovies() {
    try {
      const response = await this.api.get(`/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  // Method to search for movies by a query string
  async searchMovies(query) {
    try {
      const response = await this.api.get(`/search`, {
        params: { query }, // Pass the search query as a parameter
      });
      return response.data;
    } catch (error) {
      console.error('Error searching for movies:', error);
      throw error;
    }
  }
}

// Export a single instance of the MovieService class for reuse across the application
const movieServiceInstance = new MovieService();
export default movieServiceInstance;
