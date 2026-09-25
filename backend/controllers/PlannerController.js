const db = require('../db');

const crear = async (req, res) => {
    try {
        // DETECTOR: Imprime en la terminal qué datos llegaron exactamente
        console.log("Datos recibidos desde React:", req.body);

        const { nombre, usuario, contrasenia } = req.body;
        
        await db.query(
            'INSERT INTO planner (nombre, usuario, contrasenia) VALUES (?, ?, ?)', 
            [nombre, usuario, contrasenia]
        );
        
        res.status(201).json({ mensaje: "Planner guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar planner:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

module.exports = { crear };