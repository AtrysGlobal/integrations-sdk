const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professional.controller');

function professionalRoutes(app) {
    router.get('/', professionalController.listProfessionals);
    app.use('/professional', router);
}

module.exports = professionalRoutes;