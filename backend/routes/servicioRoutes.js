const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

// Usamos POST porque estamos enviando/guardando datos nuevos
router.post('/', ServicioController.crear);

module.exports = router;