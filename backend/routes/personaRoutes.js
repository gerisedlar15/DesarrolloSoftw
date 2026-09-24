const express = require('express');
const router = express.Router();
const PersonaController = require('../controllers/PersonaController');

// Conectamos las URLs con las funciones de tu base de datos
router.get('/', PersonaController.listar);
router.delete('/:id', PersonaController.eliminar);

// ESTA ES LA LÍNEA CLAVE: exporta el router para que server.js lo pueda usar
module.exports = router;