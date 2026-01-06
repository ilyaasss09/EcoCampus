// controllers/productController.js
const productModel = require('../models/productModel');

// Ürünleri Listele
const getProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Ürün Ekle
const addProduct = async (req, res) => {
    const { title, price, description, image_url, category_id } = req.body;
    const user_id = req.user.id; // Middleware'den gelen ID

    try {
        const newProduct = await productModel.createProduct(title, price, description, image_url, user_id, category_id);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ürün eklenirken hata oluştu' });
    }
};

// Ürün Sil
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const deletedProduct = await productModel.deleteProduct(id, user_id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Ürün bulunamadı veya silme yetkiniz yok.' });
        }
        res.json({ message: 'Ürün silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Silme hatası' });
    }
};

module.exports = { getProducts, addProduct, deleteProduct };