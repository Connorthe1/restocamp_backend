// Подключаем модуль
const EasyYandexS3 = require("easy-yandex-s3").default;
const path = require('path')

// Инициализация
const s3 = new EasyYandexS3({
    auth: {
        accessKeyId: process.env.YA_ACESS_KEY,
        secretAccessKey: process.env.YA_SECRET_KEY,
    },
    Bucket: "restocamp", // например, "my-storage",
    debug: false // Дебаг в консоли, потом можете удалить в релизе
});

async function yandexUpload(file) {
    try {
        const fileName = "restocamp-" + Date.now() + path.extname(file.originalname)

        const upload = await s3.Upload({
            buffer: file.buffer,
            name: fileName
        }, '/images/');

        return upload.Location
    } catch (e) {
        console.log(e)
    }
}

async function yandexDelete(fileUrl){
    const url = new URL(fileUrl);
    const filename = url.pathname
    await s3.Remove( filename );
}

module.exports = {yandexUpload, yandexDelete}
