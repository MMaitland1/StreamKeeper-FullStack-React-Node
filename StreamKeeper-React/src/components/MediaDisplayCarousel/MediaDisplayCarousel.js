// src/components/MediaDisplayCarousel/MediaDisplayCarousel.js

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import PrefetchService from '../../services/PrefetchService'; // Adjust the path as needed

// Styled component for smooth crossfade transitions between carousel items
const FadeBox = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '70vh',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  transition: 'opacity 1s ease-in-out',
});

function MediaDisplayCarousel({ mediaItems, autoPlay = true, interval = 5000, onItemChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // Utility function to format image URLs if needed
  const formatImageUrl = (url) => {
    const baseUrl = 'https://image.tmdb.org/t/p/original';
    return url && url.startsWith('http') ? url : `${baseUrl}${url}`;
  };

  useEffect(() => {
    if (autoPlay && mediaItems.length > 0) {
      timeoutRef.current = setInterval(() => {
        setPrevIndex(currentIndex);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
      }, interval);
      return () => clearInterval(timeoutRef.current);
    }
  }, [autoPlay, interval, mediaItems.length, currentIndex]);

  useEffect(() => {
    if (onItemChange && mediaItems[currentIndex]) {
      onItemChange(mediaItems[currentIndex]);
    }
  }, [currentIndex, mediaItems, onItemChange]);

  // Handle navigation based on the media type
  const handleNavigation = (media) => {
    if (media && media.mediaType) {
      switch (media.mediaType.toLowerCase()) {
        case 'movie':
          navigate(`/movie/${media.id}`);
          break;
        case 'tvshow':
          navigate(`/tvshow/${media.id}`);
          break;
        case 'person':
          navigate(`/person/${media.id}`);
          break;
        default:
          navigate('/');
      }
    }
  };

  // Prefetch data on hover using PrefetchService
  const handleHover = async (media) => {
    if (media) {
      try {
        await PrefetchService.executePrefetch(
          media.mediaType.charAt(0).toUpperCase() + media.mediaType.slice(1),
          media.mediaType,
          media.id
        );
      } catch (error) {
        console.error('Error prefetching data:', error);
      }
    }
  };

  // Render individual media item as a carousel slide
  const renderMediaItem = (media, isVisible) => {
    if (!media) return null;

    const {
      mediaType,
      title,
      name,
      overview,
      backdropUrl,
      posterUrl,
      releaseDate,
      firstAirDate,
      voteAverage,
    } = media;

    const displayTitle = title || name;
    const imageUrl = formatImageUrl(backdropUrl || posterUrl);
    const displayDate = mediaType.toLowerCase() === 'movie' ? releaseDate : firstAirDate;
    const starCount = Math.floor((voteAverage || 0) / 2);

    return (
      <FadeBox
        key={media.id}
        sx={{
          backgroundImage: `url(${imageUrl})`,
          opacity: isVisible ? 1 : 0,
          zIndex: isVisible ? 1 : 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            padding: '20px',
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.6)',
            cursor: 'pointer',
            boxSizing: 'border-box',
            borderRadius: '10px',
          }}
          onClick={() => handleNavigation(media)}
          onMouseEnter={() => handleHover(media)} // Prefetch on hover
        >
          <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
            {displayTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {displayDate}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            {overview}
          </Typography>
          <Box mt={2} display="flex" alignItems="center">
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} sx={{ color: index < starCount ? '#FFD700' : '#CCC' }} />
            ))}
          </Box>
        </Box>
      </FadeBox>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '70vh',
        overflow: 'hidden',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
      }}
    >
      {mediaItems.map((media, index) => {
        const isVisible = index === currentIndex;
        const wasVisible = index === prevIndex;
        return renderMediaItem(media, isVisible || wasVisible);
      })}
    </Box>
  );
}

MediaDisplayCarousel.propTypes = {
  mediaItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  onItemChange: PropTypes.func,
};

export default MediaDisplayCarousel;
