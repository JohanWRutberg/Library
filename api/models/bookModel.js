// Define a class called "book"
module.exports = class book {
    // Define the constructor function with parameters that represent the properties of a book
    constructor(
        bookId,
        bookTitle,
        bookGenre,
        authorId, // ID of the author who wrote the book
        bookReleaseYear, 
        bookAvailable // Whether the book is available for lending or not
    ) {
        // Assign the values of the constructor parameters to properties of the book object
        this.bookId = bookId
        this.bookTitle = bookTitle
        this.bookGenre = bookGenre
        this.authorId = authorId
        this.bookReleaseYear = bookReleaseYear
        this.bookAvailable = bookAvailable
    }
}
