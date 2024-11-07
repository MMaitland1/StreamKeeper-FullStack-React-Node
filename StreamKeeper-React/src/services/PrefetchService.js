import MainService from './MainService'; // Adjust import based on your project structure

class PrefetchService {
  static instance;

  constructor() {
    if (PrefetchService.instance) {
      return PrefetchService.instance;
    }

    // Map to keep track of completed prefetches
    this.prefetchMap = new Map(); 
    // Map to track pending fetches with associated promises
    this.pendingFetches = new Map(); 

    PrefetchService.instance = this;
  }

  // Generate a unique key to identify a prefetch operation
  generateMapKey(pagename, mediaType, id) {
    return `${pagename}_${mediaType || 'none'}_${id || 'none'}`;
  }

  // Execute a prefetch operation based on page name and optional media type and ID
  async executePrefetch(pagename, mediaType = null, id = null) {
    const mapKey = this.generateMapKey(pagename, mediaType, id);

    // Skip if the prefetch is already completed
    if (this.prefetchMap.has(mapKey)) {
      return;
    }

    // Wait if there is an existing pending fetch for this key
    if (this.pendingFetches.has(mapKey)) {
      await this.pendingFetches.get(mapKey); // Wait for the pending fetch to resolve
      return;
    }

    // Create a promise to track the ongoing prefetch operation
    const fetchPromise = this.performPrefetch(pagename, id)
      .then(() => {
        this.prefetchMap.set(mapKey, true); // Mark as completed
      })
      .catch(error => {
        console.error(`Error during prefetch for ${pagename}:`, error);
        // Optional: handle retries or mark as failed if desired
      })
      .finally(() => {
        this.pendingFetches.delete(mapKey); // Clean up pending fetch map
      });

    // Store the promise in the pending fetches map
    this.pendingFetches.set(mapKey, fetchPromise);

    // Await the promise before returning
    await fetchPromise;
  }
  async prefetchPopularPersonImages() {
    try {
      const popularPersons = await MainService.getPopularPersons(); // Assuming this method exists to get popular persons
        // Loop through each person and call getPersonImages
        for (const person of popularPersons) {
          try {
            await MainService.getPersonImages(person.id); // The only goal is to run this method
          } catch (personError) {
            console.error(`Error fetching images for person ${person.id}:`, personError);
          }
        }
      } catch (error) {
        console.error('Error fetching popular persons:', error
      );
    }    
  }

  // Perform prefetch operations based on the page type
  async performPrefetch(pagename, id) {
    switch (pagename) {
      case 'Browse':
        await this.fetchBrowseData();
        break;

      case 'Home':
        await this.fetchHomeData();
        break;

      case 'Person':
        if (!id) throw new Error('ID is required for Person page prefetch.');
        await this.fetchPersonData(id);
        break;

      case 'TvShow':
        if (!id) throw new Error('ID is required for TVShow page prefetch.');
        await this.fetchTvShowData(id);
        break;

      case 'Movie':
        if (!id) throw new Error('ID is required for Movie page prefetch.');
        await this.fetchMovieData(id);
        break;

      default:
        throw new Error(`Invalid pagename: ${pagename}`);
    }
  }

  // Fetch data for the 'Browse' page
  async fetchBrowseData() {
    await MainService.getTopRatedMovies();
    await MainService.getPopularMovies();
    await MainService.getNowPlayingMovies();
    await MainService.getUpcomingMovies();
    await MainService.getPopularTvShows();
    await MainService.getAiringTodayTvShows();
    await MainService.getOnTheAirTvShows();
    await MainService.getTopRatedTvShows();
    instance.prefetchPopularPersonImages();
  }

  // Fetch data for the 'Home' page
  async fetchHomeData() {
    await MainService.getPopularMovies();
    await MainService.getPopularTvShows();
    await MainService.getTopRatedMovies();
    await MainService.getUpcomingMovies();
    await MainService.getTopRatedTvShows();
    await MainService.getOnTheAirTvShows();
  }

  // Fetch data for a specific person based on their ID
  async fetchPersonData(id) {
    await MainService.getPersonById(id);
    await MainService.getPersonImages(id);
    await MainService.getPersonMovieCredits(id);
    await MainService.getPersonTvCredits(id);
  }

  // Fetch data for a specific TV show based on its ID
  async fetchTvShowData(id) {
    await MainService.getTvShowById(id);
    await MainService.getTvShowRecommendations(id);
    await MainService.getSimilarTvShows(id);
    await MainService.getTvShowWatchProviders(id);
  }

  // Fetch data for a specific movie based on its ID
  async fetchMovieData(id) {
    await MainService.getMovieById(id);
    await MainService.getMovieRecommendations(id);
    await MainService.getSimilarMovies(id);
    await MainService.getMovieWatchProviders(id);
  }





  
}

const instance = new PrefetchService();
Object.freeze(instance);
export default instance;
