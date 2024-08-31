const Location = require('../models/locationModel');
const { yandexUpload, yandexDelete} = require("../utils/yandexRequestUpload");

// Получение всех посещенных локаций
const getVisitedLocations = async (req, res) => {
    try {
        const locations = await Location.find({ user: req.user.id, visited: true }).sort({ date: -1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Получение всех непосещенных локаций
const getNotVisitedLocations = async (req, res) => {
    try {
        const locations = await Location.find({ user: req.user.id, visited: false }).sort({ _id: -1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
const addLocation = async (req, res) => {
    try {

        // Парсим объект локации из формата formData
        const locationData = JSON.parse(req.body.data);

        // Валидация количества файлов
        if (req.files.length > 5) {
            return res.status(400).json({ message: 'You can upload up to 5 images only' });
        }

        const cloudLinks = [];

        for (const file of req.files) {
            const link = await yandexUpload(file); // Реализуйте функцию загрузки в облако
            cloudLinks.push(link);
        }

        locationData.files = cloudLinks

        const newLocation = new Location({
            user: req.user.id,
            ...locationData, // Включаем остальные поля из locationData
        });

        await newLocation.save();

        res.status(201).json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Проверяем, принадлежит ли локация текущему пользователю
        if (location.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        for (const file of location.files) {
            await yandexDelete(file); // Реализуйте функцию загрузки в облако
        }

        await location.deleteOne();

        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateLocation = async (req, res) => {
    try {
        const updatedData = JSON.parse(req.body.data); // Обновленные данные локации
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Проверка на существующие изображения
        const existingFiles = updatedData.files || [];
        const filesToRemove = location.files.filter(file => !existingFiles.includes(file));

        // Удаляем изображения, которые были удалены с фронта
        for (const file of filesToRemove) {
            await yandexDelete(file);
        }

        // Добавляем ссылки на новые изображения в поле files
        const cloudLinks = [];

        for (const file of req.files) {
            const link = await yandexUpload(file); // Реализуйте функцию загрузки в облако
            cloudLinks.push(link);
        }

        // Обновляем локацию с учётом новых и существующих изображений
        location.name = updatedData.name || location.name;
        location.location = updatedData.location || location.location;
        location.price = updatedData.price || location.price;
        location.date = updatedData.date || location.date;
        location.desc = updatedData.desc || location.desc;
        location.link = updatedData.link || location.link;
        location.rating = updatedData.rating !== undefined ? updatedData.rating : location.rating;
        location.public = updatedData.public !== undefined ? updatedData.public : location.public;
        location.visited = updatedData.visited !== undefined ? updatedData.visited : location.visited;

        // Обновляем поле files с учётом существующих и новых файлов
        location.files = [...existingFiles, ...cloudLinks];

        await location.save();

        res.status(200).json({ message: 'Location updated successfully', location });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getPublicVisitedLocations = async (req, res) => {
    try {
        const locations = await Location.find({ public: true, visited: true })
            .populate('user', 'username') // Популяция поля user и возврат только username
            .sort({ date: -1 })
            .exec();

        res.status(200).json({ locations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getVisitedLocations,
    getNotVisitedLocations,
    addLocation,
    deleteLocation,
    updateLocation,
    getPublicVisitedLocations
};