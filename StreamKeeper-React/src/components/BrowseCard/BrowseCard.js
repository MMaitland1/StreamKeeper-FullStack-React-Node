import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

/**
 * BrowseCard.js
 * A responsive, interactive card component for media browsing
 * Features:
 * - Automatic image rotation
 * - Responsive sizing
 * - Hover effects
 * - Dynamic text scaling
 * - Tooltip information
 */
/**
 * BrowseCard Component
 * @param {string} topic - Card title/category
 * @param {Array} mediaArray - Array of media objects to display
 * @param {Function} fetchFunction - Function to fetch additional media data
 * @param {number} width - Base width of the card (default: 300px)
 * @param {number} height - Base height of the card (default: 200px)
 * @param {boolean} responsive - Enable/disable responsive behavior (default: true)
 */
const BrowseCard = ({ 
    topic, 
    mediaArray, 
    fetchFunction,
    width = 300,
    height = 200,
    responsive = true
}) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dimensions, setDimensions] = useState({ width, height });

    /**
     * Image Rotation Effect
     * Cycles through mediaArray images every 6 seconds
     * Cleans up interval on unmount or when mediaArray changes
     */
    useEffect(() => {
        if (mediaArray.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaArray.length);
            }, 6000);
            return () => clearInterval(intervalId);
        }
    }, [mediaArray.length]);

    /**
     * Responsive Sizing Effect
     * Adjusts card dimensions based on viewport size
     * Maintains aspect ratio during scaling
     * Disabled when responsive prop is false
     */
    useEffect(() => {
        if (!responsive) {
            setDimensions({ width, height });
            return;
        }

        const handleResize = () => {
            const viewportWidth = window.innerWidth;
            let newWidth = width;
            let newHeight = height;

            // Responsive breakpoints with size calculations
            if (viewportWidth < 768) { // Mobile devices
                newWidth = Math.min(viewportWidth * 0.9, width);
                newHeight = (newWidth * height) / width; // Preserve aspect ratio
            } else if (viewportWidth < 1024) { // Tablet devices
                newWidth = Math.min(viewportWidth * 0.45, width);
                newHeight = (newWidth * height) / width;
            }

            setDimensions({ width: newWidth, height: newHeight });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial size calculation
        
        return () => window.removeEventListener('resize', handleResize);
    }, [responsive, width, height]);

    /**
     * Navigation Handler
     * Routes to detailed info page with media data
     */
    const handleClick = () => {
        navigate(`/info/${topic}`, { state: { mediaArray, fetchFunction } });
    };

    return (
        <Tooltip
            title={mediaArray[currentImageIndex]?.name || mediaArray[currentImageIndex]?.title || ''}
            arrow
            placement="top"
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10], 
                        },
                    },
                ],
            }}
        >
            <div
                onClick={handleClick}
                style={{
                    position: 'relative',
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease-in-out',
                    backgroundColor: '#333', // Fallback color
                }}
                className="browse-card"
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(.9)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {/* Background Image Layer */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${mediaArray[currentImageIndex]?.posterUrl || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                    }}
                    className="browse-card__background"
                />

                {/* Overlay Layer with Title */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    className="browse-card__overlay"
                >
                    <h2 style={{ 
                        color: 'white', 
                        fontSize: `${Math.max(16, dimensions.width * 0.08)}px`, 
                        margin: 0,
                        textAlign: 'center',
                        padding: '0 10px'
                    }}>
                        {topic}
                    </h2>
                </div>
            </div>
        </Tooltip>
    );
};

export default BrowseCard;