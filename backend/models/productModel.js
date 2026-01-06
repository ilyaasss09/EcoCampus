// models/productModel.js
const pool = require('../config/db');

// Tüm ürünleri getir (Kullanıcı adıyla birlikte)
const getAllProducts = async () => {
    const result = await pool.query(`
        SELECT p.*, u.username, c.name as category_name
        FROM products p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    `);
    return result.rows;
};

// Yeni ürün ekle
const createProduct = async (title, price, description, image_url, user_id, category_id) => {
    const result = await pool.query(
        'INSERT INTO products (title, price, description, image_url, user_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, price, description, image_url, user_id, category_id]
    );
    return result.rows[0];
};

// Ürün sil
const deleteProduct = async (id, user_id) => {
    // Sadece kendi ürününü silebilir kontrolü
    const result = await pool.query(
        'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *',
        [id, user_id]
    );
    return result.rows[0];
};

module.exports = { getAllProducts, createProduct, deleteProduct };