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
            nombre: "geru",
        }
    ]
    res.json(usuarios)
})

// 2: Definimos la función interactiva de la reunión
const iniciarReunionNovios = () => {
    // Creamos la interfaz del lector de consola
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("\n------------------- CARGA DE NOVIO A --------------------------------");

    // Empezamos preguntando por el Novio A
    rl.question(" Nombre y Apellido del Novio A: ", (novioA) => {
        rl.question(" Teléfono de contacto A: ", (telA) => {
            rl.question(" Correo Electrónico A: ", (correoA) => {

                // Guardamos en la tabla 'novioA'
                const queryA = "INSERT INTO novioA (nombreApeNovioA, telefono, correoElect) VALUES (?, ?, ?)";
                const datosA = [novioA, telA, correoA];

                db.query(queryA, datosA, (errA, resultadoA) => {
                    if (errA) {
                        console.error("\n❌ Error al guardar el Novio A:", errA.message);
                        rl.close();
                        return;
                    }

                    console.log("\n-------------------------------------------");
                    console.log(` DATOS DE NOVIO A GUARDADOS CORRECTAMENTE`);
                    console.log(`ID asignado: ${resultadoA.insertId}`);
                    console.log("-------------------------------------------");

                    // ADENTRO del éxito de A, abrimos la carga de B
                    console.log("\n------------------- CARGA DE NOVIO B --------------------------------");

                    rl.question(" Nombre y Apellido del Novio B: ", (novioB) => {
                        rl.question(" Teléfono de contacto B: ", (telB) => {
                            rl.question(" Correo Electrónico B: ", (correoB) => {

                                // Guardamos en la tabla 'novioB'
                                const queryB = "INSERT INTO novioB (nombreApeNovioB, telefono, correoElect) VALUES (?, ?, ?)";
                                const datosB = [novioB, telB, correoB];

                                db.query(queryB, datosB, (errB, resultadoB) => {
                                    if (errB) {
                                        console.error("\n❌ Error al guardar el Novio B:", errB.message);
                                    } else {
                                        console.log("\n-------------------------------------------");
                                        console.log(` DATOS DEL NOVIO B GUARDADOS CORRECTAMENTE`);
                                        console.log(`ID asignado: ${resultadoB.insertId}`);
                                        console.log("-------------------------------------------");
                                    }

                                    // Cuando ambos terminaron, cerramos la consola
                                    rl.close();
                                });
                            });
                        });
                    });

                });
            });
        });
    });
};

// 3: Ejecutamos la función interactiva al levantar el servidor
iniciarReunionNovios();

// 4: Escuchamos nuestra app
const PORT = 3001
app.listen(PORT, () => {
    console.log('escuchando en http://localhost:3001')
})
