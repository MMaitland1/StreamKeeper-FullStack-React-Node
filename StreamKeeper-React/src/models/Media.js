// src/models/Media.js

class Media {
  constructor(data) {
    this.id = data.id;
    this.mediaType = data.mediaType || 'unknown';
    this.popularity = data.popularity;
    this.overview = data.overview;
    this.posterPath = data.posterPath ;
    this.backdropPath = data.backdropPath ;

    // Derived URLs for images
    this.posterUrl = this.posterPath ? `https://image.tmdb.org/t/p/w500${this.posterPath}` : null;
    this.backdropUrl = this.backdropPath ? `https://image.tmdb.org/t/p/original${this.backdropPath}` : null;
  }
}

export default Media;
