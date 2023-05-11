const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const PORT = 3001;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const bookRouter = require('./routes/book');
const authorRouter = require('./routes/author');
app.use('/book', bookRouter);
app.use('/author', authorRouter);

app.listen(PORT, () => {
    console.log('API - Listening on port: ' + PORT);
});
