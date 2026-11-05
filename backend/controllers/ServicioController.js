const db = require('../db');

const listar = async (req, res) => {
    try {
        const [servicios] = await db.query('SELECT * FROM servicios');
        res.json(servicios);
    } catch (error) {
        console.error("Error al listar servicios:", error);
        res.status(500).json({ error: "Error al traer los servicios" });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [servicios] = await db.query('SELECT * FROM servicios WHERE idServicio = ?', [id]);
        if (servicios.length === 0) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }
        res.json(servicios[0]);
    } catch (error) {
        console.error("Error al obtener servicio:", error);
        res.status(500).json({ error: "Error al obtener el servicio" });
    }
};

const crear = async (req, res) => {
    try {
        const nombre = req.body.nombre || req.body.Nombre;
        const { telefono, email, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: "El nombre del servicio es obligatorio" });
        }
        
        const [resultado] = await db.query(
            'INSERT INTO servicios (telefono, email, descripcion, nombre) VALUES (?, ?, ?, ?)', 
            [telefono || '', email || '', descripcion || '', nombre.trim()]
        );
        
        res.status(201).json({
            mensaje: "Servicio guardado correctamente",
            idServicio: resultado.insertId
        });
    } catch (error) {
        console.error("Error al guardar servicio:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const nombre = req.body.nombre || req.body.Nombre;
        const { telefono, email, descripcion } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ error: "El nombre del servicio es obligatorio" });
        }

        const [resultado] = await db.query(
            'UPDATE servicios SET nombre = ?, descripcion = ?, telefono = ?, email = ? WHERE idServicio = ?',
            [nombre.trim(), descripcion || '', telefono || '', email || '', id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró el servicio para actualizar" });
        }

        const [servicioActualizado] = await db.query('SELECT * FROM servicios WHERE idServicio = ?', [id]);
        res.json({
            mensaje: "Servicio actualizado correctamente",
            servicio: servicioActualizado[0]
        });
    } catch (error) {
        console.error("Error al actualizar servicio:", error);
        res.status(500).json({ error: "Error al actualizar servicio en la base de datos" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const [resultado] = await db.query('DELETE FROM servicios WHERE idServicio = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Servicio no encontrado" });
        }
        res.json({ mensaje: "Servicio eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar servicio:", error);
        res.status(500).json({ error: "Error al eliminar servicio" });
    }
};

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
