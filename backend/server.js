const express = require('express');
const cors = require('cors');
// Importamos las rutas que ya tenés creadas
const personaRoutes = require('./routes/personaRoutes'); 
const servicioRoutes = require('./routes/servicioRoutes');

const app = express();
const port = 3000;

// Permisos de seguridad para que React se pueda conectar
app.use(cors());
app.use(express.json());

// Conectamos tus rutas a la dirección /personas
app.use('/personas', personaRoutes);
app.use('/servicios', servicioRoutes);

// Encendemos el motor
app.listen(port, () => {
    console.log(`Servidor de Mozzafiato corriendo en http://localhost:${port}`);
});