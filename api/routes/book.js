const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookController');

router.get('/search', async (req, res) => {
    console.log(req.query);

    await controller.search(req, res);
});

router.get('/availability', async (req, res) => {
    console.log(req.query);

    await controller.getAvailableAndUnavailableBooks(req, res);
});

router.post('/add', async (req, res) => {
    console.log(req.query);

    const book = await controller.add(req, res);

    res.send(book);
});

router.put('/edit', async (req, res) => {
    await controller.edit(req, res);

    res.sendStatus(200);
});

router.delete('/remove', async (req, res) => {
    await controller.remove(req, res);

    res.sendStatus(200);
});

module.exports = router;
