const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // YENİ EKLENDİ

const app = express();

app.use(cors());
app.use(express.json());

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // YENİ EKLENDİ: Artık /api/products çalışacak

app.get('/', (req, res) => {
    res.send('EcoCampus API Çalışıyor! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});