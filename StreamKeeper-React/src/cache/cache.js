class Cache {
  constructor(cacheName = 'DefaultCache', storageLocation = 'Memory') {
    // Initialize an empty Map to serve as the cache storage.
    this.cache = new Map();
    this.cacheName = cacheName; // Name of the cache for logging purposes
    this.storageLocation = storageLocation; // Location of cache (e.g., Memory, Disk, etc.)
  }

  // Generates a unique key based on the command and query object.
  generateKey(command, query) {
    // Convert all values in the query object to strings to ensure consistent key generation
    const stringifiedQuery = JSON.stringify(query, (key, value) =>
      typeof value === 'number' ? value.toString() : value
    );
    // Combines the command string with the stringified version of the query to create a unique key.
    return `${command}_${stringifiedQuery}`;
  }
  

  // Stores a value in the cache using a key generated from the command and query.
  set(command, query, value) {
    const key = this.generateKey(command, query);

    // Check if the key already exists in the cache.
    if (this.cache.has(key)) {
      // Log an error if the key exists.
      console.error(`Attempt to store a duplicate key.
        Currently logged: ${JSON.stringify(this.cache.get(key))}
        Trying to log: ${JSON.stringify(value)}`);
    } else {
      // Store the value in the cache under the generated key.
      this.cache.set(key, value);

    }
  }

  // Retrieves a value from the cache using a key generated from the command and query.
  get(command, query) {
    const key = this.generateKey(command, query);
    // Return the cached value associated with the generated key, or undefined if not found.
    return this.cache.get(key);
  }

  // Checks if a specific key, generated from the command and query, exists in the cache.
  has(command, query) {
    const key = this.generateKey(command, query);
    // Return true if the key exists in the cache, otherwise false.
    return this.cache.has(key);
  }

  // Clears all entries from the cache.
  clear() {
    this.cache.clear();
  }
}

export default Cache; // Export the Cache class as the default export of the module.
