const express = require('express');
const router = express.Router();
const BodaController = require('../controllers/BodaController');

router.get('/', BodaController.listar);
router.get('/:id', BodaController.obtenerPorId);
router.post('/', BodaController.crear);
router.put('/:id', BodaController.actualizar);
router.patch('/:id', BodaController.actualizar);
router.delete('/:id', BodaController.eliminar);

module.exports = router;
