// src/models/TVShow.js

import Media from './Media';

class TvShow extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'TvShow';
    this.name = data.name;
    this.firstAirDate = data.firstAirDate;
    this.genreIds = data.genreIds;
    this.voteAverage = data.voteAverage;
    this.voteCount = data.voteCount;
  }
}

export default TvShow;
