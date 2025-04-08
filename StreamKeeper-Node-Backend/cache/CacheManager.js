// CacheManager.js
class CacheManager {
    constructor() {
        if (CacheManager.instance) {
            return CacheManager.instance; // Ensure a single instance of CacheManager is created (Singleton pattern)
        }

        // Base cache for primary endpoints
        this.baseCache = new Map(); // Stores primary endpoint data
        this.lastBaseRefresh = new Date(); // Tracks last refresh time for base cache
        this.refreshInterval = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

        // Flex cache with access tracking
        this.flexCache = new Map(); // Stores less critical endpoint data
        this.flexAccessCounts = new Map(); // Tracks access counts for flex cache entries
        this.flexLimit = 100; // Maximum number of entries allowed in flex cache
        this.flexClearAmount = 60; // Number of entries to clear when limit is reached

        // Favorite cache with daily reset
        this.favoriteCache = new Map(); // Stores high-priority or frequently accessed data
        this.lastFavoriteReset = new Date(); // Tracks last reset time for favorite cache
        this.favoriteResetInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.favoriteThreshold = 7; // Threshold for moving entries from flex to favorite cache

        this.primaryEndpoints = new Set([
            '/movie/top_rated',
            '/movie/popular',
            '/movie/now_playing',
            '/movie/upcoming',
            '/tv/popular',
            '/tv/on_the_air',
            '/tv/airing_today',
            '/tv/top_rated'
        ]); // Predefined list of primary endpoints

        this.blacklistedEndpoints = new Set([
            '/configuration',
            '/validate',
            '/health'
        ]); // Endpoints that bypass caching

        CacheManager.instance = this; // Assign the singleton instance
    }

    // Checks if base cache needs a refresh
    needsBaseCacheRefresh() {
        return (new Date() - this.lastBaseRefresh) > this.refreshInterval;
    }

    // Checks if favorite cache needs a reset
    needsFavoriteCacheReset() {
        return (new Date() - this.lastFavoriteReset) > this.favoriteResetInterval;
    }

    // Moves an entry to the top of the flex cache and trims the cache if necessary
    moveToTopOfFlex(key, value) {
        this.flexCache.delete(key); // Remove existing entry if present
        
        if (this.flexCache.size >= this.flexLimit) {
            const entries = Array.from(this.flexCache.entries()); // Convert cache to array
            const keepEntries = entries.slice(0, this.flexLimit - this.flexClearAmount); // Retain only a subset of entries
            this.flexCache.clear(); // Clear the cache
            keepEntries.forEach(([k, v]) => this.flexCache.set(k, v)); // Restore retained entries
        }

        this.flexCache.set(key, value); // Add or update the entry
    }

    // Increments access count for a flex cache entry
    incrementAccessCount(key) {
        const currentCount = this.flexAccessCounts.get(key) || 0; // Get current count or default to 0
        const newCount = currentCount + 1; // Increment count
        this.flexAccessCounts.set(key, newCount); // Update the count

        if (newCount >= this.favoriteThreshold) {
            const value = this.flexCache.get(key); // Get the value from flex cache
            this.favoriteCache.set(key, value); // Move entry to favorite cache
            this.flexCache.delete(key); // Remove entry from flex cache
            this.flexAccessCounts.delete(key); // Remove entry from access count map
        }

        return newCount; // Return updated count
    }


    /**
     * Handles fetching and caching logic for a given endpoint and parameters.
     * @param {string} endpoint - The API endpoint being requested.
     * @param {object} params - Query parameters for the request.
     * @param {Function} fetchFunction - Function to fetch data if not in cache.
     * @returns {Promise<any>} - The fetched or cached data.
     */
    async handle(endpoint, params, fetchFunction) {
        /**
         * Bypass caching for blacklisted endpoints.
         * Directly fetch data without storing it.
         */
        if (this.blacklistedEndpoints.has(endpoint)) {
            return await fetchFunction();
        }

        // Generate a unique key based on endpoint and parameters
        const key = `${endpoint}_${JSON.stringify(params)}`;
        // Determine if the endpoint belongs to the primary category
        const isPrimaryEndpoint = this.primaryEndpoints.has(endpoint);

        /**
         * Reset favorite cache if conditions require it.
         * This ensures stale data is cleared at appropriate intervals.
         */
        if (this.needsFavoriteCacheReset()) {
            this.favoriteCache.clear();
            this.lastFavoriteReset = new Date();
        }

        /**
         * Handle caching for primary endpoints.
         * These are stored in the base cache and refreshed based on conditions.
         */
        if (isPrimaryEndpoint) {
            if (this.needsBaseCacheRefresh()) {
                this.baseCache.clear();
                this.lastBaseRefresh = new Date();
            }
            if (this.baseCache.has(key)) {
                return this.baseCache.get(key);
            }
        } else {
            /**
             * First, check the favorite cache for data.
             * If found, return it immediately.
             */
            if (this.favoriteCache.has(key)) {
                return this.favoriteCache.get(key);
            }

            /**
             * Next, check the flex cache for data.
             * If found, reprioritize and return it.
             */
            if (this.flexCache.has(key)) {
                const value = this.flexCache.get(key);
                this.incrementAccessCount(key);
                this.moveToTopOfFlex(key, value);
                return value;
            }
        }

        /**
         * If data is not found in any cache, fetch from the source.
         * The result is then stored in the appropriate cache.
         */
        try {
            const data = await fetchFunction();

            if (isPrimaryEndpoint) {
                this.baseCache.set(key, data);
            } else {
                this.moveToTopOfFlex(key, data);
                this.incrementAccessCount(key);
            }

            return data;
        } catch (error) {
            throw error; // Propagate the error for external handling
        }
    }

}

// Create and export singleton instance
const cacheManager = new CacheManager();
module.exports = cacheManager;
