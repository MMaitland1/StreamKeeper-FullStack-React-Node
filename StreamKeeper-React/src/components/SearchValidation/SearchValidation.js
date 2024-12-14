/**
 * SearchValidation Component
 * A higher-order component that provides comprehensive search input validation
 * Including protection against SQL injection, XSS attacks, and input validation
 * Wraps child components with validation functionality and error handling
 */

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props - Component props
 * @param {Function} props.onInvalidSearch - Callback function for invalid search attempts
 * @param {React.ReactNode} props.children - Child components to wrap with validation
 * @returns {React.ReactNode} Wrapped children with validation capabilities
 */
const SearchValidation = ({ onInvalidSearch, children }) => {
  // State for tracking validation error messages
  const [error, setError] = useState('');

  /**
   * Validates search input against multiple security and usability criteria
   * @param {string} searchTerm - The search term to validate
   * @returns {boolean} Whether the search term is valid
   */
  const validateSearch = useCallback((searchTerm) => {
    // Clear any existing error messages
    setError('');

    /**
     * Empty Input Validation
     * Prevents empty or whitespace-only searches
     */
    if (!searchTerm || !searchTerm.trim()) {
      setError('Search term cannot be empty');
      return false;
    }

    /**
     * Length Validations
     * Ensures search term is within acceptable length bounds
     * - Minimum 2 characters for meaningful searches
     * - Maximum 100 characters to prevent excessive input
     */
    if (searchTerm.trim().length < 2) {
      setError('Search term must be at least 2 characters');
      return false;
    }

    if (searchTerm.length > 100) {
      setError('Search term is too long');
      return false;
    }

    /**
     * SQL Injection Protection
     * Checks for common SQL injection patterns including:
     * - SQL quotes
     * - Comment markers
     * - Common SQL commands (DROP, DELETE, etc.)
     */
    const sqlInjectionPattern = /('|--|;|DROP|DELETE|INSERT|UPDATE|SELECT)\s/i;
    if (sqlInjectionPattern.test(searchTerm)) {
      setError('Invalid characters detected');
      return false;
    }

    /**
     * XSS Attack Protection
     * Validates against common XSS attack vectors including:
     * - HTML tags
     * - JavaScript protocol handlers
     * - Event handlers
     * - Inline styles
     * - JavaScript functions
     */
    const xssPattern = /<[^>]*>|javascript:|data:|vbscript:|on\w+\s*=|style\s*=|href\s*=|alert\s*\(|confirm\s*\(|prompt\s*\(/i;
    if (xssPattern.test(searchTerm)) {
      setError('Invalid characters detected');
      return false;
    }

    /**
     * Content Quality Validation
     * Ensures search term contains at least one alphanumeric character
     * Prevents searches with only special characters
     */
    const onlySpecialChars = /^[^a-zA-Z0-9]+$/;
    if (onlySpecialChars.test(searchTerm.trim())) {
      setError('Search must contain at least one letter or number');
      return false;
    }

    return true;
  }, []);

  /**
   * Child Component Enhancement
   * Clones and enhances child components with validation functionality
   * Injects validateSearch function, error state, and invalid search callback
   */
  const wrappedChildren = React.Children.map(children, child => {
    return React.cloneElement(child, {
      validateSearch: validateSearch,
      searchError: error,
      onInvalidSearch: onInvalidSearch
    });
  });

  return <>{wrappedChildren}</>;
};

/**
 * PropTypes Definition
 * onInvalidSearch: Optional callback for invalid search handling
 * children: Required child components to enhance with validation
 */
SearchValidation.propTypes = {
  onInvalidSearch: PropTypes.func,
  children: PropTypes.node.isRequired
};

export default SearchValidation;