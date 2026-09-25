const express = require('express');
const cors = require('cors');

// Importamos las rutas
const personaRoutes = require('./routes/personaRoutes'); 
const servicioRoutes = require('./routes/servicioRoutes');
const plannerRoutes = require('./routes/plannerRoutes'); // <-- Acá traemos el planner

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectamos las rutas
app.use('/personas', personaRoutes);
app.use('/servicios', servicioRoutes);
app.use('/planners', plannerRoutes); // <-- Acá habilitamos /planners

app.listen(port, () => {
    console.log(`Servidor de Mozzafiato corriendo en http://localhost:${port}`);
});