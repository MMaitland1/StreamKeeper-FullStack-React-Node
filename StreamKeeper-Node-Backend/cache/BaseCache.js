class BaseCache {
    constructor(cacheName = 'DefaultCache') {
        // Initialize core cache properties
        this.cache = new Map();
        this.cacheName = cacheName;
        this.createdAt = new Date(); // Tracks the creation time of the cache
        this.lastUpdated = new Date(); // Tracks the last time the cache was updated
    }

    // Create a new cache entry
    create(key, value) {
        if (this.cache.has(key)) {
            // Consider returning a boolean instead of throwing an error for smoother usage
            throw new Error(`Key ${key} already exists in cache ${this.cacheName}`);
        }
        
        this.cache.set(key, {
            value,
            createdAt: new Date(), // Records when the entry was created
            lastAccessed: new Date(), // Tracks when the entry was last accessed
            accessCount: 0 // Tracks how many times the entry has been accessed
        });
        
        this.lastUpdated = new Date(); // Updates the lastUpdated timestamp for the cache
        return true;
    }

    // Retrieve a value from cache
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null; // Explicitly returning null to indicate a missing entry
        }

        // Update access metadata
        entry.lastAccessed = new Date(); // Refresh last accessed time
        entry.accessCount++; // Increment access counter
        
        return entry.value; // Return the value of the entry
    }

    // Update an existing cache entry
    update(key, value) {
        if (!this.cache.has(key)) {
            // Consider a more descriptive error message for debugging
            throw new Error(`Key ${key} does not exist in cache ${this.cacheName}`);
        }

        const existingEntry = this.cache.get(key);
        this.cache.set(key, {
            ...existingEntry, // Retain metadata from the existing entry
            value, // Update the value
            lastAccessed: new Date(), // Refresh last accessed time
            accessCount: existingEntry.accessCount // Preserve access count
        });

        this.lastUpdated = new Date(); // Update the lastUpdated timestamp for the cache
        return true;
    }

    // Delete a specific cache entry
    delete(key) {
        if (!this.cache.has(key)) {
            return false; // Return false if the entry does not exist
        }
        
        const success = this.cache.delete(key); // Delete the entry from the cache
        if (success) {
            this.lastUpdated = new Date(); // Update the lastUpdated timestamp if deletion succeeded
        }
        return success;
    }

    // Clear all entries from cache
    clear() {
        this.cache.clear(); // Removes all entries from the cache
        this.lastUpdated = new Date(); // Update the lastUpdated timestamp
        return true;
    }

    // Enhanced mass delete with multiple deletion patterns
    massDelete(start, end = null) {
        const entries = Array.from(this.cache.entries())
            .sort((a, b) => a[1].createdAt - b[1].createdAt); // Sort entries by creation time
        
        if (entries.length === 0) {
            return false; // Return false if the cache is empty
        }

        // Case 1: Delete range from start to end index
        if (end !== null) {
            // Validate range
            if (start < 1 || end > entries.length || start > end) {
                // Consider using a custom error class for better error handling
                throw new Error(`Invalid range: ${start} to ${end}`);
            }
            
            // Convert to 0-based index
            const startIndex = start - 1;
            const count = end - start + 1;
            
            // Delete entries in range
            entries.slice(startIndex, startIndex + count)
                .forEach(([key]) => this.cache.delete(key));
        }
        // Case 2: Delete oldest or newest N entries
        else {
            const count = Math.abs(start); // Calculate the number of entries to delete
            if (count > entries.length) {
                throw new Error(`Count ${count} exceeds cache size ${entries.length}`);
            }

            if (start > 0) {
                // Delete oldest N entries
                entries.slice(0, count)
                    .forEach(([key]) => this.cache.delete(key));
            } else {
                // Delete newest N entries
                entries.slice(-count)
                    .forEach(([key]) => this.cache.delete(key));
            }
        }

        this.lastUpdated = new Date(); // Update the lastUpdated timestamp
        return true;
    }

    // Utility methods

    // Returns the current size of the cache
    size() {
        return this.cache.size;
    }

    // Checks if a key exists in the cache
    has(key) {
        return this.cache.has(key);
    }

    // Retrieves metadata for a specific cache entry
    getMetadata(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null; // Explicitly return null if the entry does not exist
        }

        return {
            createdAt: entry.createdAt, // When the entry was created
            lastAccessed: entry.lastAccessed, // When the entry was last accessed
            accessCount: entry.accessCount // How many times the entry has been accessed
        };
    }

    // Returns all keys in the cache
    getAllKeys() {
        return Array.from(this.cache.keys());
    }

    // Retrieves statistics about the cache
    getCacheStats() {
        return {
            name: this.cacheName, // Name of the cache
            size: this.cache.size, // Current size of the cache
            createdAt: this.createdAt, // When the cache was created
            lastUpdated: this.lastUpdated // Last time the cache was updated
        };
    }
}

export default BaseCache;
