const db = require('../db');

const crear = async (req, res) => {
    try {
        // DETECTOR: Imprime en la terminal qué datos llegaron exactamente
        console.log("Datos recibidos desde React:", req.body);

        const nombre = req.body.nombre || req.body.Nombre;
        const { usuario, contrasenia } = req.body;

        if (!nombre || !usuario || !contrasenia) {
            return res.status(400).json({ error: "Todos los campos (nombre, usuario, contraseña) son obligatorios" });
        }
        
        await db.query(
            'INSERT INTO planner (nombre, usuario, contrasenia) VALUES (?, ?, ?)', 
            [nombre, usuario, contrasenia]
        );
        
        res.status(201).json({ mensaje: "Planner guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar planner:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
        }
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

module.exports = { crear };