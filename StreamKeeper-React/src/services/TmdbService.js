import axios from 'axios';

class TmdbService {
  constructor() {
    // Create an Axios instance with a specified base URL for API requests
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api', // Update to your actual backend URL
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

  // Method to validate the TMDB API key by requesting a new token
  async validateApiKey() {
    try {
      await this.api.get('/auth/validate');
      return { message: 'API Key is valid' }; // Return confirmation message on success
    } catch (error) {
      console.error('Invalid API Key:', error);
      throw error; // Handle invalid API key error
    }
  }

  // Method to search for collections by a specified query
  async searchCollections(query) {
    try {
      const response = await this.api.get('/search/collection', {
        params: { query }, // Pass query as a parameter
      });
      return response.data.results; // Return the results array
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  }

  // Method to search for companies by a specified query
  async searchCompanies(query) {
    try {
      const response = await this.api.get('/search/company', {
        params: { query }, // Pass query as a parameter
      });
      return response.data.results; // Return the results array
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  // Method to perform a multi-search across movies, TV shows, and people
  async multiSearch(query) {
    try {
      const response = await this.api.get('/search/multi', {
        params: { query }, // Pass query as a parameter
      });
      return response.data; // Return the entire response data
    } catch (error) {
      console.error('Error fetching multi-search results:', error);
      throw error;
    }
  }

  // Method to search for keywords by a specified query
  async searchKeywords(query) {
    try {
      const response = await this.api.get('/search/keyword', {
        params: { query }, // Pass query as a parameter
      });
      return response.data.results; // Return the results array
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }
}

// Export a single instance of the TmdbService class for reuse across the application
const tmdbServiceInstance = new TmdbService();
export default tmdbServiceInstance;
