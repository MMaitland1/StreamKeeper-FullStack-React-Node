// CacheManager.js
class CacheManager {
    constructor() {
        if (CacheManager.instance) {
            return CacheManager.instance;
        }

        // Base cache for primary endpoints
        this.baseCache = new Map();
        this.lastBaseRefresh = new Date();
        this.refreshInterval = 8 * 60 * 60 * 1000; // 8 hours

        // Flex cache with access tracking
        this.flexCache = new Map();
        this.flexAccessCounts = new Map();
        this.flexLimit = 100;
        this.flexClearAmount = 60;

        // Favorite cache with daily reset
        this.favoriteCache = new Map();
        this.lastFavoriteReset = new Date();
        this.favoriteResetInterval = 24 * 60 * 60 * 1000; // 24 hours
        this.favoriteThreshold = 7;

        this.primaryEndpoints = new Set([
            '/movie/top_rated',
            '/movie/popular',
            '/movie/now_playing',
            '/movie/upcoming',
            '/tv/popular',
            '/tv/on_the_air',
            '/tv/airing_today',
            '/tv/top_rated'
        ]);

        this.blacklistedEndpoints = new Set([
            '/configuration',
            '/validate',
            '/health'
        ]);

        CacheManager.instance = this;
    }

    needsBaseCacheRefresh() {
        return (new Date() - this.lastBaseRefresh) > this.refreshInterval;
    }

    needsFavoriteCacheReset() {
        return (new Date() - this.lastFavoriteReset) > this.favoriteResetInterval;
    }

    moveToTopOfFlex(key, value) {
        this.flexCache.delete(key);
        
        if (this.flexCache.size >= this.flexLimit) {
            const entries = Array.from(this.flexCache.entries());
            const keepEntries = entries.slice(0, this.flexLimit - this.flexClearAmount);
            this.flexCache.clear();
            keepEntries.forEach(([k, v]) => this.flexCache.set(k, v));
        }

        this.flexCache.set(key, value);
    }

    incrementAccessCount(key) {
        const currentCount = this.flexAccessCounts.get(key) || 0;
        const newCount = currentCount + 1;
        this.flexAccessCounts.set(key, newCount);

        if (newCount >= this.favoriteThreshold) {
            const value = this.flexCache.get(key);
            this.favoriteCache.set(key, value);
            this.flexCache.delete(key);
            this.flexAccessCounts.delete(key);
        }

        return newCount;
    }

    async handle(endpoint, params, fetchFunction) {
        if (this.blacklistedEndpoints.has(endpoint)) {
            return await fetchFunction();
        }

        const key = `${endpoint}_${JSON.stringify(params)}`;
        const isPrimaryEndpoint = this.primaryEndpoints.has(endpoint);

        if (this.needsFavoriteCacheReset()) {
            this.favoriteCache.clear();
            this.lastFavoriteReset = new Date();
        }

        // Handle primary endpoints in base cache
        if (isPrimaryEndpoint) {
            if (this.needsBaseCacheRefresh()) {
                this.baseCache.clear();
                this.lastBaseRefresh = new Date();
            }
            if (this.baseCache.has(key)) {
                return this.baseCache.get(key);
            }
        } else {
            // Check favorite cache first
            if (this.favoriteCache.has(key)) {
                return this.favoriteCache.get(key);
            }

            // Then check flex cache
            if (this.flexCache.has(key)) {
                const value = this.flexCache.get(key);
                this.incrementAccessCount(key);
                this.moveToTopOfFlex(key, value);
                return value;
            }
        }

        // If not in any cache, fetch and store
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
            throw error;
        }
    }
}

// Create and export singleton instance
const cacheManager = new CacheManager();
module.exports = cacheManager;