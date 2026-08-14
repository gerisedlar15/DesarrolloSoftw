import mysql from 'mysql2';
import dotenv from 'dotenv';

// Esto carga los datos del archivo .env oculto
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((error) => {
    if (error) {
        console.error(' Error al conectar a la base de datos:', error.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL!');
});

export default db;