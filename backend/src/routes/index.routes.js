const express = require('express');
const router = express.Router();

router.use('/inversionistas', require('./inversionistas.routes'));
router.use('/categorias-inversionistas', require('./categorias-inversionistas.routes'));


module.exports = router;