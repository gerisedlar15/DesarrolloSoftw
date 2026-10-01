const db = require('../db');

const crear = async (req, res) => {
    try {
        const { 
            fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, 
            idPlanner, idNovio1, idNovio2, idServicio1, idServicio2 
        } = req.body;
        
        // 1. Guardar boda
        const [resultadoBoda] = await db.query(
            'INSERT INTO boda (fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, idPlanner) VALUES (?, ?, ?, ?, ?)', 
            [fechaHoraPlanif, presupuesto, seniaBoda, estadoBoda, idPlanner]
        );
        
        const idBodaNueva = resultadoBoda.insertId;

        // guardar Novios
        if (idNovio1) {
            await db.query('INSERT INTO boda_novio (idBoda, idNovio) VALUES (?, ?)', [idBodaNueva, Number(idNovio1)]);
        }
        if (idNovio2) {
            await db.query('INSERT INTO boda_novio (idBoda, idNovio) VALUES (?, ?)', [idBodaNueva, Number(idNovio2)]);
        }

        // gardar Servicios
        if (idServicio1) {
            await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [idBodaNueva, Number(idServicio1)]);
        }
        if (idServicio2) {
            await db.query('INSERT INTO boda_servicios (idBoda, idServicios) VALUES (?, ?)', [idBodaNueva, Number(idServicio2)]);
        }
        
        res.status(201).json({ mensaje: "Todo guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar en MySQL:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
};

module.exports = { crear };