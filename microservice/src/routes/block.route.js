const express = require('express');
const router = express.Router();
const blockController = require('../controllers/block.controller');

function blockRoutes(app) {
    router.post('/', blockController.listBlocks);
    app.use('/block', router);
}

module.exports = blockRoutes;