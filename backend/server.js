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

// Registro del planner desde la web
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
// Registro del persona desde la web
app.post('/api/persona', (req, res) => {
    // 1. Extraemos los 4 datos exactos usando los mismos nombres (name) del HTML
    const { nombreApe, telefono, correoElect, observacion } = req.body;
    
    // 2. Preparamos la orden para MySQL (asumiendo que crearás una tabla llamada 'persona')
    const sql = 'INSERT INTO persona (nombreApe, telefono, correoElect, observacion) VALUES (?, ?, ?, ?)';
    
    // 3. Ejecutamos la orden enviando los datos en el orden de los signos de interrogación (?)
    db.query(sql, [nombreApe, telefono, correoElect, observacion], (error, resultado) => {
        if (error) {
            console.error("Error al insertar persona:", error);
            return res.status(500).json({ error: "Error al guardar la persona" });
        }
        console.log("¡Se guardó una nueva Persona!");
        res.json({ mensaje: "Persona guardada correctamente", id: resultado.insertId });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor unificado funcionando en http://localhost:${PORT}`);
});