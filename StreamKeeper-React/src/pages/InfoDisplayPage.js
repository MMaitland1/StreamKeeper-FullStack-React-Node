/**
 * InfoDisplayPage.js
 * 
 * A responsive page component for displaying categorized media collections.
 * 
 * Key Features:
 * - Dynamic routing with React Router
 * - Responsive grid layout adapting to all screen sizes
 * - Media card display with consistent styling
 * - Empty state handling
 * - Mobile-first design approach
 * 
 * Component Structure:
 * 1. Container (root layout)
 *   1.1 Title section
 *   1.2 Content container
 *     1.2.1 Grid layout (for media items)
 *     1.2.2 Empty state message
 */

import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography, Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import DisplayCardB from '../components/DisplayCardB/DisplayCardB';

function InfoDisplayPage() {
  /**
   * Router Hooks
   * - useParams: Extracts dynamic route parameters
   * - useLocation: Accesses navigation state
   */
  const { topic } = useParams(); // Gets the category topic from URL
  const location = useLocation();
  const { mediaArray = [] } = location.state || {}; // Retrieves media data from navigation state

  /**
   * Responsive Design Hooks
   * - useTheme: Access to Material-UI theme
   * - useMediaQuery: Detects mobile viewport (650px breakpoint)
   */
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:650px)');

  /**
   * Responsive Styles Object
   * Contains conditional styling based on viewport size
   * Organized by component section for maintainability
   */
  const responsiveStyles = {
    // Root container styles
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: isMobile ? '16px 8px' : '16px', // Tighter padding on mobile
    },
    
    // Title section styles
    title: {
      textAlign: isMobile ? 'center' : 'left',
      width: '100%',
      fontSize: isMobile ? '1.9rem' : '2.125rem', // Larger text on desktop
      marginBottom: '2rem',
      fontWeight: 500, // Medium weight for better readability
      color: theme.palette.text.primary, // Uses theme color
    },
    
    // Grid item styles
    gridItem: {
      width: isMobile ? '75%' : 'auto', // Constrained width on mobile
      transition: 'all 0.3s ease', // Smooth resizing animation
    },
    
    // Content container styles
    contentContainer: {
      marginTop: '1.5rem',
      width: '100%',
      minHeight: '50vh', // Ensures consistent spacing
    },
  };

  return (
    <Container 
      sx={responsiveStyles.container}
      maxWidth="xl" // Uses extra-large container width
    >
      {/* 
        Page Title Section
        Displays the category topic from route parameters 
      */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{...responsiveStyles.title, color: "white"}}
        component="h1" // Semantic HTML heading
      >
        {topic}
      </Typography>

      {/* 
        Main Content Container
        Conditionally renders either media grid or empty state
      */}
      <div style={responsiveStyles.contentContainer}>
        {mediaArray.length > 0 ? (
          /**
           * Media Items Grid
           * - Adapts layout based on screen size
           * - Mobile: Single column
           * - Tablet: 2 columns
           * - Desktop: 3-4 columns
           */
          <Grid 
            container 
            spacing={3} // Consistent gutter between items
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'center' : 'flex-start'}
            justifyContent={isMobile ? 'center' : 'flex-start'}
          >
            {/* 
              Media Item Mapping
              Renders each item using DisplayCardB component
              with responsive sizing
            */}
            {mediaArray.map((media, index) => (
              <Grid 
                item 
                xs={12}
                sm={isMobile ? 12 : 6}
                md={isMobile ? 12 : 4}
                lg={isMobile ? 12 : 3}
                key={`${media.id}-${index}`} // More unique key
                sx={responsiveStyles.gridItem}
              >
                <DisplayCardB
                  media={media}
                  minWidth={275}
                  maxWidth={400}
                  minHeight={500}
                  sx={{
                    width: isMobile ? '100%' : 'auto',
                    margin: '0 auto',
                    height: '100%', // Ensures consistent card heights
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          /**
           * Empty State
           * Shown when no media items are available
           */
          <Typography 
            variant="body1" 
            color="text.secondary"
            textAlign={isMobile ? 'center' : 'left'}
            sx={{
              padding: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            No items available in this category.
          </Typography>
        )}
      </div>
    </Container>
  );
}

/**
 * Prop Type Validation
 * Documents expected props and their types
 */
InfoDisplayPage.propTypes = {
  /**
   * Array of media objects to display
   * Retrieved from React Router location state
   */
  mediaArray: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      posterUrl: PropTypes.string,
      // Add other expected media properties as needed
    })
  ),
};

export default InfoDisplayPage;