const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialty.controller');

function specialtyRoutes(app) { 
    router.get('/', specialtyController.listSpecialties);
    app.use('/specialty', router);
}

module.exports = specialtyRoutes;