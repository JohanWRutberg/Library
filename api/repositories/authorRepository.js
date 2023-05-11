// Importerar modulen authorModel från sökvägen ../models/authorModel.
const authorModel = require('../models/authorModel');
// Importerar modulen db_context från sökvägen ../db_context.
const db_context = require('../db_context');
// Skapar en funktion som heter addAuthor med parametrarna firstName, middleName, lastName och country.
async function addAuthor(firstName, middleName, lastName, country) {
    // Använder db_context för att infoga en författare i databasen med de angivna parametrarna.
    const createdAuthor = await db_context.insertAuthor(firstName, middleName, lastName, country);
    // Tar det första elementet i arrayen createdAuthor och tilldelar det till variabeln author.
    const [author] = createdAuthor;
    // Returnerar författaren som skapades i databasen.
    return author;
}
// Skapar en funktion som heter getAuthorByKeyword med parametern keyword.
async function getAuthorByKeyword(keyword) {
    // Skapar en tom array med namnet books.
    let books = [];
    // Använder db_context för att hämta data från databasen med sökordet keyword.
    let data = await db_context.selectAuthorByKeyword(keyword);
    // Lägger till varje författare som matchar sökordet i arrayen books genom att skapa en ny instans av authorModel.
    data.forEach((author) => {
        books.push(
            new authorModel(author.first_name, author.middle_name, author.last_name, author.country, author.author_id)
        );
    });
    // Returnerar arrayen books med alla matchande författare.
    return books;
}
// Exporterar funktionerna addAuthor och getAuthorByKeyword så att de kan användas i andra moduler.
module.exports = {
    addAuthor,
    getAuthorByKeyword
};
