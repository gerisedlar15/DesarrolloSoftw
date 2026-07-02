const formulario = document.getElementById('formularioPlanner');

// Agregamos la palabra "async" porque el envío por internet toma unos milisegundos
formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault(); // Frenamos la recarga de la página

    const inputNombre = document.getElementById('nombrePlanner');
    const nombreIngresado = inputNombre.value;

    console.log("Enviando dato al backend:", nombreIngresado);

    try {
        // Usamos fetch para llamar a la puerta de tu API
        const respuesta = await fetch('http://localhost:3001/api/planner', {
            method: 'POST', // "Quiero crear algo nuevo"
            headers: {
                'Content-Type': 'application/json' // Le avisamos que le mandamos un paquete de texto JSON
            },
            body: JSON.stringify({ nombre: nombreIngresado }) // Armamos la cajita con el nombre
        });

        // Verificamos si el backend nos dio el ok
        if (respuesta.ok) {
            const resultado = await respuesta.json();
            console.log("respondio el back", resultado);
            alert("Planner guardado. ID asignado: " + resultado.id); 
            inputNombre.value = ""; // Limpiamos el casillero para el próximo
        } else {
            alert(" Hubo un error al guardar");
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("El backend parece estar apagado.");
    }
});