const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { yandexUpload, yandexDelete} = require("../utils/yandexRequestUpload");

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { username, pin } = req.body;

    try {
        // Приведение username к нижнему регистру
        const lowerCaseUsername = username.toLowerCase();

        // Проверяем, существует ли уже такой пользователь
        const existingUser = await User.findOne({ username: lowerCaseUsername });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Создаем нового пользователя
        const user = new User({ username: lowerCaseUsername, pin });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Username must be at least 2 characters long' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};



const loginUser = async (req, res) => {
    const { username, pin } = req.body;

    try {
        // Приведение username к нижнему регистру
        const lowerCaseUsername = username.toLowerCase();

        // Поиск пользователя по имени пользователя и пин-коду
        const user = await User.findOne({ username: lowerCaseUsername });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверка пин-кода
        const isMatch = await user.comparePin(pin);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Создание JWT токена
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Если authMiddleware прошел успешно, значит токен валидный
        res.status(200).json({
            id: req.user.id,
            username: req.user.username,
            profileImage: user.profileImage
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error });
    }
};

const updateUserProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Здесь вы загружаете файл в облако и получаете ссылку на него
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (user.profileImage) {
            await yandexDelete(user.profileImage)
        }

        // Пример загрузки в облако (замените на ваш код для загрузки)
        const cloudLink = await yandexUpload(file)

        // Обновляем ссылку на изображение профиля
        user.profileImage = cloudLink;

        await user.save();

        res.status(200).json({ message: 'Profile image updated successfully', profileImage: cloudLink });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUserProfileImage
};