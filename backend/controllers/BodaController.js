const db = require('../db');
const { enviarCorreoInvitacion } = require('../services/emailService');

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

            // 5. Traer los servicios de todas esas bodas
            const [serviciosBodas] = await db.query(`
                SELECT 
                    bs.idBoda,
                    s.idServicio,
                    s.nombre,
                    s.descripcion,
                    s.precio
                FROM boda_servicios bs
                INNER JOIN servicios s ON bs.idServicios = s.idServicio
                WHERE bs.idBoda IN (?)
            `, [bodaIds]);

            const serviciosPorBoda = {};
            for (const s of serviciosBodas) {
                if (!serviciosPorBoda[s.idBoda]) serviciosPorBoda[s.idBoda] = [];
                serviciosPorBoda[s.idBoda].push({
                    idServicio: s.idServicio,
                    nombre: s.nombre,
                    descripcion: s.descripcion,
                    precio: s.precio
                });
            }

            for (const boda of bodas) {
                boda.servicios = serviciosPorBoda[boda.idBoda] || [];
            }

            // 6. Traer los invitados de todas esas bodas
            const [invitadosBodas] = await db.query(`
                SELECT 
                    bi.idBodaInvitado,
                    bi.idBoda,
                    bi.invitacionEnviada,
                    p.idPerso,
                    p.nombreApe,
                    p.correoElect
                FROM boda_invitados bi
                INNER JOIN persona p ON bi.idPerso = p.idPerso
                WHERE bi.idBoda IN (?)
                ORDER BY p.nombreApe ASC
            `, [bodaIds]);

            const invitadosPorBoda = {};
            for (const inv of invitadosBodas) {
                if (!invitadosPorBoda[inv.idBoda]) invitadosPorBoda[inv.idBoda] = [];
                invitadosPorBoda[inv.idBoda].push({
                    idBodaInvitado: inv.idBodaInvitado,
                    idPerso: inv.idPerso,
                    nombreApe: inv.nombreApe,
                    correoElect: inv.correoElect,
                    invitacionEnviada: inv.invitacionEnviada
                });
            }

            for (const boda of bodas) {
                boda.invitados = invitadosPorBoda[boda.idBoda] || [];
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
            SELECT s.idServicio, s.nombre, s.descripcion, s.precio
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
            idPlanner, idNovio1, idNovio2, idServicio1, idServicio2,
            servicios, idServicios
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

        // Guardar Servicios (admite array 'servicios' / 'idServicios' o campos individuales idServicio1, idServicio2)
        const serviciosParaGuardar = [];
        if (Array.isArray(servicios)) {
            servicios.forEach(s => {
                const idS = typeof s === 'object' ? (s.idServicio || s.idServicios) : Number(s);
                if (idS && !serviciosParaGuardar.includes(idS)) serviciosParaGuardar.push(idS);
            });
        }
        if (Array.isArray(idServicios)) {
            idServicios.forEach(s => {
                const idS = typeof s === 'object' ? (s.idServicio || s.idServicios) : Number(s);
                if (idS && !serviciosParaGuardar.includes(idS)) serviciosParaGuardar.push(idS);
            });
        }
        if (idServicio1 && !serviciosParaGuardar.includes(Number(idServicio1))) {
            serviciosParaGuardar.push(Number(idServicio1));
        }
        if (idServicio2 && !serviciosParaGuardar.includes(Number(idServicio2))) {
            serviciosParaGuardar.push(Number(idServicio2));
        }

        for (const idS of serviciosParaGuardar) {
            await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [idBodaNueva, idS]);
        }

        // Guardar Invitados si fueron enviados
        const idPersonasInvitados = req.body.idPersonas || req.body.invitados;
        if (Array.isArray(idPersonasInvitados)) {
            for (const idP of idPersonasInvitados) {
                const idPerso = typeof idP === 'object' ? idP.idPerso : Number(idP);
                if (idPerso) {
                    await db.query(
                        'INSERT INTO boda_invitados (idBoda, idPerso, invitacionEnviada) VALUES (?, ?, 0)',
                        [idBodaNueva, idPerso]
                    );
                }
            }
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
            idPlanner, idNovio1, idNovio2, novios,
            servicios, idServicios, idServicio1, idServicio2
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

        // 3. Si se enviaron servicios para actualizar (array o idServicio1/2)
        const serviciosNuevos = [];
        if (Array.isArray(servicios)) {
            servicios.forEach(s => {
                const idS = typeof s === 'object' ? (s.idServicio || s.idServicios) : Number(s);
                if (idS && !serviciosNuevos.includes(idS)) serviciosNuevos.push(idS);
            });
        }
        if (Array.isArray(idServicios)) {
            idServicios.forEach(s => {
                const idS = typeof s === 'object' ? (s.idServicio || s.idServicios) : Number(s);
                if (idS && !serviciosNuevos.includes(idS)) serviciosNuevos.push(idS);
            });
        }
        if (idServicio1 && !serviciosNuevos.includes(Number(idServicio1))) serviciosNuevos.push(Number(idServicio1));
        if (idServicio2 && !serviciosNuevos.includes(Number(idServicio2))) serviciosNuevos.push(Number(idServicio2));

        if (serviciosNuevos.length > 0 || Array.isArray(servicios) || Array.isArray(idServicios) || idServicio1 !== undefined) {
            await db.query('DELETE FROM boda_servicios WHERE idBoda = ?', [id]);
            for (const idS of serviciosNuevos) {
                await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [id, idS]);
            }
        }

        // 4. Traer los datos actualizados
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

        const [serviciosActualizados] = await db.query(`
            SELECT s.idServicio, s.nombre, s.descripcion, s.precio
            FROM boda_servicios bs
            INNER JOIN servicios s ON bs.idServicios = s.idServicio
            WHERE bs.idBoda = ?
        `, [id]);

        const respuestaFinal = {
            ...bodaActualizada[0],
            novios: noviosActualizados,
            servicios: serviciosActualizados
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

const obtenerInvitados = async (req, res) => {
    try {
        const idBoda = req.params.idBoda || req.params.id;
        const [invitados] = await db.query(`
            SELECT 
                bi.idBodaInvitado,
                bi.idBoda,
                bi.invitacionEnviada,
                p.idPerso,
                p.nombreApe,
                p.correoElect,
                p.telefono,
                p.observacion,
                p.rol
            FROM boda_invitados bi
            INNER JOIN persona p ON bi.idPerso = p.idPerso
            WHERE bi.idBoda = ?
            ORDER BY p.nombreApe ASC
        `, [idBoda]);

        res.json(invitados);
    } catch (error) {
        console.error("Error al obtener invitados de la boda:", error);
        res.status(500).json({ error: "Error al obtener los invitados" });
    }
};

const asociarInvitados = async (req, res) => {
    try {
        const idBoda = req.params.idBoda || req.params.id;
        let ids = [];
        if (Array.isArray(req.body)) {
            ids = req.body;
        } else if (Array.isArray(req.body.idPersonas)) {
            ids = req.body.idPersonas;
        } else if (Array.isArray(req.body.invitados)) {
            ids = req.body.invitados;
        } else if (req.body.idPerso) {
            ids = [req.body.idPerso];
        }

        if (ids.length === 0) {
            return res.status(400).json({ error: "Debe enviar al menos un idPerso para asociar" });
        }

        const [existentes] = await db.query(
            'SELECT idPerso FROM boda_invitados WHERE idBoda = ?', 
            [idBoda]
        );
        const idsExistentes = new Set(existentes.map(e => e.idPerso));

        let insertados = 0;
        for (const item of ids) {
            const idPerso = typeof item === 'object' ? item.idPerso : Number(item);
            if (idPerso && !idsExistentes.has(idPerso)) {
                await db.query(
                    'INSERT INTO boda_invitados (idBoda, idPerso, invitacionEnviada) VALUES (?, ?, 0)',
                    [idBoda, idPerso]
                );
                idsExistentes.add(idPerso);
                insertados++;
            }
        }

        res.status(201).json({
            mensaje: `Se asociaron ${insertados} invitado(s) a la boda #${idBoda}`,
            insertados
        });
    } catch (error) {
        console.error("Error al asociar invitados a la boda:", error);
        res.status(500).json({ error: "Error al asociar los invitados" });
    }
};

const enviarInvitaciones = async (req, res) => {
    try {
        const idBoda = req.params.idBoda || req.params.id;

        // 1. Obtener datos de la boda
        const [bodas] = await db.query('SELECT * FROM boda WHERE idBoda = ?', [idBoda]);
        if (bodas.length === 0) {
            return res.status(404).json({ error: "Boda no encontrada" });
        }
        const boda = bodas[0];

        const [novios] = await db.query(`
            SELECT p.nombreApe 
            FROM boda_novio bn
            INNER JOIN persona p ON bn.idNovio = p.idPerso
            WHERE bn.idBoda = ?
        `, [idBoda]);
        boda.novios = novios;

        // 2. Obtener invitados (soporta envío selectivo por idPerso, o a pendientes, o forzar reenviarTodos)
        let query = `
            SELECT 
                bi.idBodaInvitado,
                bi.idBoda,
                bi.invitacionEnviada,
                p.idPerso,
                p.nombreApe,
                p.correoElect
            FROM boda_invitados bi
            INNER JOIN persona p ON bi.idPerso = p.idPerso
            WHERE bi.idBoda = ?
        `;
        let params = [idBoda];

        if (req.body && req.body.idPerso) {
            query += ' AND bi.idPerso = ?';
            params.push(req.body.idPerso);
        } else if (!req.body || !req.body.reenviarTodos) {
            query += ' AND (bi.invitacionEnviada = 0 OR bi.invitacionEnviada IS NULL)';
        }

        const [pendientes] = await db.query(query, params);

        if (pendientes.length === 0) {
            return res.json({
                mensaje: "No hay invitaciones pendientes por enviar para esta boda",
                totalPendientes: 0,
                enviados: 0,
                fallidos: 0,
                detallesEnviados: []
            });
        }

        const enviados = [];
        const fallidos = [];

        // 3. Enviar correo a cada invitado pendiente
        for (const inv of pendientes) {
            if (!inv.correoElect || !inv.correoElect.includes('@')) {
                fallidos.push({
                    idPerso: inv.idPerso,
                    nombreApe: inv.nombreApe,
                    motivo: "Correo electrónico no válido o ausente"
                });
                continue;
            }

            try {
                await enviarCorreoInvitacion({
                    correoElect: inv.correoElect,
                    nombreApe: inv.nombreApe,
                    boda,
                    urlUbicacion: req.body && req.body.urlUbicacion
                });

                // Actualizar invitacionEnviada = 1 en la base de datos
                await db.query(
                    'UPDATE boda_invitados SET invitacionEnviada = 1 WHERE idBodaInvitado = ?',
                    [inv.idBodaInvitado]
                );

                enviados.push({
                    idPerso: inv.idPerso,
                    nombreApe: inv.nombreApe,
                    correoElect: inv.correoElect
                });
            } catch (errEmail) {
                console.error(`Error enviando a ${inv.correoElect}:`, errEmail);
                fallidos.push({
                    idPerso: inv.idPerso,
                    nombreApe: inv.nombreApe,
                    motivo: errEmail.message
                });
            }
        }

        res.json({
            mensaje: `Proceso completado: ${enviados.length} invitación(es) enviada(s)${fallidos.length > 0 ? `, ${fallidos.length} con error` : ''}`,
            totalPendientes: pendientes.length,
            enviados: enviados.length,
            fallidos: fallidos.length,
            detallesEnviados: enviados,
            detallesFallidos: fallidos
        });
    } catch (error) {
        console.error("Error al enviar invitaciones de la boda:", error);
        res.status(500).json({ error: "Error interno al enviar las invitaciones" });
    }
};

const desasociarInvitado = async (req, res) => {
    try {
        const idBoda = req.params.idBoda || req.params.id;
        const { idPerso } = req.params;
        await db.query('DELETE FROM boda_invitados WHERE idBoda = ? AND idPerso = ?', [idBoda, idPerso]);
        res.json({ mensaje: "Invitado desvinculado de la boda correctamente" });
    } catch (error) {
        console.error("Error al desvincular invitado:", error);
        res.status(500).json({ error: "Error al desvincular invitado" });
    }
};

module.exports = {
    listar,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
    obtenerInvitados,
    asociarInvitados,
    enviarInvitaciones,
    desasociarInvitado
};
