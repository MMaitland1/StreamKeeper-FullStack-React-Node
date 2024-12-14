const PUBLIC_IP = '';  // Leave this blank, fill in when needed

export class BaseUrlService {
  getBaseUrl(port, endpoint = '') {
    const baseIP = PUBLIC_IP.trim() || 'localhost';
    
    if (!endpoint) {
      return `http://${baseIP}:${port}/api`;
    }
    
    return `http://${baseIP}:${port}/api/${endpoint}`;
  }
}