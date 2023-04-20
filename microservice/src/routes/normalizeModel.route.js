const express = require('express');
const router = express.Router();
const normalizeModelController = require('../controllers/normalizeModel.controller');

function normalizeModelRoutes(app) {
        router.post('/', normalizeModelController.normalizeModel);
        app.use('/normalize', router)
}

module.exports = normalizeModelRoutes;