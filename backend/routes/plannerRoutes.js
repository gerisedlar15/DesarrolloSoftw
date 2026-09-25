const express = require('express');
const router = express.Router();

const PlannerController = require('../controllers/PlannerController');

// Solo dejamos la ruta POST que usamos para crear un nuevo planner
router.post('/', PlannerController.crear);

module.exports = router;