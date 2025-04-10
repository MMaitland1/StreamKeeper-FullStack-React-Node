import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainService from '../../services/MainService';
import PrefetchService from '../../services/PrefetchService';

const prefetchService = PrefetchService; 

/**
 * DisplayCardA Component
 * A reusable card component to display media-related information (Movies, TV Shows, and People).
 * 
 * Features:
 * - Fetches additional images for people if media type is 'Person'.
 * - Provides a hover effect and navigation to detailed media pages.
 * - Shows ratings and brief descriptions.
 * - Supports dynamic width and height adjustments.
 *
 * @param {Object} media - Media object containing details like title, type, images, and rating.
 * @param {number} [minWidth=275] - Minimum width of the card.
 * @param {number} [maxWidth] - Maximum width of the card.
 * @param {number} [minHeight=300] - Minimum height of the card.
 * @param {number} [maxHeight] - Maximum height of the card.
 * @param {number} [fixedWidth] - Fixed width if defined.
 * @param {number} [fixedHeight] - Fixed height if defined.
 * @param {Function} [onClick] - Custom click event handler.
 * @param {boolean} [disableClick=false] - Disables click functionality when set to true.
 */
function DisplayCardA({
  media,
  minWidth = 275,
  maxWidth,
  minHeight = 300,
  maxHeight,
  fixedWidth,
  fixedHeight,
  onClick,
  disableClick = false,
}) {
  const navigate = useNavigate();
  const [personImages, setPersonImages] = useState(null);

  /**
   * Fetch additional images if the media type is 'Person'.
   * This retrieves profile pictures from the TMDB API.
   */
  useEffect(() => {
    if (media.mediaType === 'Person') {
      const fetchPersonImages = async () => {
        try {
          const imagesData = await MainService.getPersonImages(media.id);
          setPersonImages(
            imagesData.profiles?.length
              ? `https://image.tmdb.org/t/p/w500${imagesData.profiles[0].file_path}`
              : null
          );
        } catch (error) {
          console.error('Error fetching person images:', error);
        }
      };
      fetchPersonImages();
    }
  }, [media]);

  /**
   * Handles click events on the card.
   * If a custom click handler is provided, it will be executed.
   * Otherwise, it navigates to the corresponding media details page.
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
        case 'TVShow':
          navigate(`/tvshow/${media.id}`);
          break;
        case 'Person':
          navigate(`/person/${media.id}`);
          break;
        default:
          navigate('/');
          console.log('Unhandled media type:', media.mediaType);
      }
    }
  };

  /**
   * Handles hover events for prefetching media data.
   * Prefetching improves user experience by loading details in advance.
   */
  const handleMouseEnter = () => {
    if (['Movie', 'TvShow', 'Person'].includes(media.mediaType)) {
      prefetchService.executePrefetch(media.mediaType, media.mediaType, media.id);
    }
  };

  /**
   * Extracts and formats media details such as title, description, and images.
   */
  const {
    mediaType = 'Media Type',
    name = media.title || media.name || 'Unnamed',
    description =
      media.mediaType === 'Person'
        ? media.knownForDepartment || 'No information available.'
        : media.overview
        ? media.overview.length > 70
          ? `${media.overview.slice(0, 70)}...`
          : media.overview
        : 'No description available.',
    rating = media.voteAverage || 0,
    backgroundUrl =
      media.mediaType === 'Person' ? personImages : media.posterUrl || media.backdropUrl || '',
  } = media;

  /**
   * Constructs the "Known For" section for people.
   */
  const knownFor =
    media.mediaType === 'Person' && media.knownFor
      ? media.knownFor.slice(0, 2).map(item => item.name || item.title).join(', ')
      : '';

  /**
   * Styling object for the card container.
   * Uses background images, hover effects, and dynamic dimensions.
   */
  const cardStyles = {
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    minHeight: fixedHeight || minHeight,
    maxHeight: fixedHeight || maxHeight,
    minWidth: fixedWidth || minWidth,
    maxWidth: fixedWidth || maxWidth,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    justifyContent: 'space-between',
    position: 'relative',
    cursor: disableClick ? 'default' : 'pointer',
    transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    '&:hover': {
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.7)',
      transform: 'scale(0.95)',
    },
  };

  return (
    <Box sx={cardStyles} onClick={handleCardClick} onMouseEnter={handleMouseEnter}>
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
          borderRadius: 2,
        }}
      />
      <Card
        variant="outlined"
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          flexGrow: fixedWidth || fixedHeight ? 0 : 1,
          color: 'white',
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Typography gutterBottom sx={{ color: 'white', fontSize: 14 }}>
            {mediaType}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {typeof name === 'string' ? name : 'Unnamed'}
          </Typography>
          {media.mediaType === 'Person' && (
            <Typography sx={{ color: 'white', mb: 1.5 }}>
              Department
            </Typography>
          )}
          <Typography variant="body2">{description}</Typography>
          {media.mediaType === 'Person' && knownFor && (
            <Typography sx={{ color: 'white', mt: 1 }}>Known For: {knownFor}</Typography>
          )}
        </CardContent>
      </Card>
      {/* Rating section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          py: 1,
          px: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Rating value={rating / 2} precision={0.5} readOnly />
      </Box>
    </Box>
  );
}

DisplayCardA.propTypes = {
  media: PropTypes.shape({
    mediaType: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    overview: PropTypes.string,
    voteAverage: PropTypes.number,
    posterUrl: PropTypes.string,
    backdropUrl: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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

export default DisplayCardA;
