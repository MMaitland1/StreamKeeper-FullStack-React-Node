const PUBLIC_IP = '';  // Leave this blank for localhost, or set to 'stream-keeper.com' for production

export class BaseUrlService {
  getBaseUrl(port, endpoint = '') {
    const baseIP = PUBLIC_IP.trim() || 'localhost';
    const protocol = PUBLIC_IP.trim() ? 'https' : 'http';
    
    // For localhost, include the port
    if (baseIP === 'localhost') {
      if (!endpoint) {
        return `${protocol}://${baseIP}:${port}/api`;
      }
      return `${protocol}://${baseIP}:${port}/api/${endpoint}`;
    }
    
    // For production, exclude the port
    if (!endpoint) {
      return `${protocol}://${baseIP}/api`;
    }
    return `${protocol}://${baseIP}/api/${endpoint}`;
  }
}