import mysql from 'mysql2';

// Creamos la conexión con los datos de tu phpMyAdmin
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'mozzafiato' 
});

conexion.connect((error) => {
    if (error) {
        console.error(' Error al conectar a MySQL:', error.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

export default conexion; 