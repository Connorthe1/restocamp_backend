const express = require('express');
const { registerUser, loginUser, getUser, updateUserProfileImage} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение на размер файла: 5MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file (jpg, jpeg, png)'));
        }
        cb(null, true);
    }
});

// Маршрут для регистрации пользователя
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser', authMiddleware, getUser);
router.put('/profile', authMiddleware, upload.single('profileImage'), updateUserProfileImage);

module.exports = router;