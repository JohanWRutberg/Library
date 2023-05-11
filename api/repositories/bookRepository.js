// Importerar modulen bookModel från sökvägen ../models/bookModel.
const bookModel = require('../models/bookModel');
// Importerar modulen db_context från sökvägen ../db_context.
const db_context = require('../db_context');
// Skapar en funktion som heter getAllBooks.
async function getAllBooks() {
    // Skapar en tom array med namnet books.
    let books = [];
    // Använder db_context för att hämta alla böcker från databasen.
    let data = await db_context.selectAllBooks();
    // Lägger till varje bok i arrayen books genom att skapa en ny instans av bookModel.
    data.forEach((book) => {
        books.push(
            new bookModel(book.book_id, book.title, book.genre, book.authorId, book.release_year, book.available)
        );
    });
    // Returnerar arrayen books med alla böcker.
    return books;
}
// Skapar en funktion som heter getBookByKeyword med parametern keyword.
async function getBookByKeyword(keyword) {
    // Skapar en tom array med namnet books.
    let books = [];
    // Använder db_context för att hämta data från databasen med sökordet keyword.
    let data = await db_context.selectBookByKeyword(keyword);
    // Lägger till varje bok som matchar sökordet i arrayen books genom att skapa en ny instans av bookModel.
    data.forEach((book) => {
        books.push(
            new bookModel(book.book_id, book.title, book.genre, book.author_id, book.release_year, book.available)
        );
    });
    // Returnerar arrayen books med alla matchande böcker.
    return books;
}
// Skapar en funktion som heter getAvailability.
async function getAvailability() {
    // Använder db_context för att hämta data från databasen om vilka böcker som är tillgängliga eller ej.
    const data = await db_context.getAvailableAndUnavailableBooks();
    // Returnerar data från databasen.
    return data;
}
// Skapar en funktion som heter addBook med parametrarna bookTitle, bookGenre, authorId, bookReleaseYear och bookAvailable.
async function addBook(bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable) {
    // Använder db_context för att infoga en ny bok i databasen med de angivna parametrarna.
    return await db_context.insertBook(bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable);
}
// Skapar en funktion som heter editBook med parametrarna bookId, bookTitle, bookGenre, authorId, bookReleaseYear och bookAvailable.
async function editBook(bookId, bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable) {
    // Använder db_context för att uppdatera en befintlig bok i databasen med de angivna parametrarna.
    db_context.updateBook(bookId, bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable);
}
// Skapar en funktion som heter deleteBook med parametern bookId.
async function deleteBook(bookId) {
    // Använder db_context för att ta bort en bok från databasen med den angivna bookId.
    db_context.deleteBook(bookId);
}

module.exports = {
    getAllBooks,
    getBookByKeyword,
    addBook,
    editBook,
    deleteBook,
    getAvailability
};
