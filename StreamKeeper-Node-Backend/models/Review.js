class Review {
    constructor(data) {
        this.author = data.author;
        this.content = data.content;
        this.created = data.created_at;
        this.updated = data.updated_at;
        this.rating = data.author_details.rating || 0;
    }
}

module.exports = Review;