const express = require('express');
const router = express.Router();
const PersonaController = require('../controllers/PersonaController');

router.get('/', PersonaController.listar);
router.get('/:id', PersonaController.obtenerPorId);
router.post('/', PersonaController.crear);
router.put('/:id', PersonaController.actualizar);
router.patch('/:id', PersonaController.actualizar);
router.delete('/:id', PersonaController.eliminar);

module.exports = router;
