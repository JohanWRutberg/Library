const pgp = require('pg-promise')(/* options */);
const db = pgp(process.env.DATABASE_URL);

async function selectBookByKeyword(keyword) {
    let data;
    if (keyword === '') {
        data = await db.query('SELECT * FROM book');
    } else {
        data = await db.any(`SELECT * FROM book WHERE title ILIKE '${keyword}%'`);
    }
    return data;
}

async function selectAuthorByKeyword(keyword) {
    let data;
    if (keyword === '') {
        data = await db.query('SELECT * FROM author');
    } else {
        data = await db.query(
            `SELECT * FROM author WHERE last_name ILIKE '${keyword}%' OR first_name ILIKE '${keyword}%'`
        );
    }

    return data;
}

async function getAvailableAndUnavailableBooks() {
    let data = await db.query(`SELECT SUM(CASE WHEN available = true THEN 1 ELSE 0 END) AS available_books,
    SUM(CASE WHEN available = false THEN 1 ELSE 0 END) AS unavailable_books FROM book;`);
    return data;
}

async function insertAuthor(firstName, middleName, lastName, country) {
    const result = await db.query(`INSERT INTO author (first_name, middle_name, last_name, country)
VALUES ('${firstName}', '${middleName}', '${lastName}', '${country}')
RETURNING author_id, first_name, middle_name, last_name, country;`);
    return result;
}

async function updateAuthor(firstName, middleName, lastName, country) {
    await db.none(
        `UPDATE author SET first_name = '${firstName}', middle_name = '${middleName}', last_name = '${lastName}', country = '${country}'`
    );
}

async function insertBook(bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable) {
    return await db.query(`INSERT INTO book (title, genre, author_id, release_year, available)
VALUES ('${bookTitle}', '${bookGenre}', ${authorId}, ${bookReleaseYear}, ${bookAvailable})
RETURNING book_id, title, genre, author_id, release_year, available;
`);
}

async function updateBook(bookId, bookTitle, bookGenre, authorId, bookReleaseYear, bookAvailable) {
    await db.none(
        `UPDATE book SET title = '${bookTitle}', genre = '${bookGenre}', author_Id = ${authorId}, release_year = ${bookReleaseYear}, available = '${bookAvailable}' WHERE book_id = ${bookId}`
    );
}

async function deleteBook(bookId) {
    await db.none(`DELETE FROM book WHERE book_id = ${bookId}`);
}

module.exports = {
    selectBookByKeyword,
    selectAuthorByKeyword,
    insertAuthor,
    updateAuthor,
    insertBook,
    updateBook,
    deleteBook,
    getAvailableAndUnavailableBooks
};
