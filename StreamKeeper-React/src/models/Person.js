// src/models/Person.js

import Media from './Media';

class Person extends Media {
  constructor(data) {
    super(data);
    this.mediaType = 'Person';
    this.name = data.name;
    this.knownFor = data.knownFor;
    this.knownForDepartment = data.knownForDepartment;
  }
}

export default Person;
