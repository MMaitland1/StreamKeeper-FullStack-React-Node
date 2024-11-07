// src/App.js

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import TvShowDetailPage from './pages/TvShowDetailPage';
import PersonDetailPage from './pages/PersonDetailPage';
import BrowsePage from './pages/BrowsePage';
import InfoDisplayPage from './pages/InfoDisplayPage'; // Import InfoDisplayPage
import './App.css';

// ScrollToTop component to handle scrolling to the top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component for rotating background
function RotatingBackground() {
  useEffect(() => {
    let angle = 0;
    const increment = .2; // Controls speed of rotation (adjust as needed)
    const interval = setInterval(() => {
      angle = (angle + increment) % 360; // Keep angle in 0-359 degrees
      document.body.style.setProperty('--rotation-angle', `${angle}deg`);
    }, 40); // Time interval in milliseconds (adjust for smoother/faster rotation)

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <RotatingBackground /> {/* Add rotating background functionality */}
      <Navbar />
      <ScrollToTop />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:query" element={<SearchResultsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          
          {/* Dynamic route for Info Display Page */}
          <Route path="/info/:topic" element={<InfoDisplayPage />} />

          {/* Movie Detail Page */}
          <Route path="/movie/:id" element={<MovieDetailPage />} />

          {/* TV Show Detail Page */}
          <Route path="/tvshow/:id" element={<TvShowDetailPage />} />

          {/* Person Detail Page */}
          <Route path="/person/:id" element={<PersonDetailPage />} />

          {/* Fallback route */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
