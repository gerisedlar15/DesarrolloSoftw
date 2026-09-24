const db = require('../db');

const listar = async (req, res) => {
    try {
        // Pedimos todos los registros a la tabla persona
        const [personas] = await db.query('SELECT * FROM persona'); 
        res.json(personas);
    } catch (error) {
        console.error("Error en listar:", error);
        res.status(500).json({ error: "Error al traer los datos" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        // Borramos el registro usando idPerso
        await db.query('DELETE FROM persona WHERE idPerso = ?', [id]);
        res.json({ mensaje: "Persona eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminar:", error);
        res.status(500).json({ error: "Error al eliminar" });
    }
};

// Exportamos las funciones con los nombres exactos que espera tu archivo de rutas
module.exports = {
    listar,
    eliminar
};