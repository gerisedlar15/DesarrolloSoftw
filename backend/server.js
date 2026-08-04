import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import db from './conexion.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir la carpeta frontend completa públicamente
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint para recibir el registro del planner desde la web
app.post('/api/planner', (req, res) => {
    const { nombre, usuario, contrasenia } = req.body;
    
    const sql = 'INSERT INTO planner (nombre, usuario, contrasenia) VALUES (?, ?, ?)';
    
    db.query(sql, [nombre, usuario, contrasenia], (error, resultado) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al guardar en la base de datos" });
        }
        console.log("¡Se guardó un nuevo Planner desde la web!");
        res.json({ mensaje: "Éxito total", id: resultado.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor unificado funcionando en http://localhost:${PORT}`);
});