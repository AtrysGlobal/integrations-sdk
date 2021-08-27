const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

function loginRoutes(app) {
    router.post('/', loginController.login);
    app.use('/login', router)
}

module.exports = loginRoutes;