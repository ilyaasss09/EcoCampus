// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    // 1. Token'ı başlık (header) kısmından al
    const token = req.header('Authorization');

    // 2. Token yoksa içeri alma
    if (!token) {
        return res.status(401).json({ message: 'Yetkiniz yok, lütfen giriş yapın.' });
    }

    try {
        // 3. Token geçerli mi diye kontrol et
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Kullanıcı bilgisini isteğe ekle
        next(); // Her şey yolunda, devam et
    } catch (error) {
        res.status(401).json({ message: 'Geçersiz token.' });
    }
};

module.exports = protect;