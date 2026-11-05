const db = require('../db');

const listar = async (req, res) => {
    try {
        const [planners] = await db.query('SELECT idPlanner, nombre, usuario FROM planner');
        res.json(planners);
    } catch (error) {
        console.error("Error al listar planners:", error);
        res.status(500).json({ error: "Error al traer los planners" });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [planners] = await db.query('SELECT idPlanner, nombre, usuario FROM planner WHERE idPlanner = ?', [id]);
        if (planners.length === 0) {
            return res.status(404).json({ error: "Planner no encontrado" });
        }
        res.json(planners[0]);
    } catch (error) {
        console.error("Error al obtener planner:", error);
        res.status(500).json({ error: "Error al obtener el planner" });
    }
};

const crear = async (req, res) => {
    try {
        const nombre = req.body.nombre || req.body.Nombre;
        const { usuario, contrasenia } = req.body;

        if (!nombre || !usuario || !contrasenia) {
            return res.status(400).json({ error: "Todos los campos (nombre, usuario, contraseña) son obligatorios" });
        }
        
        const [resultado] = await db.query(
            'INSERT INTO planner (nombre, usuario, contrasenia) VALUES (?, ?, ?)', 
            [nombre.trim(), usuario.trim(), contrasenia]
        );
        
        res.status(201).json({
            mensaje: "Planner guardado correctamente",
            idPlanner: resultado.insertId
        });
    } catch (error) {
        console.error("Error al guardar planner:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El nombre de usuario ya está registrado" });
        }
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const nombre = req.body.nombre || req.body.Nombre;
        const { usuario, contrasenia } = req.body;

        if (!nombre || !nombre.trim() || !usuario || !usuario.trim()) {
            return res.status(400).json({ error: "Nombre y usuario son campos obligatorios" });
        }

        let query = '';
        let params = [];

        if (contrasenia && contrasenia.trim() !== '') {
            query = 'UPDATE planner SET nombre = ?, usuario = ?, contrasenia = ? WHERE idPlanner = ?';
            params = [nombre.trim(), usuario.trim(), contrasenia, id];
        } else {
            query = 'UPDATE planner SET nombre = ?, usuario = ? WHERE idPlanner = ?';
            params = [nombre.trim(), usuario.trim(), id];
        }

        const [resultado] = await db.query(query, params);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró el planner para actualizar" });
        }

        const [plannerActualizado] = await db.query('SELECT idPlanner, nombre, usuario FROM planner WHERE idPlanner = ?', [id]);
        res.json({
            mensaje: "Planner actualizado correctamente",
            planner: plannerActualizado[0]
        });
    } catch (error) {
        console.error("Error al actualizar planner:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El nombre de usuario ya está en uso por otro planner" });
        }
        res.status(500).json({ error: "Error al actualizar planner en la base de datos" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const [resultado] = await db.query('DELETE FROM planner WHERE idPlanner = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Planner no encontrado" });
        }
        res.json({ mensaje: "Planner eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar planner:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ error: "No se puede eliminar el planner porque tiene bodas asignadas" });
        }
        res.status(500).json({ error: "Error al eliminar planner" });
    }
};

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
