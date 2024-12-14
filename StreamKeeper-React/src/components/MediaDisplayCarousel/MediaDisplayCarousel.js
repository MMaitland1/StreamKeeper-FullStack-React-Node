/**
 * MediaDisplayCarousel.js
 * A responsive, full-featured carousel component for displaying media content with animations
 * Features include auto-play, fade transitions, responsive design, and dynamic content loading
 * Used primarily for showcasing movies, TV shows, and person profiles from TMDB
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import styled from 'styled-components';
import PrefetchService from '../../services/PrefetchService';
import { MediaDisplayCarouselWrapper } from './MediaDisplayCarousel.styled';

/**
 * Styled component for handling slide transitions and background images
 * Uses absolute positioning for proper stacking of carousel items
 * Includes smooth fade transitions for a polished user experience
 */
const FadeBox = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
`;

/**
 * MediaDisplayCarousel Component
 * @param {Array} mediaItems - Array of media objects (movies, TV shows, or people)
 * @param {boolean} autoPlay - Enable/disable automatic slideshow (default: true)
 * @param {number} interval - Time between slides in ms (default: 5000)
 * @param {Function} onItemChange - Callback when active slide changes
 */
function MediaDisplayCarousel({ mediaItems, autoPlay = true, interval = 5000, onItemChange }) {
    /**
     * Component State
     * currentIndex: Tracks the currently displayed slide
     * prevIndex: Stores previous slide for fade transition
     * windowWidth: Tracks viewport width for responsive design
     */
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    /**
     * Responsive Design Handler
     * Updates windowWidth state on viewport resize
     * Used for responsive text truncation
     */
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Formats image URLs for TMDB API compatibility
     * Ensures proper URL structure for both internal and external images
     * @param {string} url - Raw image URL
     * @returns {string} - Formatted image URL
     */
    const formatImageUrl = (url) => {
        const baseUrl = 'https://image.tmdb.org/t/p/original';
        return url && url.startsWith('http') ? url : `${baseUrl}${url}`;
    };

    /**
     * Overview Text Truncation
     * Adjusts text length based on screen size for better readability
     * Mobile shows 50 chars, desktop shows half of full text
     * @param {string} text - Original overview text
     * @returns {string} - Truncated text with ellipsis
     */
    const truncateOverview = (text) => {
        if (!text) return '';
        
        if (windowWidth <= 600) {
            return text.length > 50 ? `${text.substring(0, 50)}...` : text;
        }
        
        const halfLength = Math.floor(text.length / 2);
        return text.length > 0 ? `${text.substring(0, halfLength)}...` : text;
    };

    /**
     * Auto-Play Controller
     * Manages automatic slide transitions when enabled
     * Includes cleanup to prevent memory leaks
     */
    useEffect(() => {
        if (autoPlay && mediaItems.length > 0) {
            timeoutRef.current = setInterval(() => {
                setPrevIndex(currentIndex);
                setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
            }, interval);
            return () => clearInterval(timeoutRef.current);
        }
    }, [autoPlay, interval, mediaItems.length, currentIndex]);

    /**
     * Item Change Notifier
     * Triggers callback when active item changes
     * Useful for parent components tracking carousel state
     */
    useEffect(() => {
        if (onItemChange && mediaItems[currentIndex]) {
            onItemChange(mediaItems[currentIndex]);
        }
    }, [currentIndex, mediaItems, onItemChange]);

    /**
     * Navigation Handler
     * Routes user to appropriate detail page based on media type
     * Supports movies, TV shows, and person profiles
     * @param {Object} media - Media item data
     */
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

    /**
     * Data Prefetcher
     * Preloads data for smoother transitions on hover
     * Handles potential errors during prefetch
     * @param {Object} media - Media item to prefetch
     */
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

    /**
     * Media Item Renderer
     * Creates individual carousel slides with content and styling
     * Handles image loading, text display, and rating visualization
     * @param {Object} media - Media item data
     * @param {boolean} isVisible - Whether slide is currently active
     * @returns {JSX.Element} - Rendered carousel slide
     */
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
                style={{
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
                    onMouseEnter={() => handleHover(media)}
                >
                    <Typography variant="h4" sx={{ wordWrap: 'break-word' }}>
                        {displayTitle}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        {displayDate}
                    </Typography>
                    <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                        {truncateOverview(overview)}
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

    /**
     * Main Render Method
     * Assembles the complete carousel with all slides
     * Manages visibility and transitions between slides
     */
    return (
        <MediaDisplayCarouselWrapper>
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
        </MediaDisplayCarouselWrapper>
    );
}

/**
 * Component PropTypes
 * Defines expected props and their types for better development experience
 */
MediaDisplayCarousel.propTypes = {
    mediaItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    autoPlay: PropTypes.bool,
    interval: PropTypes.number,
    onItemChange: PropTypes.func,
};

export default MediaDisplayCarousel;