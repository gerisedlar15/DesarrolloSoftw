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
    rl.question(" Nombre y Apellido del Novio A: ", (nombreApeNovioA) => {
        rl.question(" Teléfono de contacto A: ", (telefonNovioA) => {
            rl.question(" Correo Electrónico A: ", (correoElectNovioA) => {

                // Guardamos en la tabla 'novioA'
                const queryA = "INSERT INTO novioA (nombreApeNovioA, telefonoNovioA, correoElectNovioA) VALUES (?, ?, ?)";
                const datosA = [nombreApeNovioA, telefonNovioA, correoElectNovioA];

                db.query(queryA, datosA, (errA, resultadoA) => {
                    if (errA) { 
                        console.error("\n Error al guardar el Novio A:", errA.message);
                        rl.close();
                        return;
                    }
                    
                    const idNovioA = resultadoA.insertId; // CAPTURAMOS EL ID DE A
                    console.log("\n-------------------------------------------");
                    console.log(` DATOS DE NOVIO A GUARDADOS CORRECTAMENTE`);
                    console.log(`ID asignado: ${idNovioA}`);
                    console.log("-------------------------------------------");

                    // ADENTRO del éxito de A, abrimos la carga de B
                    console.log("\n------------------- CARGA DE NOVIO B --------------------------------");

                    rl.question(" Nombre y Apellido del Novio B: ", (nombreApeNovioB) => {
                        rl.question(" Teléfono de contacto B: ", (telefonoNovioB) => {
                            rl.question(" Correo Electrónico B: ", (correoElectNovioB) => {

                                // Guardamos en la tabla 'novioB'
                                const queryB = "INSERT INTO novioB (nombreApeNovioB, telefonoNovioB, correoElectNovioB) VALUES (?, ?, ?)";
                                const datosB = [nombreApeNovioB, telefonoNovioB, correoElectNovioB];

                                db.query(queryB, datosB, (errB, resultadoB) => { // 
                                    if (errB) {
                                        console.error("\n Error al guardar el Novio B:", errB.message);
                                        rl.close();
                                        return;
                                    } 
                                    
                                    const idNovioB = resultadoB.insertId; // 
                                    console.log("\n-------------------------------------------");
                                    console.log(` DATOS DEL NOVIO B GUARDADOS CORRECTAMENTE`);
                                    console.log(`ID asignado: ${idNovioB}`);
                                    console.log("-------------------------------------------");
                                    
                                    // ADENTRO del éxito de B, abrimos la carga de la Boda
                                    console.log("\n------------------- CARGA DE BODA --------------------------------");
                                    rl.question(" Fecha y Hora de Boda (AAAA-MM-DD HH:MM:SS): ", (fechaHora) => {
                                        rl.question(" Presupuesto Total ($): ", (presupuesto) => {
                                            rl.question(" Valor de la Seña ($): ", (señaBoda) => {
                                                
                                                // La query lleva NOW() directo, por lo que solo requiere 5 signos '?'
                                                const queryBoda= "INSERT INTO boda (fechaHora, fechaHoraPlanif, presupuesto, señaBoda, idNovioA, idNovioB, estado) VALUES (?, NOW(), ?, ?, ?, ?, 1)";
                                                
                                                // Pasamos exactamente las 5 variables que corresponden a los '?'
                                                const datosBoda = [fechaHora, presupuesto, señaBoda, idNovioA, idNovioB]; 

                                                db.query(queryBoda, datosBoda, (errBoda, resultadoBoda) => {
                                                    if (errBoda) {
                                                        console.error("\n Error al guardar la boda:", errBoda.message);
                                                    } else {
                                                        console.log("\n===========================================================");
                                                        console.log(`BOD CREADO Y VINCULADO EN CONSOLA CON ÉXITO!`);
                                                        console.log(`ID del Evento asignado: ${resultadoBoda.insertId}`);
                                                        console.log(`Vinculado a Novio A (ID: ${idNovioA}) y Novio B (ID: ${idNovioB})`);
                                                        console.log("===========================================================");
                                                    }
                                                    
                                                    // Cerramos la consola recién cuando guardó la boda
                                                    rl.close();
                                                });
                                            });
                                        });
                                    });

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
