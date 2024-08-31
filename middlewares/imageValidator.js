const multer = require('multer');
const path = require('path');

// Настройка multer для временного хранения изображений
const storage = multer.memoryStorage(); // Изображения будут храниться в памяти

// Ограничения по формату и размеру файлов
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Images must be in JPEG or PNG format'));
    }
};

// Инициализация multer с настройками
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024, files: 5 }, // Максимум 5 файлов, общий размер до 50МБ
    fileFilter: fileFilter,
}).array('images', 5); // Обработка массива файлов с именем 'images'

module.exports = upload;
