const Media = require('./Media');

class TVShow extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'TVShow';
    this.name = data.name;
    this.originalName = data.original_name;
    this.firstAirDate = data.first_air_date;
    this.genreIds = data.genre_ids;
    this.voteAverage = data.vote_average;
    this.voteCount = data.vote_count;
  }
}

module.exports = TVShow;
