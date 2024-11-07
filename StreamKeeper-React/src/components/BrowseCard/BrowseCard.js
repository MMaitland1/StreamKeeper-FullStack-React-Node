// BrowseCard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const BrowseCard = ({ topic, mediaArray, fetchFunction }) => {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to manage the current image index for rotation

    // Effect to cycle through images every 6 seconds when there is content in mediaArray
    useEffect(() => {
        if (mediaArray.length > 0) {
            // Set an interval to update the current image index periodically
            const intervalId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaArray.length); // Loop back to the start when reaching the end
            }, 6000); // Change image every 6 seconds

            // Cleanup the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [mediaArray.length]);

    // Handle card click event to navigate to a detailed info page with state
    const handleClick = () => {
        navigate(`/info/${topic}`, { state: { mediaArray, fetchFunction } });
    };

    return (
        <Tooltip
            // Display a tooltip showing the name or title of the current media item
            title={mediaArray[currentImageIndex]?.name || mediaArray[currentImageIndex]?.title || ''}
            arrow
            placement="top"
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10], // Adjusts tooltip position relative to the cursor
                        },
                    },
                ],
            }}
        >
            <div
                onClick={handleClick} // Trigger navigation on click
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Box shadow for card elevation
                    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
                    backgroundColor: '#333', // Default background color
                }}
                className="browse-card"
                // Scale effect on hover
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(.9)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${mediaArray[currentImageIndex]?.posterUrl || ''})`, // Background image based on media array
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0, // Background image layer
                    }}
                    className="browse-card__background"
                />

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                        zIndex: 1, // Overlay layer
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    className="browse-card__overlay"
                >
                    {/* Display the topic title in the center of the card */}
                    <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>{topic}</h2>
                </div>
            </div>
        </Tooltip>
    );
};

export default BrowseCard; // Export the BrowseCard component as the default export
