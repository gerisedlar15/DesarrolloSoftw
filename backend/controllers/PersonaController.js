const db = require('../db');

const listar = async (req, res) => {
    try {
        const [personas] = await db.query('SELECT * FROM persona');
        res.json(personas);
    } catch (error) {
        console.error("Error en listar personas:", error);
        res.status(500).json({ error: "Error al traer los datos" });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [personas] = await db.query('SELECT * FROM persona WHERE idPerso = ?', [id]);
        if (personas.length === 0) {
            return res.status(404).json({ error: "Persona no encontrada" });
        }
        res.json(personas[0]);
    } catch (error) {
        console.error("Error al obtener persona:", error);
        res.status(500).json({ error: "Error al obtener la persona" });
    }
};

const crear = async (req, res) => {
    try {
        const { nombreApe, telefono, correoElect, observacion, rol } = req.body;
        if (!nombreApe) {
            return res.status(400).json({ error: "El nombre y apellido es obligatorio" });
        }
        const [resultado] = await db.query(
            'INSERT INTO persona (nombreApe, telefono, correoElect, observacion, rol) VALUES (?, ?, ?, ?, ?)',
            [nombreApe, telefono || '', correoElect || '', observacion || '', rol || 'Invitado']
        );
        res.status(201).json({
            mensaje: "Persona creada correctamente",
            idPerso: resultado.insertId
        });
    } catch (error) {
        console.error("Error al crear persona:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreApe, telefono, correoElect, observacion, rol } = req.body;

        if (!nombreApe || !nombreApe.trim()) {
            return res.status(400).json({ error: "El nombre y apellido es un campo obligatorio" });
        }

        const [resultado] = await db.query(
            'UPDATE persona SET nombreApe = ?, telefono = ?, correoElect = ?, observacion = ?, rol = ? WHERE idPerso = ?',
            [nombreApe.trim(), telefono || '', correoElect || '', observacion || '', rol || 'Invitado', id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró la persona para actualizar" });
        }

        const [personaActualizada] = await db.query('SELECT * FROM persona WHERE idPerso = ?', [id]);
        res.json({
            mensaje: "Persona actualizada correctamente",
            persona: personaActualizada[0]
        });
    } catch (error) {
        console.error("Error al actualizar persona:", error);
        res.status(500).json({ error: "Error al actualizar la persona en la base de datos" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM persona WHERE idPerso = ?', [id]);
        res.json({ mensaje: "Persona eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminar persona:", error);
        res.status(500).json({ error: "Error al eliminar" });
    }
};

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
