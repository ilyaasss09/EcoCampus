// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

// KAYIT OL (REGISTER)
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Kullanıcı zaten var mı?
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanımda.' });
        }

        // 2. Şifreyi gizle (Hashle)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Veritabanına kaydet
        const newUser = await userModel.createUser(username, email, hashedPassword);

        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu!', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// GİRİŞ YAP (LOGIN)
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Kullanıcıyı bul
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // 2. Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Hatalı şifre.' });
        }

        // 3. Token oluştur (Bilet ver)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Giriş başarılı', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

module.exports = { register, login };