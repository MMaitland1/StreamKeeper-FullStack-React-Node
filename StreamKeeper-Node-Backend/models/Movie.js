const Media = require('./Media');

class Movie extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'Movie';
    this.title = data.title;
    this.originalTitle = data.original_title;
    this.releaseDate = data.release_date;
    this.genreIds = data.genre_ids;
    this.voteAverage = data.vote_average;
    this.voteCount = data.vote_count;
  }
}

module.exports = Movie;
