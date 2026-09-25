const db = require('../db');

const crear = async (req, res) => {
    try {
        // Extraemos "Nombre" con mayúscula porque así está escrito en el estado de React
        const { Nombre, telefono, email, descripcion } = req.body;
        
        // En la consulta SQL usamos "nombre" con minúscula para tu tabla,
        // pero le pasamos el valor de la variable "Nombre"
        await db.query(
            'INSERT INTO servicios (telefono, email, descripcion, nombre) VALUES (?, ?, ?, ?)', 
            [telefono, email, descripcion, Nombre]
        );
        
        res.status(201).json({ mensaje: "Servicio guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar servicio:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

module.exports = {
    crear
};