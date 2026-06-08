// Importamos express y módulos necesarios
import express from "express"
import db from './conexion.js'
import readline from 'readline'

// 1: Creamos la instancia de la app
const app = express()

app.get("/", (req, res) => {
    res.send("<h1>si aparece soy una crackk/ <h1>")
})

app.get("/usuarios", (req, res) => {
    const usuarios = [
        { 
            id: 1,
            name: "geru",
        }
    ]
    res.json(usuarios)
})

// =================================================================
// FUNCIÓN OPCIÓN 1: REGISTRAR PLANNER
// =================================================================
const registrarPlanner = (lector) => {
    console.log('\n--- 📝 REGISTRO DE NUEVO PLANNER ---');
    lector.question('Ingresá NOMBRE del Planner: ', (nombrePlanner) => {
        
        const sqlPlanner = "INSERT INTO planner (nombre) VALUES (?);";
        
        db.query(sqlPlanner, [nombrePlanner], (error, resultado) => {
            if (error) {
                console.error('❌ Error al guardar el Planner:', error.message);
                lector.close();
                return;
            }
            console.log(`\n✅ ¡Éxito! El planner "${nombrePlanner}" se guardó con ID: ${resultado.insertId}\n`);
            lector.close(); 
            preguntarSiContinuar(lector);
        });
    });
};

// =================================================================
// FUNCIÓN OPCIÓN 2: REGISTRAR PERSONA/NOVIO
// =================================================================
const registrarNuevaPersonaNovio = (lector) => {
    console.log('\n--- 👤 REGISTRO DE NUEVA PERSONA (NOVIO/A) ---');
    lector.question('Ingresá NOMBRE Y APELLIDO: ', (nombreApe) => {
        lector.question('Ingresá el TELÉFONO: ', (telefono) => {
            lector.question('Ingresá el EMAIL: ', (correoElect) => {
                lector.question('Ingresá observacion: ', (observacion) => {

                    console.log('\ Conectando con mozzafiato bd...');

                    const sqlPersona = `
                        INSERT INTO persona (nombreApe, telefono, correoElect, observacion, rol) 
                        VALUES (?, ?, ?, ?, 'Novio');
                    `;

                    db.query(sqlPersona, [nombreApe, telefono, correoElect, observacion], (errorPersona, resultadoPersona) => {
                        if (errorPersona) {
                            console.error('Error al guardar la Persona:', errorPersona.message);
                            lector.close();
                            return;
                        }

                        const nuevoIdPersona = resultadoPersona.insertId;
                        console.log(`\nPersona creada con éxito. ID asignado: ${nuevoIdPersona}`);

                        const sqlNovio = `
                            INSERT INTO novio (idNovio) 
                            VALUES (?);
                        `;

                        db.query(sqlNovio, [nuevoIdPersona], (errorNovio) => {
                            if (errorNovio) {
                                console.error('Error al guardar el Novio:', errorNovio.message);
                                lector.close();
                                return;
                            }

                            console.log(`El novio "${nombreApe}" ya está guardado en ambas tablas.\n`);
                            preguntarSiContinuar(lector);
                        });
                    });
                });
            });
        });
    });
};

const preguntarSiContinuar = (lector) => {
    lector.question('¿Desea realizar otra operación? (S para Sí / N para Salir y finalizar): ', (respuesta) => {
        if (respuesta.toUpperCase() === 'S') {
            lector.close();
            mostrarMenu(); 
        } else {
            console.log('\nFinalizando...');
            lector.close(); 
        }
    });
};
//menu principal para elegir entre registrar planner o persona/novio
const mostrarMenu = () => {
    const lector = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n=======================================');
    console.log('        MENÚ DE MOZZAFIATO         ');
    console.log('=======================================');
    console.log(' 1. Crear un nuevo Planner');
    console.log(' 2. Crear una nueva Persona (Novio/a)');
    console.log('=======================================');
    
    lector.question('Elija una opción (1 o 2): ', (opcion) => {
        if (opcion === '1') {
            registrarPlanner(lector); 
        } else if (opcion === '2') {
            registrarNuevaPersonaNovio(lector); 
        } else {
            console.log('Opción no válida.intente de nuevo.');
            lector.close();
        }
    });
};


setTimeout(mostrarMenu, 3000);

// 4: Escuchamos nuestra app
const PORT = 3001
app.listen(PORT, () => {
    console.log('escuchando en http://localhost:3001')
})