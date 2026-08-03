 import express from 'express';
 import cors from 'cors';
 import db from './conexion.js'; // Traemo la conexión a la base de datos desde el archivo conexion.js

 const app = express();

// // Configuraciones básicas
app.use(cors()); // Le da permiso al frontend para conectarse
app.use(express.json()); // Le enseña al backend a leer paquetes JSON

app.post('/api/planner', (req, res) => {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    const contrasenia = req.body.contrasenia;
     // Agarramos el nombre que nos manda el Frontend
    
    // Tu misma consulta SQL de siempre
    const sql = 'INSERT INTO planner (nombre, usuario, contrasenia) VALUES (?, ?, ?)';
    //msj de error y exito
    db.query(sql, [nombre, usuario, contrasenia], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        console.log("¡Se guardó un nuevo Planner (desde la web locuraaaaaa)");
        res.json({ mensaje: "Éxito total", id: resultado.insertId });
    });
});

// Prendemos los motores
const PUERTO = 3001;
app.listen(PUERTO, () => {
    console.log(` API REST encendida y escuchando en http://localhost:${PUERTO}`);
});