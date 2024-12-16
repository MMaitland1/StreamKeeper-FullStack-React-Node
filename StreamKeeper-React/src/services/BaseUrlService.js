const PUBLIC_IP = '';  // Leave this blank, fill in when needed

export class BaseUrlService {
  getBaseUrl(port, endpoint = '') {
    const baseIP = PUBLIC_IP.trim() || 'localhost';
    const protocol = PUBLIC_IP.trim() ? 'https' : 'http';
    
    if (!endpoint) {
      return `${protocol}://${baseIP}:${port}/api`;
    }
    
    return `${protocol}://${baseIP}:${port}/api/${endpoint}`;
  }
}