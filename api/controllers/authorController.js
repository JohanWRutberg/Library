const { addAuthor, getAuthorByKeyword } = require('../repositories/authorRepository');

async function search(req, res) {
    let data = await getAuthorByKeyword(req.query.keyword);

    return res.json(data);
}

async function add(req, res) {
    console.log(req.body);

    const author = await addAuthor(req.body.firstName, req.body.middleName, req.body.lastName, req.body.country);
    return author;
}

module.exports = {
    search,
    add
};
