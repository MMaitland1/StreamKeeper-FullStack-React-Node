const Media = require('./Media');

class Person extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'Person';
    this.name = data.name;
    this.knownFor = data.known_for ;
    this.gender = data.gender;
    this.knownForDepartment = data.known_for_department;
  }
}

module.exports = Person;
