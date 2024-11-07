import axios from 'axios';

class PersonService {
  constructor() {
    // Create an Axios instance for API requests with the base URL set
    this.api = axios.create({
      baseURL: 'http://localhost:3004/api/person', // Update this to your actual backend URL
    });
  }

  // Method to check the health status of the backend service
  async checkHealth() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health status:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  }

  // Method to fetch a list of popular persons
  async getPopularPersons() {
    try {
      const response = await this.api.get('/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular persons:', error);
      throw error;
    }
  }

  // Method to fetch details of a person by their ID
  async getPersonById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching person with ID ${id}:`, error);
      throw error;
    }
  }

  // Method to fetch movie credits of a person by their ID
  async getPersonMovieCredits(id) {
    try {
      const response = await this.api.get(`/${id}/movie_credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie credits for person ID ${id}:`, error);
      throw error;
    }
  }

  // Method to fetch TV credits of a person by their ID
  async getPersonTvCredits(id) {
    try {
      const response = await this.api.get(`/${id}/tv_credits`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching TV credits for person ID ${id}:`, error);
      throw error;
    }
  }

  // Method to fetch images of a person by their ID
  async getPersonImages(id) {
    try {
      const response = await this.api.get(`/${id}/images`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for person ID ${id}:`, error);
      throw error;
    }
  }

  // Method to fetch external IDs (e.g., IMDB ID) for a person by their ID
  async getPersonExternalIds(id) {
    try {
      const response = await this.api.get(`/${id}/external_ids`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching external IDs for person ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a single instance of the PersonService class for reuse across the application
const personServiceInstance = new PersonService();
export default personServiceInstance;
