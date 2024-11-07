// src/pages/InfoDisplayPage.js
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Container, Grid } from '@mui/material';
import DisplayCardB from '../components/DisplayCardB/DisplayCardB'; // Import DisplayCardB component for displaying media items

function InfoDisplayPage() {
  const { topic } = useParams(); // Get the topic from the URL parameter using React Router
  const location = useLocation(); // Access the current location to retrieve state passed through navigation
  const { mediaArray = [] } = location.state || {}; // Destructure state to get mediaArray, provide a default empty array

  return (
    <Container sx={{ p: 2 }}> {/* Container for consistent padding */}
      <Typography variant="h4" gutterBottom>
        {topic} {/* Display the topic as the main heading */}
      </Typography>
      {mediaArray.length > 0 ? (
        <Grid container spacing={3}> {/* Display items in a responsive grid */}
          {mediaArray.map((media, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}> {/* Configure responsive grid sizes */}
              <DisplayCardB
                media={media} // Pass media data to DisplayCardB component
                minWidth={275} // Set minimum width for each card
                maxWidth={400} // Set maximum width for each card
                minHeight={500} // Set minimum height for each card
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Fallback text if no items are available
        <Typography variant="body1" color="text.secondary">
          No items available.
        </Typography>
      )}
    </Container>
  );
}

InfoDisplayPage.propTypes = {
  mediaArray: PropTypes.array, // Prop type validation for mediaArray
};

export default InfoDisplayPage;
