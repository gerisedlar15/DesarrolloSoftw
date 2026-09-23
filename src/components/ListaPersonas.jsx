import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListaPersonas.css';

export function ListaPersonas() {
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    fetch('http://localhost/backend-mozzafiato/listarPersonas.php')
      .then(respuesta => respuesta.json())
      .then(datos => setPersonas(datos))
      .catch(error => console.error("Hubo un error al cargar:", error));
  }, []);

 const manejarEliminacion = async (id) => {
    // Agregamos el ID en el mensaje para confirmar que React lo está capturando bien
    if (!confirm("¿Seguro que querés eliminar el registro con ID: " + id + "?")) return;

    try {
      const respuesta = await fetch('http://localhost/backend-mozzafiato/eliminarPersona.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      });

      // Leemos el texto crudo que nos devuelve PHP para ver los errores reales
      const textoRespuesta = await respuesta.text(); 

      if (respuesta.ok) {
        // Borrado exitoso
        setPersonas(personas.filter(persona => persona.idPerso !== id));
      } else {
        // Si falla en el backend, te muestra el mensaje exacto
        alert("Error del backend: " + textoRespuesta); 
      }
    } catch (error) {
      // Si el XAMPP está apagado o hay bloqueo CORS, te muestra esto
      alert("Error de comunicación con XAMPP: " + error.message);
    }
  };
  return (
    <div className="contenedor-lista">
      <h2>Lista de Personas</h2>
      
      <Link to="/" className="link-volver">
        ← Volver al Panel Principal
      </Link>

  
      <table className="tabla-personas">
        <thead>
          <tr>
            <th>Nombre y Apellido</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Acción</th>
          </tr>
        </thead>
        
        {/* ACÁ ESTÁ EL CAMBIO: El sello automático (.map) */}
       <tbody>
          {personas.length > 0 ? (
            personas.map((persona) => (
              <tr key={persona.idPerso}>
                <td>{persona.nombreApe}</td>
                <td>{persona.telefono}</td>
                <td>{persona.correoElect}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => console.log('Modificar ID:', persona.idPerso)} 
                      className="btn-modificar"
                    >
                      Modificar
                    </button>
                    <button 
                      onClick={() => manejarEliminacion(persona.idPerso)} 
                      className="btn-deshabilitar"
                    >
                      Deshabilitar
                    </button>
                  </div>
                </td>
              </tr>
            ))
            ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>
                No hay personas registradas o cargando datos...
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}