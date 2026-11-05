const express = require('express');
const router = express.Router();
const ServicioController = require('../controllers/ServicioController');

router.get('/', ServicioController.listar);
router.get('/:id', ServicioController.obtenerPorId);
router.post('/', ServicioController.crear);
router.put('/:id', ServicioController.actualizar);
router.patch('/:id', ServicioController.actualizar);
router.delete('/:id', ServicioController.eliminar);

module.exports = router;
