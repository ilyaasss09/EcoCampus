// models/userModel.js
const pool = require('../config/db');

// E-posta adresine göre kullanıcı bulur
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

// Yeni kullanıcı oluşturur
const createUser = async (username, email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, passwordHash]
    );
    return result.rows[0];
};

module.exports = { findUserByEmail, createUser };