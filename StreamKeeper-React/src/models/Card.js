// src/models/Card.js
import Media from './Media';
import Person from './Person';
import Movie from './Movie';
import TVShow from './TVShow';

class Card extends Media {
  constructor(data) {
    super(data);
    
    if (data instanceof Person) {
      this.mediaType = 'Person';
      this.name = data.name;
      this.description = data.knownForDepartment;
      this.imageUrl = data.profileUrl; // Assumes profile image URL is provided in data
      this.rating = null; // Rating is not typically available for persons
    } else if (data instanceof Movie) {
      this.mediaType = 'Movie';
      this.name = data.title;
      this.description = data.overview || '';
      this.imageUrl = data.posterUrl; // Assumes poster URL is provided in data
      this.rating = data.voteAverage;
    } else if (data instanceof TVShow) {
      this.mediaType = 'TvShow';
      this.name = data.name;
      this.description = data.overview || '';
      this.imageUrl = data.posterUrl; // Assumes poster URL is provided in data
      this.rating = data.voteAverage;
    } else {
      throw new Error("Unsupported media type");
    }
  }
}

export default Card;
