const express = require('express');
const router = express.Router();
const BodaController = require('../controllers/BodaController');

router.post('/', BodaController.crear);

module.exports = router;