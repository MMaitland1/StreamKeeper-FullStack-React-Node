// src/components/SearchBar.styled.js

import styled from 'styled-components';
import { TextField } from '@mui/material';

export const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledTextField = styled(TextField)`
  max-width: 600px;
  width: 100%;

  .MuiOutlinedInput-root {
    background-color: rgba(255, 255, 255, 0.9); // Soft white background
    border-radius: 20px;
    transition: box-shadow 0.3s ease; // Smooth transition for box-shadow

    &:hover fieldset {
      border-color: inherit; // Prevent border color change on hover
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); // Soft glow effect
    }

    &.Mui-focused fieldset {
      border-color: inherit; // Prevent blue border on focus
      box-shadow: none; // Disable box shadow on focus
    }
  }

  .MuiInputBase-input {
    padding-left: 4%; // Move text over to the right 10%
  }

  .MuiOutlinedInput-notchedOutline {
    border-radius: 20px;
    border-color: rgba(0, 0, 0, 0.2); // Slightly visible border color
  }
`;
