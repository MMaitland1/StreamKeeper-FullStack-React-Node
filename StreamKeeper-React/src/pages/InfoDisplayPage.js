import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import DisplayCardB from '../components/DisplayCardB/DisplayCardB';

/**
 * InfoDisplayPage - A responsive page component for displaying a collection of media items
 * 
 * Key Features:
 * - Uses React Router for dynamic routing and parameter extraction
 * - Implements responsive design using Material-UI's useMediaQuery
 * - Dynamically renders media items in a grid layout
 * - Adapts layout and styling based on screen size (mobile vs desktop)
 */
function InfoDisplayPage() {
  // Extract topic from URL parameters
  const { topic } = useParams();

  // Access location state to retrieve media array
  const location = useLocation();
  const { mediaArray = [] } = location.state || {};

  // Use Material-UI theming and media query hooks for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:650px)');

  // Responsive styles object with conditional styling based on screen size
  const mobileStyles = {
    // Container styles: adjust layout and padding for mobile/desktop
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: isMobile ? '16px 8px' : '16px',
    },
    // Title styles: adjust text alignment, size, and spacing
    title: {
      textAlign: isMobile ? 'center' : 'left',
      width: '100%',
      fontSize: isMobile ? '1.9rem' : '2.125rem',
      marginBottom: '2rem',
    },
    // Grid item styles: adjust width for different screen sizes
    gridItem: {
      width: isMobile ? '75%' : 'auto',
    },
    // Content container styles: add spacing and full width
    contentContainer: {
      marginTop: '1.5rem',
      width: '100%',
    },
  };

  return (
    <Container sx={mobileStyles.container}>
      {/* Page title displaying the topic */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={mobileStyles.title}
      >
        {topic}
      </Typography>

      {/* Content container with conditional rendering */}
      <div style={mobileStyles.contentContainer}>
        {mediaArray.length > 0 ? (
          // Grid layout for media items
          <Grid 
            container 
            spacing={3}
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'center' : 'flex-start'}
          >
            {/* Render each media item using DisplayCardB component */}
            {mediaArray.map((media, index) => (
              <Grid 
                item 
                xs={12}
                sm={isMobile ? 12 : 6}
                md={isMobile ? 12 : 4}
                lg={isMobile ? 12 : 3}
                key={index}
                sx={mobileStyles.gridItem}
              >
                <DisplayCardB
                  media={media}
                  minWidth={isMobile ? 'auto' : 275}
                  maxWidth={isMobile ? '100%' : 400}
                  minHeight={isMobile ? 'auto' : 500}
                  sx={{
                    width: isMobile ? '100%' : 'auto',
                    margin: '0 auto',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          // Fallback text when no media items are available
          <Typography 
            variant="body1" 
            color="text.secondary"
            textAlign={isMobile ? 'center' : 'left'}
          >
            No items available.
          </Typography>
        )}
      </div>
    </Container>
  );
}

// PropTypes for type checking and documentation
InfoDisplayPage.propTypes = {
  mediaArray: PropTypes.array,
};

export default InfoDisplayPage;