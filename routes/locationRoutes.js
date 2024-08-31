const express = require('express');
const {
    getVisitedLocations,
    getNotVisitedLocations,
    addLocation,
    deleteLocation,
    updateLocation,
    getPublicVisitedLocations,
} = require('../controllers/locationController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/imageValidator");

const router = express.Router();

// Защищенный маршрут для получения посещенных локаций
router.get('/visited', authMiddleware, getVisitedLocations);

// Защищенный маршрут для получения непосещенных локаций
router.get('/not-visited', authMiddleware, getNotVisitedLocations);

// Защищенный маршрут для добавления новой локации с изображениями
router.post('/', authMiddleware, upload, addLocation);

// Защищенный маршрут для удаления локации по _id
router.delete('/:id', authMiddleware, deleteLocation);

// Защищенный маршрут для изменения локации по _id
router.put('/:id', authMiddleware, upload, updateLocation);

// Маршрут для получения публичных посещенных локаций от всех пользователей
router.get('/public-visited', getPublicVisitedLocations);

module.exports = router;
