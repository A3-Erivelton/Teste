const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas (precisa estar logado)
router.get('/me', verifyToken, authController.me);
router.put('/me', verifyToken, authController.updateMe);

module.exports = router;
