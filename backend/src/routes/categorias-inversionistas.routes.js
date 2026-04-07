const express = require('express');
const router = express.Router();
const categoriasInversionistasController = require('../controllers/categorias-inversionistas.controller');

router.get('/', categoriasInversionistasController.obtenerCategoriasInversionistas);


module.exports = router;