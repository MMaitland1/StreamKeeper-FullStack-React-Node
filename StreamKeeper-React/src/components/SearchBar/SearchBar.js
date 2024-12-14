/**
 * SearchBar.js
 * A responsive search component with advanced keyboard interaction features
 * Includes input validation, sanitization, and dynamic placeholder text
 * Integrates with Material-UI and React Router for navigation
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { SearchBarWrapper, StyledTextField } from './SearchBar.styled';
import { useNavigate } from 'react-router-dom';

/**
 * SearchBar Component
 * @param {Object} props - Component properties
 * @param {Object} props.currentMovie - Currently featured movie for placeholder text
 * @param {Function} props.validateSearch - Search validation function from parent
 * @param {string} props.searchError - Error message from validation
 * @param {Function} props.onInvalidSearch - Callback for invalid search attempts
 */
function SearchBar({ currentMovie, validateSearch, searchError, onInvalidSearch }) {
  // State for managing search input text
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  /**
   * Input Change Handler
   * Updates search text state with user input
   * @param {Object} e - Input change event
   */
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  /**
   * Search Submission Handler
   * Validates input and navigates to search results
   * Includes input sanitization for security
   * @param {Object} e - Keypress event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      if (validateSearch && validateSearch(searchText)) {
        // Sanitize search term by removing angle brackets and limiting length
        const sanitizedTerm = searchText.trim()
          .replace(/[<>]/g, '')  // Remove potential HTML/XML tags
          .substring(0, 100);    // Limit length for URL safety
        navigate(`/search/${encodeURIComponent(sanitizedTerm)}`);
      } else if (onInvalidSearch) {
        onInvalidSearch(searchText);
      }
    }
  };

  /**
   * Tab Key Handler
   * Auto-fills search with current movie title on Tab press
   * Only applies when search field is empty
   * @param {Object} e - Keydown event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const placeholder = currentMovie ? currentMovie.title : '';
      if (searchText.trim() === '') {
        setSearchText(placeholder);
      }
      e.preventDefault();
    }
  };

  /**
   * Spacebar Handler
   * Auto-fills search with current movie title on Space press
   * Only applies when search field is empty
   * @param {Object} e - Keydown event
   */
  const handleSpaceClick = (e) => {
    if (e.key === ' ' && searchText.trim() === '') {
      const placeholder = currentMovie ? currentMovie.title : '';
      setSearchText(placeholder);
      e.preventDefault();
    }
  };

  return (
    <SearchBarWrapper>
      <StyledTextField
        variant="outlined"
        value={searchText}
        onChange={handleSearchInput}
        onKeyPress={handleKeyPress}
        onKeyDown={(e) => {
          handleKeyDown(e);
          handleSpaceClick(e);
        }}
        placeholder={currentMovie ? `"${currentMovie.title}"...` : 'Search for media...'}
        error={!!searchError}
        helperText={searchError}
      />
    </SearchBarWrapper>
  );
}

/**
 * PropTypes Definition
 * currentMovie: Optional movie object for placeholder text
 * validateSearch: Optional validation function
 * searchError: Optional error message string
 * onInvalidSearch: Optional callback for invalid searches
 */
SearchBar.propTypes = {
  currentMovie: PropTypes.object,
  validateSearch: PropTypes.func,
  searchError: PropTypes.string,
  onInvalidSearch: PropTypes.func
};

export default SearchBar;