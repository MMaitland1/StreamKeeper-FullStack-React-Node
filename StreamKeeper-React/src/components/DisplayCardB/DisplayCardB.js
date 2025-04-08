import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Rating, Box, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService';

/**
 * DisplayCardB Component
 * A versatile card component for displaying media (movies, TV shows, persons) with hover effects
 * Features:
 * - Dynamic content based on media type
 * - Person image fetching
 * - Prefetching on hover
 * - Customizable dimensions
 * - Rating display for non-person media
 * - Click navigation to detail pages
 */
const prefetchService = PrefetchService; // Singleton PrefetchService instance

/**
 * @param {Object} props - Component props
 * @param {Object} props.media - Media object containing details to display
 * @param {number} [props.minWidth=275] - Minimum card width
 * @param {number|string} [props.maxWidth='100%'] - Maximum card width
 * @param {number} [props.minHeight=300] - Minimum card height
 * @param {number|string} [props.maxHeight='auto'] - Maximum card height
 * @param {number} [props.fixedWidth] - Fixed width override
 * @param {number} [props.fixedHeight] - Fixed height override
 * @param {Function} [props.onClick] - Custom click handler
 * @param {boolean} [props.disableClick=false] - Disable click behavior
 */
function DisplayCardB({
  media,
  minWidth = 275,
  maxWidth = '100%',
  minHeight = 300,
  maxHeight = 'auto',
  fixedWidth,
  fixedHeight,
  onClick,
  disableClick = false,
}) {
  const navigate = useNavigate();
  const [personImage, setPersonImage] = useState('');

  /**
   * Person Image Fetching Effect
   * Fetches additional images for Person type media
   * Only runs when media type is 'Person'
   */
  useEffect(() => {
    if (media.mediaType === 'Person') {
      const fetchPersonImage = async () => {
        try {
          const imagesData = await MainService.getPersonImages(media.id);
          setPersonImage(
            imagesData.profiles?.length
              ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
              : null
          );
        } catch (error) {
          console.error('Error fetching person image:', error);
        }
      };
      fetchPersonImage();
    }
  }, [media]);

  /**
   * Card Click Handler
   * Navigates to appropriate detail page based on media type
   * Respects disableClick prop and custom onClick handler
   */
  const handleCardClick = () => {
    if (disableClick) return;
    onClick?.();
    if (!onClick) {
      switch (media.mediaType) {
        case 'Movie':
          navigate(`/movie/${media.id}`);
          break;
        case 'TvShow':
          navigate(`/tvshow/${media.id}`);
          break;
        case 'Person':
          navigate(`/person/${media.id}`);
          break;
        default:
          navigate('/');
      }
    }
  };

  /**
   * Card Hover Handler
   * Triggers prefetching of additional data when hovering over card
   */
  const handleCardHover = () => {
    if (media.mediaType) {
      prefetchService.executePrefetch(media.mediaType, media.mediaType, media.id);
    }
  };

  // Extract media properties with fallbacks
  const {
    title = media.name || media.title || 'Unnamed',
    description = media.mediaType === 'Person'
      ? media.knownForDepartment || 'No information available.'
      : media.overview
        ? media.overview.length > 70
          ? `${media.overview.slice(0, 70)}...`
          : media.overview
        : 'No description available.',
    rating = media.voteAverage || 0,
    imageUrl = media.mediaType === 'Person' ? personImage : media.posterUrl || media.backdropUrl || '',
  } = media;

  // Format known for information for Person type
  const knownFor =
    media.mediaType === 'Person' && media.knownFor
      ? media.knownFor.slice(0, 2).map(item => item.name || item.title).join(', ')
      : '';

  // Card style configuration
  const cardStyles = {
    minWidth: fixedWidth || minWidth,
    maxWidth: fixedWidth || maxWidth,
    minHeight: fixedHeight || minHeight,
    maxHeight: fixedHeight || maxHeight,
    cursor: disableClick ? 'default' : 'pointer',
  };

  return (
    <Box
      onClick={handleCardClick}
      onMouseEnter={handleCardHover}
      sx={{
        minWidth: cardStyles.minWidth,
        maxWidth: cardStyles.maxWidth,
        cursor: cardStyles.cursor,
        flexGrow: 1,
        position: 'relative',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.25)', // Added drop shadow
        borderRadius: 1,
        '&:hover': {
          transform: disableClick ? 'none' : 'translate(-4px, -8px)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Added transition
          boxShadow: disableClick ? 'none' : '0px 12px 24px rgba(0, 0, 0, 0.4)', // Increased shadow on hover
          borderRadius: 3,
        },
      }}
    >
      <ButtonBase
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <Card
          sx={{
            minHeight: cardStyles.minHeight,
            maxHeight: cardStyles.maxHeight,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            width: '100%',
            borderRadius: 1,
          }}
        >
          {/* Media Image Section */}
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{ height: 300 }}
          />
          
          {/* Content Section */}
          <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pb: 1 }}>
            {/* Title */}
            <Typography variant="h6">{title}</Typography>
            
            {/* Description */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
            
            {/* Known For (Person type only) */}
            {media.mediaType === 'Person' && knownFor && (
              <Typography variant="body2" color="text.secondary">
                Known For: {knownFor}
              </Typography>
            )}
            
            {/* Spacer to push rating to bottom */}
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Rating Section (Non-person media only) */}
            {media.mediaType !== 'Person' && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                <Rating value={rating / 2} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {rating} ({media.voteCount || 0} votes)
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </ButtonBase>
    </Box>
  );
}

/**
 * Prop Type Validation
 * Defines the expected shape and types of all component props
 */
DisplayCardB.propTypes = {
  media: PropTypes.shape({
    mediaType: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
    voteCount: PropTypes.number,
    posterUrl: PropTypes.string,
    backdropUrl: PropTypes.string,
    knownFor: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    knownForDepartment: PropTypes.string,
  }).isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  fixedWidth: PropTypes.number,
  fixedHeight: PropTypes.number,
  onClick: PropTypes.func,
  disableClick: PropTypes.bool,
};

export default DisplayCardB;