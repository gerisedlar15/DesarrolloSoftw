const mysql = require('mysql2/promise');

// Conexión estándar a tu XAMPP local
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mozzafiato' // Asegurate de que este sea el nombre exacto de tu base de datos
});

module.exports = db;