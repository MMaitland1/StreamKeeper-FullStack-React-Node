// src/models/Movie.js
import Media from './Media';

class Movie extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'Movie';
    this.title = data.title;
    this.originalTitle = data.originalTitle;
    this.releaseDate = data.releaseDate;
    this.genreIds = data.genreids;
    this.voteAverage = data.voteAverage;
    this.voteCount = data.voteCount;
  }
}

export default Movie;
