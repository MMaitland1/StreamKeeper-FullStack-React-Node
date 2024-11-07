import axios from 'axios';

class TvShowService {
  constructor() {
    // Create an Axios instance with a base URL for API requests
    this.api = axios.create({
      baseURL: 'http://localhost:3003/api/tv', // Update this to your actual backend URL
    });
  }

  // Health check method to verify service status
  async checkHealth() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  // Method to fetch popular TV shows
  async getPopularTvShows() {
    try {
      const response = await this.api.get('/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      throw error;
    }
  }

  // Method to fetch the latest TV show
  async getLatestTvShow() {
    try {
      const response = await this.api.get('/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest TV show:', error);
      throw error;
    }
  }

  // Method to fetch TV shows airing today
  async getAiringTodayTvShows() {
    try {
      const response = await this.api.get('/airing_today');
      return response.data;
    } catch (error) {
      console.error('Error fetching TV shows airing today:', error);
      throw error;
    }
  }

  // Method to fetch TV shows currently on the air
  async getOnTheAirTvShows() {
    try {
      const response = await this.api.get('/on_the_air');
      return response.data;
    } catch (error) {
      console.error('Error fetching TV shows on the air:', error);
      throw error;
    }
  }

  // Method to fetch top-rated TV shows
  async getTopRatedTvShows() {
    try {
      const response = await this.api.get('/top_rated');
      return response.data;
    } catch (error) {
      console.error('Error fetching top-rated TV shows:', error);
      throw error;
    }
  }

  // Method to search for TV shows by a query string
  async searchTvShows(query) {
    try {
      const response = await this.api.get('/search', {
        params: { query }, // Pass the query as a parameter
      });
      return response.data;
    } catch (error) {
      console.error('Error searching for TV shows:', error);
      throw error;
    }
  }

  // Method to fetch TV show details by its series ID
  async getTvShowById(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch videos related to a TV show by its series ID
  async getTvShowVideos(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/videos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch watch providers for a TV show by its series ID
  async getTvShowWatchProviders(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/watch/providers`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching watch providers for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch images for a TV show by its series ID
  async getTvShowImages(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/images`);
      return response.data.backdrops; // Return only the backdrops
    } catch (error) {
      console.error(`Error fetching images for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch credits (cast and crew) for a TV show by its series ID
  async getTvShowCredits(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/credits`);
      return {
        cast: response.data.cast,
        crew: response.data.crew,
      };
    } catch (error) {
      console.error(`Error fetching credits for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch reviews for a TV show by its series ID
  async getTvShowReviews(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch recommendations for a TV show by its series ID
  async getTvShowRecommendations(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/recommendations`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recommendations for TV show with ID ${seriesId}:`, error);
      throw error;
    }
  }

  // Method to fetch similar TV shows by their series ID
  async getSimilarTvShows(seriesId) {
    try {
      const response = await this.api.get(`/${seriesId}/similar`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching similar TV shows for ID ${seriesId}:`, error);
      throw error;
    }
  }
}

// Export a single instance of the TvShowService class for reuse across the application
const tvShowServiceInstance = new TvShowService();
export default tvShowServiceInstance;
