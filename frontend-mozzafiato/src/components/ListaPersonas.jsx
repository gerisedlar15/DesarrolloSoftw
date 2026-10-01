import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ListaPersonas.css';

export function ListaPersonas() {
  const [personas, setPersonas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/personas')
      .then(respuesta => respuesta.json())
      .then(datos => {
        // ESCUDO: Solo actualizamos si "datos" es realmente una lista
        if (Array.isArray(datos)) {
          setPersonas(datos);
        } else {
          console.error("El backend no envió una lista:", datos);
          setPersonas([]); // Lo dejamos vacío para que no rompa la pantalla
        }
      })
      .catch(error => console.error("Hubo un error al cargar:", error));
  }, []);

  const manejarEliminacion = async (id) => {
    if (!confirm("¿Seguro que querés eliminar el registro con ID: " + id + "?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/personas/${id}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        setPersonas(personas.filter(persona => persona.idPerso !== id));
      } else {
        alert("Error al eliminar en el backend");
      }
    } catch (error) {
      alert("Error de comunicación con el servidor: " + error.message);
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
            <th>Acciones</th>
          </tr>
        </thead>
        
        <tbody>
          {/* ESCUDO 2: Solo ejecutamos el .map si personas es una lista válida */}
          {Array.isArray(personas) && personas.map((persona) => (
            <tr key={persona.idPerso}>
              <td>{persona.nombreApe}</td>
              <td>{persona.telefono}</td>
              <td>{persona.correoElect}</td>
              <td>
                <button
                  onClick={() => navigate(`/editar/${persona.idPerso}`)}
                  style={{
                    backgroundColor: '#d4a373',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    marginRight: '10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Modificar
                </button>

                <button
                  onClick={() => manejarEliminacion(persona.idPerso)}
                  className="btn-eliminar"
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}