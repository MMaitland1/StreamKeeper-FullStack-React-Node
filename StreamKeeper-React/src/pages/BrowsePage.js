// src/pages/BrowsePage.js

import React, { useEffect, useState } from 'react';
import BrowseCard from '../components/BrowseCard/BrowseCard'; // Import BrowseCard component
import DisplayCardCarousel from '../components/DisplayCardCarousel/DisplayCardCarousel'; // Import DisplayCardCarousel component
import MainService from '../services/MainService'; // Service to fetch data
import Movie from '../models/Movie'; // Movie model
import TVShow from '../models/TvShow'; // TVShow model
import Person from '../models/Person'; // Person model

const BrowsePage = () => {
    // State variables for storing fetched data
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);

    const [popularTvShows, setPopularTvShows] = useState([]);
    const [airingTodayTvShows, setAiringTodayTvShows] = useState([]);
    const [onTheAirTvShows, setOnTheAirTvShows] = useState([]);
    const [topRatedTvShows, setTopRatedTvShows] = useState([]);
    const [popularPersons, setPopularPersons] = useState([]);

    // Fetch data for movies, TV shows, and persons using useEffect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movies data concurrently
                const [topRatedData, popularData, nowPlayingData, upcomingData] = await Promise.all([
                    MainService.getTopRatedMovies(),
                    MainService.getPopularMovies(),
                    MainService.getNowPlayingMovies(),
                    MainService.getUpcomingMovies(),
                ]);
                // Map fetched data to Movie instances
                setTopRatedMovies(topRatedData.map(movie => new Movie(movie)));
                setPopularMovies(popularData.map(movie => new Movie(movie)));
                setNowPlayingMovies(nowPlayingData.map(movie => new Movie(movie)));
                setUpcomingMovies(upcomingData.map(movie => new Movie(movie)));

                // Fetch TV shows data concurrently
                const [popularTvData, airingTodayData, onTheAirData, topRatedTvData] = await Promise.all([
                    MainService.getPopularTvShows(),
                    MainService.getAiringTodayTvShows(),
                    MainService.getOnTheAirTvShows(),
                    MainService.getTopRatedTvShows(),
                ]);
                // Map fetched data to TVShow instances
                setPopularTvShows(popularTvData.map(show => new TVShow(show)));
                setAiringTodayTvShows(airingTodayData.map(show => new TVShow(show)));
                setOnTheAirTvShows(onTheAirData.map(show => new TVShow(show)));
                setTopRatedTvShows(topRatedTvData.map(show => new TVShow(show)));

                // Fetch popular persons
                const personsData = await MainService.getPopularPersons();
                // Map fetched data to Person instances
                setPopularPersons(personsData.map(person => new Person(person)));
            } catch (error) {
                console.error("Error fetching data:", error); // Log any errors that occur during data fetching
            }
        };

        fetchData(); // Call the fetchData function
    }, []); // Run once on component mount

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Page Title */}
            <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>Browse</h1>

            {/* Movies Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Movies</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflowX: 'auto', // Allow horizontal scrolling
                    gap: '20px',
                    padding: '10px 0',
                }}>
                    {/* Render BrowseCards for different movie categories */}
                    <BrowseCard topic="Popular Movies" mediaArray={popularMovies} fetchFunction="getPopularMovies" />
                    <BrowseCard topic="Now Playing" mediaArray={nowPlayingMovies} fetchFunction="getNowPlayingMovies" />
                    <BrowseCard topic="Top Rated Movies" mediaArray={topRatedMovies} fetchFunction="getTopRatedMovies" />
                    <BrowseCard topic="Upcoming Movies" mediaArray={upcomingMovies} fetchFunction="getUpcomingMovies" />
                </div>
            </div>

            {/* TV Shows Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>TV Shows</h2>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflowX: 'auto', // Allow horizontal scrolling
                    gap: '20px',
                    padding: '10px 0',
                }}>
                    {/* Render BrowseCards for different TV show categories */}
                    <BrowseCard topic="Popular TV Shows" mediaArray={popularTvShows} fetchFunction="getPopularTvShows" />
                    <BrowseCard topic="Airing Today" mediaArray={airingTodayTvShows} fetchFunction="getAiringTodayTvShows" />
                    <BrowseCard topic="On The Air" mediaArray={onTheAirTvShows} fetchFunction="getOnTheAirTvShows" />
                    <BrowseCard topic="Top Rated TV Shows" mediaArray={topRatedTvShows} fetchFunction="getTopRatedTvShows" />
                </div>
            </div>

            {/* Popular People Section */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Popular People</h2>
                {/* Render a carousel of popular persons */}
                <DisplayCardCarousel 
                    items={popularPersons}
                    initialCarouselWidth={800}
                    carouselHeight={450}
                    displayLimit={4}
                    showArrows={true}
                    cardType="B"
                />
            </div>
        </div>
    );
};

export default BrowsePage;
