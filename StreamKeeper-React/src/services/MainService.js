import movieServiceInstance from './MovieService'; // Import movie service instance
import tvShowServiceInstance from './TvShowService'; // Import TV show service instance
import personServiceInstance from './PersonService'; // Import person service instance
import tmdbServiceInstance from './TmdbService'; // Import TMDB service instance
import Cache from '../cache/cache'; // Import custom cache class

class MainService {
  constructor() {
    // Initialize service instances
    this.tmdbService = tmdbServiceInstance;
    this.movieService = movieServiceInstance;
    this.tvShowService = tvShowServiceInstance;
    this.personService = personServiceInstance;

    // Create separate caches for each service
    this.tmdbCache = new Cache('TMDBCache'); // Cache for TMDB-related queries
    this.movieCache = new Cache('MovieCache'); // Cache for movie-related queries
    this.tvShowCache = new Cache('TvShowCache'); // Cache for TV show-related queries
    this.personCache = new Cache('PersonCache'); // Cache for person-related queries
  
    // Locks to handle race conditions
    this.locks = new Map(); // Store locks per command-query pair
  }

  // Helper method to handle caching logic for any service function with race condition prevention
  async fetchWithCache(serviceFunction, cache, command, query) {
    const key = cache.generateKey(command, query); // Generate key using the Cache class method
    
    // Check if there is a lock for this key
    if (this.locks.has(key)) {
      // Wait for the existing lock to resolve
      await this.locks.get(key);
    }

    // Double-check to see if data is already cached after the lock is released
    if (cache.has(command, query)) {
      return cache.get(command, query); // Return cached data if available
    }

    // Create a new lock (a Promise that will resolve later)
    let resolveLock;
    const lockPromise = new Promise(resolve => {
      resolveLock = resolve;
    });
    this.locks.set(key, lockPromise); // Set the lock

    try {
      // Fetch data using the service function
      const response = await serviceFunction();
      cache.set(command, query, response); // Cache the response
      return response;
    } finally {
      // Release the lock
      this.locks.delete(key);
      resolveLock(); // Resolve the promise, allowing other calls to proceed
    }
  }



  // Health Check Methods
  async checkHealthTMDBService() {
    return this.tmdbService.checkHealth(); // Check health of TMDB service
  }

  async checkHealthMovieService() {
    return this.movieService.checkHealth(); // Check health of movie service
  }

  async checkHealthTvShowService() {
    return this.tvShowService.checkHealth(); // Check health of TV show service
  }

  async checkHealthPersonService() {
    return this.personService.checkHealth(); // Check health of person service
  }

  // TMDB API Key Validation
  async validateApiKey() {
    return this.tmdbService.validateApiKey(); // Validate TMDB API key
  }

  // TMDB-Specific Searches
  async searchCollections(query) {
    return this.fetchWithCache(() => this.tmdbService.searchCollections(query), this.tmdbCache, 'searchCollections', query);
  }

  async searchCompanies(query) {
    return this.fetchWithCache(() => this.tmdbService.searchCompanies(query), this.tmdbCache, 'searchCompanies', query);
  }

  async multiSearch(query) {
    return this.fetchWithCache(() => this.tmdbService.multiSearch(query), this.tmdbCache, 'multiSearch', query);
  }

  async searchKeywords(query) {
    return this.fetchWithCache(() => this.tmdbService.searchKeywords(query), this.tmdbCache, 'searchKeywords', query);
  }

  // Movies
  async getPopularMovies() {
    return this.fetchWithCache(() => this.movieService.getPopularMovies(), this.movieCache, 'getPopularMovies', null);
  }

  async getLatestMovie() {
    return this.fetchWithCache(() => this.movieService.getLatestMovie(), this.movieCache, 'getLatestMovie', null);
  }

  async getNowPlayingMovies() {
    return this.fetchWithCache(() => this.movieService.getNowPlayingMovies(), this.movieCache, 'getNowPlayingMovies', null);
  }

  async getTopRatedMovies() {
    return this.fetchWithCache(() => this.movieService.getTopRatedMovies(), this.movieCache, 'getTopRatedMovies', null);
  }

  async getUpcomingMovies() {
    return this.fetchWithCache(() => this.movieService.getUpcomingMovies(), this.movieCache, 'getUpcomingMovies', null);
  }

  async searchMovies(query) {
    return this.fetchWithCache(() => this.movieService.searchMovies(query), this.movieCache, 'searchMovies', query);
  }

  async getMovieById(id) {
    return this.fetchWithCache(() => this.movieService.getMovieById(id), this.movieCache, 'getMovieById', { id });
  }

  async getMovieRecommendations(id) {
    return this.fetchWithCache(() => this.movieService.getMovieRecommendations(id), this.movieCache, 'getMovieRecommendations', { id });
  }

  async getSimilarMovies(id) {
    return this.fetchWithCache(() => this.movieService.getSimilarMovies(id), this.movieCache, 'getSimilarMovies', { id });
  }

  async getMovieImages(id) {
    return this.fetchWithCache(() => this.movieService.getMovieImages(id), this.movieCache, 'getMovieImages', { id });
  }

  async getMovieVideos(id) {
    return this.fetchWithCache(() => this.movieService.getMovieVideos(id), this.movieCache, 'getMovieVideos', { id });
  }

  async getMovieWatchProviders(id) {
    return this.fetchWithCache(() => this.movieService.getMovieWatchProviders(id), this.movieCache, 'getMovieWatchProviders', { id });
  }

  async getMovieCredits(id) {
    return this.fetchWithCache(() => this.movieService.getMovieCredits(id), this.movieCache, 'getMovieCredits', { id });
  }

  async getMovieReviews(id) {
    return this.fetchWithCache(() => this.movieService.getMovieReviews(id), this.movieCache, 'getMovieReviews', { id });
  }

  // TV Shows
  async getPopularTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getPopularTvShows(), this.tvShowCache, 'getPopularTvShows', null);
  }

  async getAiringTodayTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getAiringTodayTvShows(), this.tvShowCache, 'getAiringTodayTvShows', null);
  }

  async getOnTheAirTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getOnTheAirTvShows(), this.tvShowCache, 'getOnTheAirTvShows', null);
  }

  async getTopRatedTvShows() {
    return this.fetchWithCache(() => this.tvShowService.getTopRatedTvShows(), this.tvShowCache, 'getTopRatedTvShows', null);
  }

  async getLatestTvShow() {
    return this.fetchWithCache(() => this.tvShowService.getLatestTvShow(), this.tvShowCache, 'getLatestTvShow', null);
  }

  async searchTvShows(query) {
    return this.fetchWithCache(() => this.tvShowService.searchTvShows(query), this.tvShowCache, 'searchTvShows', query);
  }

  async getTvShowById(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowById(id), this.tvShowCache, 'getTvShowById', { id });
  }

  async getTvShowRecommendations(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowRecommendations(id), this.tvShowCache, 'getTvShowRecommendations', { id });
  }

  async getSimilarTvShows(id) {
    return this.fetchWithCache(() => this.tvShowService.getSimilarTvShows(id), this.tvShowCache, 'getSimilarTvShows', { id });
  }

  async getTvShowImages(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowImages(id), this.tvShowCache, 'getTvShowImages', { id });
  }

  async getTvShowVideos(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowVideos(id), this.tvShowCache, 'getTvShowVideos', { id });
  }

  async getTvShowWatchProviders(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowWatchProviders(id), this.tvShowCache, 'getTvShowWatchProviders', { id });
  }

  async getTvShowCredits(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowCredits(id), this.tvShowCache, 'getTvShowCredits', { id });
  }

  async getTvShowReviews(id) {
    return this.fetchWithCache(() => this.tvShowService.getTvShowReviews(id), this.tvShowCache, 'getTvShowReviews', { id });
  }

  // Persons
  async getPopularPersons() {
    return this.fetchWithCache(() => this.personService.getPopularPersons(), this.personCache, 'getPopularPersons', null);
  }

  async searchPerson(query) {
    return this.fetchWithCache(() => this.personService.searchPerson(query), this.personCache, 'searchPerson', query);
  }

  async getPersonById(id) {
    return this.fetchWithCache(() => this.personService.getPersonById(id), this.personCache, 'getPersonById', { id });
  }

  async getPersonMovieCredits(id) {
    return this.fetchWithCache(() => this.personService.getPersonMovieCredits(id), this.personCache, 'getPersonMovieCredits', { id });
  }

  async getPersonTvCredits(id) {
    return this.fetchWithCache(() => this.personService.getPersonTvCredits(id), this.personCache, 'getPersonTvCredits', { id });
  }

  async getPersonImages(id) {
    return this.fetchWithCache(() => this.personService.getPersonImages(id), this.personCache, 'getPersonImages', { id });
  }

  async getPersonExternalIds(id) {
    return this.fetchWithCache(() => this.personService.getPersonExternalIds(id), this.personCache, 'getPersonExternalIds', { id });
  }
}

// Export a single instance of MainService
const mainServiceInstance = new MainService();
export default mainServiceInstance;
