/**
 * BrowsePage.js
 * Main browsing interface for media content
 * Features:
 * - Responsive layout with breakpoints
 * - Dynamic content loading
 * - Categorized sections for Movies, TV Shows, and People
 * - Adaptive styling based on viewport size
 */

import React, { useEffect, useState } from 'react';
import BrowseCard from '../components/BrowseCard/BrowseCard';
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel';
import MainService from '../services/MainService';
import Movie from '../models/Movie';
import TVShow from '../models/TvShow';
import Person from '../models/Person';

const BrowsePage = () => {
    /**
     * State Management
     * Separate states for different media categories and viewport tracking
     */
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [popularTvShows, setPopularTvShows] = useState([]);
    const [airingTodayTvShows, setAiringTodayTvShows] = useState([]);
    const [onTheAirTvShows, setOnTheAirTvShows] = useState([]);
    const [topRatedTvShows, setTopRatedTvShows] = useState([]);
    const [popularPersons, setPopularPersons] = useState([]);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    /**
     * Viewport Width Tracking
     * Updates state when window is resized for responsive adjustments
     */
    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Data Fetching
     * Parallel fetching of all media content using Promise.all
     * Instantiates appropriate model classes for each data type
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movie data in parallel
                const [topRatedData, popularData, nowPlayingData, upcomingData] = await Promise.all([
                    MainService.getTopRatedMovies(),
                    MainService.getPopularMovies(),
                    MainService.getNowPlayingMovies(),
                    MainService.getUpcomingMovies(),
                ]);
                setTopRatedMovies(topRatedData.map(movie => new Movie(movie)));
                setPopularMovies(popularData.map(movie => new Movie(movie)));
                setNowPlayingMovies(nowPlayingData.map(movie => new Movie(movie)));
                setUpcomingMovies(upcomingData.map(movie => new Movie(movie)));

                // Fetch TV show data in parallel
                const [popularTvData, airingTodayData, onTheAirData, topRatedTvData] = await Promise.all([
                    MainService.getPopularTvShows(),
                    MainService.getAiringTodayTvShows(),
                    MainService.getOnTheAirTvShows(),
                    MainService.getTopRatedTvShows(),
                ]);
                setPopularTvShows(popularTvData.map(show => new TVShow(show)));
                setAiringTodayTvShows(airingTodayData.map(show => new TVShow(show)));
                setOnTheAirTvShows(onTheAirData.map(show => new TVShow(show)));
                setTopRatedTvShows(topRatedTvData.map(show => new TVShow(show)));

                // Fetch person data
                const personsData = await MainService.getPopularPersons();
                setPopularPersons(personsData.map(person => new Person(person)));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    /**
     * Responsive Text Size Calculator
     * Returns font sizes based on viewport width
     * Breakpoints: 450px (mobile), 720px (tablet)
     */
    const getTextSizes = () => {
        if (viewportWidth <= 450) {
            return { browse: '42px', section: '48px' };
        } else if (viewportWidth <= 720) {
            return { browse: '48px', section: '54px' };
        } else {
            return { browse: '56px', section: '48px' };
        }
    };

    /**
     * Card Dimension Calculator
     * Determines card sizes based on viewport width
     * Maintains aspect ratio of 2:3 for consistency
     */
    const getCardDimensions = () => {
        if (viewportWidth <= 450) {
            return {
                width: viewportWidth * 0.8,
                height: (viewportWidth * 0.8) * (2/3),
            };
        } else if (viewportWidth <= 720) {
            return {
                width: viewportWidth * 0.4,
                height: (viewportWidth * 0.4) * (2/3),
            };
        } else {
            return { width: 300, height: 200 };
        }
    };

    /**
     * Container Style Generator
     * Creates responsive layout styles based on viewport width
     * Switches between column, grid, and flex layouts
     */
    const getContainerStyles = () => {
        if (viewportWidth <= 450) {
            return {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                padding: '10px 0',
            };
        } else if (viewportWidth <= 720) {
            return {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                justifyContent: 'center',
                gap: '20px',
                padding: '10px 0',
            };
        } else {
            return {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: 'auto',
                gap: '20px',
                padding: '10px 0',
            };
        }
    };

    const textSizes = getTextSizes();
    const cardDimensions = getCardDimensions();
    const containerStyles = getContainerStyles();

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: viewportWidth <= 720 ? '100%' : '1200px', 
            margin: '0 auto' 
        }}>
            {/* Page Title */}
            <h1 style={{ 
    textAlign: 'center', 
    fontSize: textSizes.browse,
    marginBottom: '40px',
    fontWeight: 'bold',
    textShadow: viewportWidth <= 720 ? '2px 2px 4px rgba(0,0,0,0.9)' : 'none'
}}>
    Browse
</h1>

            {/* Movies Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                    fontSize: textSizes.section,
                    marginBottom: '30px',
                    textAlign: viewportWidth <= 720 ? 'center' : 'left',
                    fontWeight: 'normal',
                    letterSpacing: viewportWidth <= 720 ? '0.5px' : 'normal'
                }}>
                    Movies
                </h2>
                <div style={containerStyles}>
                    {/* Movie Category Cards */}
                    <BrowseCard 
                        topic="Popular Movies" 
                        mediaArray={popularMovies} 
                        fetchFunction="getPopularMovies" 
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="Now Playing" 
                        mediaArray={nowPlayingMovies} 
                        fetchFunction="getNowPlayingMovies"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="Top Rated Movies" 
                        mediaArray={topRatedMovies} 
                        fetchFunction="getTopRatedMovies"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="Upcoming Movies" 
                        mediaArray={upcomingMovies} 
                        fetchFunction="getUpcomingMovies"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                </div>
            </div>

            {/* TV Shows Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                    fontSize: textSizes.section,
                    marginBottom: '30px',
                    textAlign: viewportWidth <= 720 ? 'center' : 'left',
                    fontWeight:  'normal',
                    letterSpacing: viewportWidth <= 720 ? '0.5px' : 'normal'
                }}>
                    TV Shows
                </h2>
                <div style={containerStyles}>
                    {/* TV Show Category Cards */}
                    <BrowseCard 
                        topic="Popular TV Shows" 
                        mediaArray={popularTvShows} 
                        fetchFunction="getPopularTvShows"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="Airing Today" 
                        mediaArray={airingTodayTvShows} 
                        fetchFunction="getAiringTodayTvShows"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="On The Air" 
                        mediaArray={onTheAirTvShows} 
                        fetchFunction="getOnTheAirTvShows"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                    <BrowseCard 
                        topic="Top Rated TV Shows" 
                        mediaArray={topRatedTvShows} 
                        fetchFunction="getTopRatedTvShows"
                        width={cardDimensions.width}
                        height={cardDimensions.height}
                    />
                </div>
            </div>

            {/* Popular People Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                    fontSize: textSizes.section,
                    marginBottom: '30px',
                    textAlign: viewportWidth <= 720 ? 'center' : 'left',
                    fontWeight: 'normal',
                    letterSpacing: viewportWidth <= 720 ? '0.5px' : 'normal'
                }}>
                    Popular People
                </h2>
                {/* Carousel for Popular People */}
                <DisplayCardCarousel 
                    items={popularPersons}
                    initialCarouselWidth={viewportWidth <= 720 ? viewportWidth * 0.9 : 800}
                    carouselHeight={viewportWidth <= 720 ? 300 : 450}
                    displayLimit={viewportWidth <= 450 ? 1 : viewportWidth <= 720 ? 2 : 4}
                    showArrows={true}
                    cardType="B"
                />
            </div>
        </div>
    );
};

export default BrowsePage;