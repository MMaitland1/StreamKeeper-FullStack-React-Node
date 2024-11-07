// src/components/SearchBar.js

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { SearchBarWrapper, StyledTextField } from './SearchBar.styled'; // Styled components for search bar
import { useNavigate } from 'react-router-dom';

function SearchBar({ currentMovie }) {
  const [searchText, setSearchText] = useState(''); // State to manage the search input text
  const navigate = useNavigate(); // Hook for navigation

  // Handle changes to the search input field
  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  // Handle Enter key press to initiate a search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      navigate(`/search/${encodeURIComponent(searchText.trim())}`); // Navigate to search results page
    }
  };

  // Handle Tab key press to autofill with placeholder text
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const placeholder = currentMovie ? currentMovie.title : ''; // Use current movie title as placeholder if available
      if (searchText.trim() === '') {
        setSearchText(placeholder);
      }
      // Prevent default Tab behavior to avoid changing focus
      e.preventDefault();
    }
  };

  // Handle Space key press for autofill when input is empty
  const handleSpaceClick = (e) => {
    if (e.key === ' ' && searchText.trim() === '') {
      const placeholder = currentMovie ? currentMovie.title : ''; // Use current movie title as placeholder if available
      setSearchText(placeholder);
      // Prevent default space behavior when placeholder is still visible
      e.preventDefault();
    }
  };

  return (
    <SearchBarWrapper>
      <StyledTextField
        variant="outlined"
        value={searchText}
        onChange={handleSearchInput} // Update search text on change
        onKeyPress={handleKeyPress} // Trigger search on Enter key press
        onKeyDown={(e) => {
          handleKeyDown(e); // Handle Tab key press
          handleSpaceClick(e); // Handle Space key press
        }}
        placeholder={currentMovie ? `"${currentMovie.title}"...` : 'Search for media ...'} // Dynamic placeholder text
      />
    </SearchBarWrapper>
  );
}

SearchBar.propTypes = {
  currentMovie: PropTypes.object, // Optional prop for setting dynamic placeholder based on current movie
};

export default SearchBar;
