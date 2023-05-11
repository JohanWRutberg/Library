const { addBook, getBookByKeyword, editBook, deleteBook, getAvailability } = require('../repositories/bookRepository');

async function search(req, res) {
    let data = await getBookByKeyword(req.query.keyword);

    return res.json(data);
}

async function getAvailableAndUnavailableBooks(req, res) {
    const [data] = await getAvailability();
    console.log({ data });
    return res.json(data);
}

async function add(req, res) {
    console.log(req.body);

    return await addBook(
        req.body.bookTitle,
        req.body.bookGenre,
        req.body.authorId,
        req.body.bookReleaseYear,
        req.body.bookAvailable
    );
}

async function edit(req, res) {
    console.log(req.body);

    await editBook(
        req.body.bookId,
        req.body.bookTitle,
        req.body.bookGenre,
        req.body.authorId,
        req.body.bookReleaseYear,
        req.body.bookAvailable
    );
}

async function remove(req, res) {
    await deleteBook(req.body.bookId);
}

module.exports = {
    search,
    add,
    edit,
    remove,
    getAvailableAndUnavailableBooks
};
