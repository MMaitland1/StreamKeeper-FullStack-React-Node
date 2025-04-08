/**
 * SearchValidation.js
 * 
 * Comprehensive search term validation and sanitization utilities
 * 
 * Features:
 * - Input validation (length, content, format)
 * - Security protection (SQL injection, XSS prevention)
 * - Term sanitization
 * - Consistent error messaging
 * 
 * Functions:
 * 1. validateSearchQuery - Core validation logic
 * 2. sanitizeSearchTerm - Input sanitization
 * 3. processSearchTerm - Combined validation and sanitization
 */

/**
 * Validates a search query against multiple criteria
 * @param {string} searchTerm - The raw search input
 * @returns {Object} Validation result with:
 *   - isValid: boolean
 *   - error: string|null (error message if invalid)
 * 
 * Validation Rules:
 * 1. Non-empty check
 * 2. Minimum length (2 chars)
 * 3. Maximum length (100 chars)
 * 4. SQL injection patterns
 * 5. XSS attack patterns
 * 6. Not only special characters
 */
export const validateSearchQuery = (searchTerm) => {
  // Empty input check
  if (!searchTerm || !searchTerm.trim()) {
    return {
      isValid: false,
      error: 'Search term cannot be empty'
    };
  }

  // Minimum length check
  if (searchTerm.trim().length < 2) {
    return {
      isValid: false,
      error: 'Search term must be at least 2 characters'
    };
  }

  // Maximum length check
  if (searchTerm.length > 100) {
    return {
      isValid: false,
      error: 'Search term is too long'
    };
  }

  // SQL injection pattern detection
  // Matches: quotes, comments, semicolons, and common SQL commands
  const sqlInjectionPattern = /('|--|;|DROP|DELETE|INSERT|UPDATE|SELECT)\s/i;
  if (sqlInjectionPattern.test(searchTerm)) {
    return {
      isValid: false,
      error: 'Invalid characters detected'
    };
  }

  // XSS attack pattern detection
  // Matches: HTML tags, javascript/data URIs, event handlers, etc.
  const xssPattern = /<[^>]*>|javascript:|data:|vbscript:|on\w+\s*=|style\s*=|href\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(/i;
  if (xssPattern.test(searchTerm)) {
    return {
      isValid: false,
      error: 'Invalid characters detected'
    };
  }

  // Requires at least one alphanumeric character
  // Prevents searches with only special characters
  const onlySpecialChars = /^[^a-zA-Z0-9]+$/;
  if (onlySpecialChars.test(searchTerm.trim())) {
    return {
      isValid: false,
      error: 'Search must contain at least one letter or number'
    };
  }

  // All validation passed
  return {
    isValid: true,
    error: null
  };
};

/**
 * Sanitizes a search term by:
 * 1. Trimming whitespace
 * 2. Removing HTML angle brackets
 * 3. Limiting to 100 characters
 * @param {string} searchTerm - The raw search input
 * @returns {string} Sanitized search term
 */
export const sanitizeSearchTerm = (searchTerm) => {
  return searchTerm
    .trim() // Remove leading/trailing whitespace
    .replace(/[<>]/g, '') // Remove HTML angle brackets
    .substring(0, 100); // Enforce maximum length
};

/**
 * Processes a search term through complete validation and sanitization pipeline
 * @param {string} searchTerm - The raw search input
 * @returns {Object} Processing result with:
 *   - isValid: boolean
 *   - error: string|null
 *   - sanitizedTerm: string|null (only when valid)
 */
export const processSearchTerm = (searchTerm) => {
  // First validate the input
  const validation = validateSearchQuery(searchTerm);
  
  // Return early if validation fails
  if (!validation.isValid) {
    return {
      ...validation,
      sanitizedTerm: null
    };
  }

  // Return sanitized version if valid
  return {
    isValid: true,
    error: null,
    sanitizedTerm: sanitizeSearchTerm(searchTerm)
  };
};