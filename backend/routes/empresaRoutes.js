const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Todas as rotas são públicas (não precisa login para ver empresas)
router.get('/', empresaController.getAll);
router.get('/search', empresaController.search);
router.get('/stats', empresaController.stats);
router.get('/:id', empresaController.getById);

module.exports = router;
