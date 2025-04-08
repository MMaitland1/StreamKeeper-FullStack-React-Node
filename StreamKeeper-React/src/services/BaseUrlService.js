/**
 * BaseUrlService.js
 * 
 * Service for constructing base URLs for API endpoints
 * 
 * Features:
 * - Handles both localhost and production environments
 * - Automatically determines protocol (http/https)
 * - Constructs proper URLs with or without endpoints
 */

// Public IP configuration - leave blank for localhost or set to production domain
const PUBLIC_IP = '';  // Leave this blank for localhost, or set to 'stream-keeper.com' for production

export class BaseUrlService {
  /**
   * Constructs the base URL for API requests
   * @param {number|string} port - The port number to use for localhost
   * @param {string} [endpoint=''] - Optional API endpoint path
   * @returns {string} The complete base URL
   */
  getBaseUrl(port, endpoint = '') {
    // Determine base IP (localhost or production)
    const baseIP = PUBLIC_IP.trim() || 'localhost';
    // Use https for production, http for localhost
    const protocol = PUBLIC_IP.trim() ? 'https' : 'http';
    
    // Handle localhost URLs (include port)
    if (baseIP === 'localhost') {
      if (!endpoint) {
        return `${protocol}://${baseIP}:${port}/api`;
      }
      return `${protocol}://${baseIP}:${port}/api/${endpoint}`;
    }
    
    // Handle production URLs (no port)
    if (!endpoint) {
      return `${protocol}://${baseIP}/api`;
    }
    return `${protocol}://${baseIP}/api/${endpoint}`;
  }
}