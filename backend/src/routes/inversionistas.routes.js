const express = require('express');
const router = express.Router();
const inversionistasController = require('../controllers/inversionistas.controller');

router.get('/', inversionistasController.obtenerInversionistas);
router.get('/:id', inversionistasController.obtenerInversionistaPorId);
router.post('/', inversionistasController.crearInversionista);
router.put('/:id', inversionistasController.editarInversionista);


module.exports = router;