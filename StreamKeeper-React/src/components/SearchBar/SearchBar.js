/**
 * SearchBar.js
 * 
 * A controlled search input component with advanced features:
 * - Real-time search validation
 * - Dynamic placeholder text
 * - Keyboard shortcut support (Tab/Space autofill)
 * - Error handling and display
 * - Search term sanitization
 * - Programmatic navigation
 * 
 * Component Structure:
 * - SearchBarWrapper (styled container)
 *   - StyledTextField (customized Material-UI TextField)
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchBarWrapper, StyledTextField } from './SearchBar.styled';
import { useNavigate } from 'react-router-dom';
import { processSearchTerm } from '../SearchValidation/SearchValidation';

/**
 * SearchBar Component
 * @param {Object} [props.currentMovie] - Optional current movie object to enable title autofill
 */
function SearchBar({ currentMovie }) {
  // Component State
  const [searchText, setSearchText] = useState(''); // Current search input value
  const [searchError, setSearchError] = useState(''); // Validation error message
  const navigate = useNavigate(); // Navigation hook for search routing

  /**
   * Handles text input changes
   * @param {Object} e - React synthetic event
   */
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setSearchError(''); // Clear any existing errors on new input
  };

  /**
   * Handles Enter key press to initiate search
   * Validates and sanitizes input before navigation
   * @param {Object} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      const { isValid, error, sanitizedTerm } = processSearchTerm(searchText);
      
      if (isValid) {
        // Navigate to search results page with encoded term
        navigate(`/search/${encodeURIComponent(sanitizedTerm)}`);
      } else {
        setSearchError(error); // Display validation error
      }
    }
  };

  /**
   * Handles Tab key press for title autofill
   * @param {Object} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const placeholder = currentMovie ? currentMovie.title : '';
      if (searchText.trim() === '') {
        setSearchText(placeholder); // Autofill current movie title
      }
      e.preventDefault(); // Prevent default tab behavior
    }
  };

  /**
   * Handles Space key press for title autofill
   * @param {Object} e - Keyboard event
   */
  const handleSpaceClick = (e) => {
    if (e.key === ' ' && searchText.trim() === '') {
      const placeholder = currentMovie ? currentMovie.title : '';
      setSearchText(placeholder); // Autofill current movie title
      e.preventDefault(); // Prevent space input
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
        // Dynamic placeholder based on currentMovie prop
        placeholder={currentMovie ? `"${currentMovie.title}"...` : 'Search for media...'}
        error={!!searchError} // Toggle error state
        helperText={searchError} // Display validation message
        // Accessibility attributes
        aria-label="Search media"
        inputProps={{
          'aria-describedby': searchError ? 'search-error-text' : undefined,
        }}
      />
    </SearchBarWrapper>
  );
}

// Prop type validation
SearchBar.propTypes = {
  /**
   * Current movie object (optional)
   * Used for search autofill functionality
   */
  currentMovie: PropTypes.shape({
    title: PropTypes.string
  })
};

export default SearchBar;