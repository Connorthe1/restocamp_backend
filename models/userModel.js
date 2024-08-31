const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,  // Добавлено ограничение на минимальную длину
    },
    pin: {
        type: String,
        required: true,
    },
});

// Приводим username к нижнему регистру перед сохранением
userSchema.pre('save', function (next) {
    this.username = this.username.toLowerCase();
    next();
});

// Хеширование пин-кода перед сохранением
userSchema.pre('save', async function (next) {
    if (!this.isModified('pin')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
    next();
});

// Метод для сравнения пин-кода
userSchema.methods.comparePin = async function (enteredPin) {
    return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', userSchema);
