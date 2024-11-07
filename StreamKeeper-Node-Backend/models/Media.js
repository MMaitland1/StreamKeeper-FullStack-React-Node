class Media {
    constructor(data) {
      this.id = data.id;
      this.mediaType = data.media_type || 'unknown';
      this.popularity = data.popularity;
      this.overview = data.overview;
      this.posterPath = data.poster_path;
      this.backdropPath = data.backdrop_path;
    }
  }
  
  module.exports = Media;
  