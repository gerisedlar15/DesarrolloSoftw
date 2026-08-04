const formulario = document.getElementById('formularioPlanner');

// Agregamos la palabra "async" porque el envío por internet toma unos milisegundos
formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault(); // Frenamos la recarga de la página

    const inputNombre = document.getElementById('nombre');
    const nombreIngresado = inputNombre.value;
    const inputUsuario = document.getElementById('usuario');
    const usuarioIngresado = inputUsuario.value;
    const inputContrasenia = document.getElementById('contrasenia');
    const contraseniaIngresada = inputContrasenia.value;

    console.log("Enviando dato al backend:", nombreIngresado);
    console.log("Enviando dato al backend:", usuarioIngresado);
    console.log("Enviando dato al backend:", contraseniaIngresada);
    

    try {
        // Usamos fetch para llamar a la puerta de tu API
        const respuesta = await fetch('http://localhost:3000/api/planner', {
            method: 'POST', // "Quiero crear algo nuevo"
            headers: {
                'Content-Type': 'application/json' // Le avisamos que le mandamos un paquete de texto JSON
            },
            body: JSON.stringify({ nombre: nombreIngresado, usuario: usuarioIngresado, contrasenia: contraseniaIngresada }) // Armamos la cajita con los datos
        });

        // Verificamos si el backend nos dio el ok
        if (respuesta.ok) {
            const resultado = await respuesta.json();
            console.log("respondio el back", resultado);
            alert("Planner guardado. ID asignado: " + resultado.id); 
            inputNombre.value = ""; // Limpiamos el casillero para el próximo
            inputUsuario.value = ""; // Limpiamos el casillero para el próximo
            inputContrasenia.value = ""; // Limpiamos el casillero para el próximo
        } else {
            alert(" Hubo un error al guardar");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("El backend parece estar apagado.");
    }
});