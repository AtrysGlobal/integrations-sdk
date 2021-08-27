const express = require('express');
const router = express.Router();
const normalizeModelController = require('../controllers/normalizeModel.controller');

function normalizeModelRoutes(app) {
    try {
        router.post('/', normalizeModelController.normalizeModel);
        app.use('/normalize', router)
        
    } catch (error) {
        console.log('error normalizeModelRoutes', error)
    }
}

module.exports = normalizeModelRoutes;