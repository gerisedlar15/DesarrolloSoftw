//importamos express
import express from "express"
import db from './conexion.js'
//1: creamos una bella instancia de app :)
const app = express()

app.get("/", (req, res)=>{
    res.send("<h1>si aparece soy una crackk/ <h1>")
})
app.get("/usuarios",(req,res)=> {
    const usuarios= [
        { 
            id:1,
            nombre: "geru",
        }
    ]

    res.json(usuarios)
})

import readline from 'readline'; // 👈 Agregamos el lector de consola arriba de la función

const iniciarReunionNovios = () => {
    // Creamos la interfaz para preguntar y leer respuestas por consola
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("\n-------------------CARGA DE NOVIOS --------------------------------");

    rl.question("👰🤵 Nombre y Apellido del Novio A: ", (novioA) => {
        rl.question("👰🤵 Nombre y Apellido del Novio B: ", (novioB) => {
            rl.question("📞 Teléfono de contacto: ", (tel) => {
                rl.question("📧 Correo Electrónico: ", (correo) => {

                    // Armamos la query usando los datos reales que ingresaste vos
                    const query = "INSERT INTO novios (nombreApeNovioA, nombreApeNovioB, telefono, correoElect) VALUES (?, ?, ?, ?)";
                    const datos = [novioA, novioB, tel, correo];

                    // Mandamos los datos fresquitos a tu phpMyAdmin
                    db.query(query, datos, (err, resultado) => {
                        if (err) {
                            console.error("\nError al guardar en la base de datos:", err.message);
                        } else {
                            console.log("\n-------------------------------------------");
                            console.log(`🎉 ¡Boda creada con éxito en MySQL!`);
                            console.log(`🆔 ID asignado automáticamente: ${resultado.insertId}`);
                            console.log("-------------------------------------------");
                        }
                        
                        rl.close(); // Cerramos el lector de consola al terminar
                    });
                });
            });
        });
    });
}
// Ejecutamos el simulador interactivo apenas enciende el servidor
iniciarReunionNovios();

const noviosInsert = () => {
    const query = "INSERT INTO novios (nombreApeNovioA, nombreApeNovioB, telefono, correoElect) VALUES (?, ?, ?, ?)";
    const datos = ["Geraldine", "angelo", "123", "gerisedlar15@gmail.com"];

    db.query(query, datos, (err, resultado) => {
        if (err) {
            console.error("❌ Error al insertar en la tabla novios:", err.message);
            return;
        }
        console.log("🎉 ¡Novios guardados con éxito! ID generado:", resultado.insertId);
    });
};

// La llamamos acá mismo en app.js
//noviosInsert();


const PORT = 3001
//"escuchamos "nuestar app
app.listen(PORT, () => {
    console.log('escuchando en http://localhost:3001')
})

