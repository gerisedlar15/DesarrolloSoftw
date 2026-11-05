const express = require('express');
const cors = require('cors');

// Importamos las rutas
const personaRoutes = require('./routes/personaRoutes'); 
const servicioRoutes = require('./routes/servicioRoutes');
const plannerRoutes = require('./routes/plannerRoutes'); 
const bodaRoutes = require('./routes/bodaRoutes'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectamos las rutas (admitiendo tanto formato directo como con prefijo /api)
app.use('/personas', personaRoutes);
app.use('/api/personas', personaRoutes);

app.use('/servicios', servicioRoutes);
app.use('/api/servicios', servicioRoutes);

app.use('/planners', plannerRoutes);
app.use('/api/planners', plannerRoutes);

app.use('/bodas', bodaRoutes);
app.use('/api/bodas', bodaRoutes);

app.listen(port, () => {
    console.log(`Servidor de Mozzafiato corriendo en http://localhost:${port}`);
});
