const db = require('../db');

const listar = async (req, res) => {
    try {
        // 1. Traer bodas que tengan al menos un novio asignado
        const [bodas] = await db.query(`
            SELECT 
                b.idBoda,
                b.fechaHoraPlanif,
                b.presupuesto,
                b.seniaBoda,
                b.estadoBoda,
                b.idPlanner,
                pl.nombre AS nombrePlanner
            FROM boda b
            LEFT JOIN planner pl ON b.idPlanner = pl.idPlanner
            WHERE EXISTS (SELECT 1 FROM boda_novio bn WHERE bn.idBoda = b.idBoda)
            ORDER BY b.fechaHoraPlanif DESC
        `);

        // 2. Traer los novios de todas esas bodas (JOIN directo a persona)
        if (bodas.length > 0) {
            const bodaIds = bodas.map(b => b.idBoda);
            const [novios] = await db.query(`
                SELECT 
                    bn.idBoda,
                    p.idPerso,
                    p.nombreApe,
                    p.telefono,
                    p.correoElect
                FROM boda_novio bn
                INNER JOIN persona p ON bn.idNovio = p.idPerso
                WHERE bn.idBoda IN (?)
            `, [bodaIds]);

            // 3. Agrupar novios por boda
            const noviosPorBoda = {};
            for (const n of novios) {
                if (!noviosPorBoda[n.idBoda]) noviosPorBoda[n.idBoda] = [];
                noviosPorBoda[n.idBoda].push({
                    idPerso: n.idPerso,
                    nombreApe: n.nombreApe,
                    telefono: n.telefono,
                    correoElect: n.correoElect
                });
            }

            // 4. Adjuntar array de novios a cada boda
            for (const boda of bodas) {
                boda.novios = noviosPorBoda[boda.idBoda] || [];
            }
        }

        res.json(bodas);
    } catch (error) {
        console.error("Error al listar bodas:", error);
        res.status(500).json({ error: "Error al traer las bodas" });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const [bodas] = await db.query(`
            SELECT 
                b.idBoda,
                b.fechaHoraPlanif,
                b.presupuesto,
                b.seniaBoda,
                b.estadoBoda,
                b.idPlanner,
                pl.nombre AS nombrePlanner
            FROM boda b
            LEFT JOIN planner pl ON b.idPlanner = pl.idPlanner
            WHERE b.idBoda = ?
        `, [id]);

        if (bodas.length === 0) {
            return res.status(404).json({ error: "Boda no encontrada" });
        }

        const boda = bodas[0];

        // Obtener novios
        const [novios] = await db.query(`
            SELECT 
                p.idPerso,
                p.nombreApe,
                p.telefono,
                p.correoElect
            FROM boda_novio bn
            INNER JOIN persona p ON bn.idNovio = p.idPerso
            WHERE bn.idBoda = ?
        `, [id]);
        boda.novios = novios;

        // Obtener servicios asignados si hubiere
        const [servicios] = await db.query(`
            SELECT s.idServicio, s.nombre, s.descripcion
            FROM boda_servicios bs
            INNER JOIN servicios s ON bs.idServicios = s.idServicio
            WHERE bs.idBoda = ?
        `, [id]);
        boda.servicios = servicios;

        res.json(boda);
    } catch (error) {
        console.error("Error al obtener boda:", error);
        res.status(500).json({ error: "Error al obtener la boda" });
    }
};

const crear = async (req, res) => {
    try {
        const { 
            fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, 
            idPlanner, idNovio1, idNovio2, idServicio1, idServicio2 
        } = req.body;

        if (!fechaHoraPlanif || presupuesto === undefined || !estadoBoda || !idPlanner) {
            return res.status(400).json({ error: "Fecha, presupuesto, estado y planner son obligatorios" });
        }
        
        // 1. Guardar boda
        const [resultadoBoda] = await db.query(
            'INSERT INTO boda (fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, idPlanner) VALUES (?, ?, ?, ?, ?)', 
            [fechaHoraPlanif, presupuesto, seniaBoda || 0, estadoBoda, idPlanner]
        );
        
        const idBodaNueva = resultadoBoda.insertId;

        // Guardar Novios (FK directa a persona)
        if (idNovio1) {
            await db.query('INSERT INTO boda_novio (idBoda, idNovio) VALUES (?, ?)', [idBodaNueva, Number(idNovio1)]);
        }
        if (idNovio2) {
            await db.query('INSERT INTO boda_novio (idBoda, idNovio) VALUES (?, ?)', [idBodaNueva, Number(idNovio2)]);
        }

        // Guardar Servicios
        if (idServicio1) {
            await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [idBodaNueva, Number(idServicio1)]);
        }
        if (idServicio2) {
            await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [idBodaNueva, Number(idServicio2)]);
        }
        
        res.status(201).json({
            mensaje: "Boda guardada correctamente",
            idBoda: idBodaNueva
        });
    } catch (error) {
        console.error("Error al guardar en MySQL:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, 
            idPlanner, idNovio1, idNovio2, novios 
        } = req.body;

        if (!fechaHoraPlanif || presupuesto === undefined || !estadoBoda || !idPlanner) {
            return res.status(400).json({ error: "Fecha, presupuesto, estado y planner son obligatorios" });
        }

        // 1. Actualizar tabla boda
        const [resultado] = await db.query(
            'UPDATE boda SET fechaHoraPlanif = ?, presupuesto = ?, seniaBoda = ?, estadoBoda = ?, idPlanner = ? WHERE idBoda = ?',
            [fechaHoraPlanif, Number(presupuesto), Number(seniaBoda || 0), estadoBoda, Number(idPlanner), id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró la boda para actualizar" });
        }

        // 2. Si se mandaron novios nuevos (sea por idNovio1/idNovio2 o array de IDs)
        const noviosNuevos = [];
        if (idNovio1) noviosNuevos.push(Number(idNovio1));
        if (idNovio2) noviosNuevos.push(Number(idNovio2));
        if (Array.isArray(novios) && novios.length > 0) {
            novios.forEach(n => {
                const idN = typeof n === 'object' ? (n.idPerso || n.idNovio) : Number(n);
                if (idN && !noviosNuevos.includes(idN)) noviosNuevos.push(idN);
            });
        }

        if (noviosNuevos.length > 0) {
            await db.query('DELETE FROM boda_novio WHERE idBoda = ?', [id]);
            for (const idN of noviosNuevos) {
                await db.query('INSERT INTO boda_novio (idBoda, idNovio) VALUES (?, ?)', [id, idN]);
            }
        }

        // 3. Traer los datos actualizados
        const [bodaActualizada] = await db.query(`
            SELECT 
                b.idBoda,
                b.fechaHoraPlanif,
                b.presupuesto,
                b.seniaBoda,
                b.estadoBoda,
                b.idPlanner,
                pl.nombre AS nombrePlanner
            FROM boda b
            LEFT JOIN planner pl ON b.idPlanner = pl.idPlanner
            WHERE b.idBoda = ?
        `, [id]);

        const [noviosActualizados] = await db.query(`
            SELECT 
                p.idPerso,
                p.nombreApe,
                p.telefono,
                p.correoElect
            FROM boda_novio bn
            INNER JOIN persona p ON bn.idNovio = p.idPerso
            WHERE bn.idBoda = ?
        `, [id]);

        const respuestaFinal = {
            ...bodaActualizada[0],
            novios: noviosActualizados
        };

        res.json({
            mensaje: "Boda actualizada correctamente",
            boda: respuestaFinal
        });
    } catch (error) {
        console.error("Error al actualizar boda:", error);
        res.status(500).json({ error: "Error al actualizar la boda en la base de datos" });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const [resultado] = await db.query('DELETE FROM boda WHERE idBoda = ?', [id]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Boda no encontrada" });
        }
        res.json({ mensaje: "Boda eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar boda:", error);
        res.status(500).json({ error: "Error al eliminar la boda" });
    }
};

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};
