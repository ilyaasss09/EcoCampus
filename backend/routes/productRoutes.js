// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protect = require('../middleware/authMiddleware'); // Güvenlik görevlisini çağır

// Herkes görebilir
router.get('/', productController.getProducts);

// Sadece giriş yapanlar ekleyebilir ve silebilir (protect kullanıldı)
router.post('/', protect, productController.addProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;