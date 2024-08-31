const express = require('express');
const { registerUser, loginUser, getUser} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Маршрут для регистрации пользователя
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', authMiddleware, getUser);

module.exports = router;