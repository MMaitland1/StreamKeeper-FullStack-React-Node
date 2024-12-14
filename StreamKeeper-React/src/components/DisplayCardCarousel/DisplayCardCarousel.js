/**
 * DisplayCardCarousel.js
 * A responsive, customizable carousel component for displaying media cards
 * Features include:
 * - Dynamic card sizing and spacing
 * - Mobile responsiveness
 * - Smooth scrolling navigation
 * - Support for multiple card types
 * - Custom width and height configurations
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import DisplayCardA from '../DisplayCardA/DisplayCardA';
import DisplayCardB from '../DisplayCardB/DisplayCardB';

/**
 * DisplayCardCarousel Component
 * @param {Object[]} items - Array of media items or React elements to display
 * @param {number} initialCarouselWidth - Starting width of carousel (default: 800)
 * @param {number} carouselHeight - Height of carousel (default: 400)
 * @param {number} displayLimit - Maximum number of cards to show (default: 4)
 * @param {boolean} showArrows - Whether to show navigation arrows (default: true)
 * @param {('A'|'B')} cardType - Type of display card to use
 */
function DisplayCardCarousel({
  items,
  initialCarouselWidth = 800,
  carouselHeight = 400,
  displayLimit = 4,
  showArrows = true,
  cardType = 'A',
}) {
  // Refs and State
  const scrollContainerRef = useRef(null);
  const [carouselWidth, setCarouselWidth] = useState(initialCarouselWidth);
  
  // Responsive layout detection
  const isMobile = useMediaQuery('(max-width:720px)');

  /**
   * Card Dimension Calculations
   * Determines card sizes based on device type and available space
   */
  const sampleCard = items[0] instanceof Object ? items[0] : {};
  const defaultCardWidth = 275;
  const mobileCardWidth = Math.min(window.innerWidth - 40, defaultCardWidth);
  const cardWidth = isMobile ? mobileCardWidth : (sampleCard.fixedWidth || sampleCard.minWidth || defaultCardWidth);
  const cardHeight = sampleCard.fixedHeight || sampleCard.minHeight || carouselHeight;
  const gap = isMobile ? 10 : 20;
  const arrowSpace = 120; // Space for navigation arrows

  /**
   * Carousel Configuration
   * Calculates scroll behavior and card display limits
   */
  const scrollAmount = cardWidth + gap;
  const maxCards = isMobile ? 1 : Math.floor((window.innerWidth - arrowSpace) / (cardWidth + gap));
  const cardsDisplayed = isMobile ? 1 : Math.min(displayLimit, maxCards);

  /**
   * Window Resize Handler
   * Adjusts carousel width based on viewport changes
   */
  useEffect(() => {
    const handleResize = () => {
      const newWidth = isMobile 
        ? window.innerWidth - 40  // Mobile width with padding
        : window.innerWidth * 0.8; // Desktop width at 80% of viewport
      setCarouselWidth(newWidth);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  /**
   * Navigation Handlers
   * Manages smooth scrolling between cards
   */
  const handlePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  /**
   * Dimension Validation
   * Displays error message if carousel dimensions are invalid
   */
  if (initialCarouselWidth < scrollAmount) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '100%',
          height: carouselHeight,
        }}
      >
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          Carousel dimensions mismatch!
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Initial carousel width ({initialCarouselWidth}px) is less than the required scroll amount ({scrollAmount}px).
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Card dimensions: {cardWidth}px (width) x {cardHeight}px (height)
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        verticalAlign: 'top',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '0 auto',
        maxWidth: isMobile ? '100%' : 'none',
        padding: isMobile ? '0' : 0,
      }}
    >
      {/* Carousel Container */}
      <Box
        sx={{
          width: isMobile ? '100%' : cardWidth * cardsDisplayed + gap * (cardsDisplayed - 1),
          height: cardHeight + 100,
          position: 'relative',
          margin: '0 auto',
        }}
      >
        {/* Previous Button */}
        {showArrows && !isMobile && (
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: '-60px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 9,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ArrowBackIos fontSize="medium" />
          </IconButton>
        )}

        {/* Scrollable Card Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            transform: isMobile ? 'none' : 'translateY(-12%)',
            alignItems: 'center',
            display: 'flex',
            gap: `${gap}px`,
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            width: '100%',
            height: '100%',
            padding: isMobile ? '0' : '10px 0',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {/* Card Rendering */}
          {items.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                minWidth: cardWidth,
                maxWidth: cardWidth,
                height: cardHeight,
                scrollSnapAlign: 'start',
                alignItems: 'center',
                margin: isMobile ? '0 auto' : '0',
              }}
            >
              {React.isValidElement(item) ? (
                item
              ) : (
                cardType === 'A' ? (
                  <DisplayCardA media={item} fixedWidth={cardWidth} fixedHeight={cardHeight} />
                ) : (
                  <DisplayCardB media={item} fixedWidth={cardWidth} fixedHeight={cardHeight} />
                )
              )}
            </Box>
          ))}
        </Box>

        {/* Next Button */}
        {showArrows && !isMobile && (
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: '-60px',
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 9,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              borderRadius: '50%',
              padding: '10px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            <ArrowForwardIos fontSize="medium" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

/**
 * PropTypes Definition
 * Defines expected props and their types for component validation
 */
DisplayCardCarousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        mediaType: PropTypes.string,
        title: PropTypes.string,
        overview: PropTypes.string,
        voteAverage: PropTypes.number,
        posterUrl: PropTypes.string,
        backdropUrl: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
      PropTypes.element,
    ])
  ).isRequired,
  initialCarouselWidth: PropTypes.number,
  carouselHeight: PropTypes.number,
  displayLimit: PropTypes.number,
  showArrows: PropTypes.bool,
  cardType: PropTypes.oneOf(['A', 'B']),
};

export default DisplayCardCarousel;