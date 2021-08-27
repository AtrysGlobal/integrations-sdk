const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');

function sessionRoutes(app) {
    router.get('/', sessionController.getSession);
    app.use('/session', router);
}

module.exports = sessionRoutes;