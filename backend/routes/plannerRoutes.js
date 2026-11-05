const express = require('express');
const router = express.Router();
const PlannerController = require('../controllers/PlannerController');

router.get('/', PlannerController.listar);
router.get('/:id', PlannerController.obtenerPorId);
router.post('/', PlannerController.crear);
router.put('/:id', PlannerController.actualizar);
router.patch('/:id', PlannerController.actualizar);
router.delete('/:id', PlannerController.eliminar);

module.exports = router;
