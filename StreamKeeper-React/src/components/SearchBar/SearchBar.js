// SearchBar.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchBarWrapper, StyledTextField } from './SearchBar.styled';
import { useNavigate } from 'react-router-dom';
import { processSearchTerm } from '../SearchValidation/SearchValidation';

function SearchBar({ currentMovie }) {
  const [searchText, setSearchText] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
    setSearchError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchText.trim()) {
      const { isValid, error, sanitizedTerm } = processSearchTerm(searchText);
      
      if (isValid) {
        navigate(`/search/${encodeURIComponent(sanitizedTerm)}`);
      } else {
        setSearchError(error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const placeholder = currentMovie ? currentMovie.title : '';
      if (searchText.trim() === '') {
        setSearchText(placeholder);
      }
      e.preventDefault();
    }
  };

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

SearchBar.propTypes = {
  currentMovie: PropTypes.object
};

export default SearchBar;