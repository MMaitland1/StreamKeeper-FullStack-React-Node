
export const validateSearchQuery = (searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return {
      isValid: false,
      error: 'Search term cannot be empty'
    };
  }

  if (searchTerm.trim().length < 2) {
    return {
      isValid: false,
      error: 'Search term must be at least 2 characters'
    };
  }

  if (searchTerm.length > 100) {
    return {
      isValid: false,
      error: 'Search term is too long'
    };
  }

  const sqlInjectionPattern = /('|--|;|DROP|DELETE|INSERT|UPDATE|SELECT)\s/i;
  if (sqlInjectionPattern.test(searchTerm)) {
    return {
      isValid: false,
      error: 'Invalid characters detected'
    };
  }

  const xssPattern = /<[^>]*>|javascript:|data:|vbscript:|on\w+\s*=|style\s*=|href\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(/i;
  if (xssPattern.test(searchTerm)) {
    return {
      isValid: false,
      error: 'Invalid characters detected'
    };
  }

  const onlySpecialChars = /^[^a-zA-Z0-9]+$/;
  if (onlySpecialChars.test(searchTerm.trim())) {
    return {
      isValid: false,
      error: 'Search must contain at least one letter or number'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

export const sanitizeSearchTerm = (searchTerm) => {
  return searchTerm
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 100);
};

export const processSearchTerm = (searchTerm) => {
  const validation = validateSearchQuery(searchTerm);
  
  if (!validation.isValid) {
    return {
      ...validation,
      sanitizedTerm: null
    };
  }

  return {
    isValid: true,
    error: null,
    sanitizedTerm: sanitizeSearchTerm(searchTerm)
  };
};