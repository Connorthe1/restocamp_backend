require('dotenv').config();
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors')

const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Middleware для парсинга JSON
app.use(express.json());

// Использование CORS (опционально)
app.use(cors())

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);

// Обработчик ошибок
// app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

