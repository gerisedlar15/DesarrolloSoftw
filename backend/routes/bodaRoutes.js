const express = require('express');
const router = express.Router();
const BodaController = require('../controllers/BodaController');

router.get('/', BodaController.listar);
router.get('/:id', BodaController.obtenerPorId);
router.post('/', BodaController.crear);
router.put('/:id', BodaController.actualizar);
router.patch('/:id', BodaController.actualizar);
router.delete('/:id', BodaController.eliminar);

// Rutas para la vinculación y envío de invitaciones a bodas
router.get('/:idBoda/invitados', BodaController.obtenerInvitados);
router.post('/:idBoda/invitados', BodaController.asociarInvitados);
router.post('/:idBoda/enviar-invitaciones', BodaController.enviarInvitaciones);
router.delete('/:idBoda/invitados/:idPerso', BodaController.desasociarInvitado);

module.exports = router;
