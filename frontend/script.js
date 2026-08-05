
// Esta función recibe el ID del formulario y a qué URL del servidor debe mandar los datos
function configurarFormulario(idFormulario, urlDestino) {
    const form = document.getElementById(idFormulario);
    
    // PROGRAMACIÓN DEFENSIVA: Si la pantalla actual no tiene este formulario, la función se detiene y no hace nada. (Evita el error Null).
    if (!form) return; 

    // Si el formulario existe, nos preparamos para escuchar el clic en "Guardar"
    form.addEventListener('submit', async (evento) => {
        evento.preventDefault(); // Evita que la página se recargue

        // Absorbe todos los inputs que tengan el atributo "name"
        const formData = new FormData(evento.target);
        
        //  Convierte lo que absorbió en un objeto JSON ordenadito
        const datosJSON = Object.fromEntries(formData.entries());

        try {
            // Viaja al servidor (backend) y le entrega el paquete
            const respuesta = await fetch(urlDestino, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosJSON) 
            });

            const resultado = await respuesta.json();

            // RESPUESTA DEL SERVIDOR
            if (respuesta.ok) {
                alert('Datos guardados con éxito en la Base de Datos!');
                form.reset(); // Vaciamos las cajas de texto automáticamente
            } else {
                alert('Error del servidor: ' + resultado.error);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}

// ==========================================
// Aquí le pasamos los datos a la fábrica. No importa en qué página estés, 
// el script sabrá cuál activar gracias al "if(!form) return" de arriba.RECORDAR! CADA VEZ QUE REALICE UN NUEVO FORMULARIO, DEBO AGREGARLO AQUÍ ABAJO PARA QUE SE ACTIVE AUTOMÁTICAMENTE

// Activamos el de Planner (Apuntando a la ventanilla /api/planner)
configurarFormulario('formularioPlanner', 'http://localhost:3000/api/planner');

// Activamos el de Persona (Apuntando a la ventanilla /api/persona)
configurarFormulario('formularioPersona', 'http://localhost:3000/api/persona');