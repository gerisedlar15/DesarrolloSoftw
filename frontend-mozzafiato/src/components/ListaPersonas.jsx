import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './listaPersonas.css';
import './modal.css';

export function ListaPersonas() {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [personaEditando, setPersonaEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const cargarPersonas = () => {
    setCargando(true);
    fetch('http://localhost:3000/personas')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        if (Array.isArray(datos)) {
          setPersonas(datos);
        } else {
          setPersonas([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar personas:", err);
        setError(err.message);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  // Abrir modal y precargar los datos actuales
  const abrirModalEditar = (persona) => {
    setPersonaEditando({
      idPerso: persona.idPerso,
      nombreApe: persona.nombreApe || '',
      telefono: persona.telefono || '',
      correoElect: persona.correoElect || '',
      observacion: persona.observacion || '',
      rol: persona.rol || 'Invitado'
    });
    setErrorModal('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPersonaEditando(null);
    setErrorModal('');
  };

  const manejarCambioModal = (e) => {
    setPersonaEditando({
      ...personaEditando,
      [e.target.name]: e.target.value
    });
  };

  // Enviar cambios con PUT y actualizar el estado local
  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!personaEditando.nombreApe.trim()) {
      setErrorModal('El nombre y apellido es obligatorio');
      return;
    }

    setGuardando(true);
    setErrorModal('');

    try {
      const respuesta = await fetch(`http://localhost:3000/personas/${personaEditando.idPerso}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaEditando)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar la persona');
      }

      // Actualizar el estado local sin recargar la página
      const personaActualizada = data.persona || personaEditando;
      setPersonas(prev =>
        prev.map(p => (p.idPerso === personaActualizada.idPerso ? personaActualizada : p))
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al guardar persona:", err);
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminacion = async (id) => {
    if (!confirm("¿Seguro que querés eliminar el registro con ID: " + id + "?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/personas/${id}`, {
        method: 'DELETE',
      });

      if (respuesta.ok) {
        setPersonas(prev => prev.filter(p => p.idPerso !== id));
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

      {cargando && <p>Cargando personas...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && (
        <table className="tabla-personas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre y Apellido</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Observación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.idPerso}>
                <td>{persona.idPerso}</td>
                <td><strong>{persona.nombreApe}</strong></td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: persona.rol === 'Novio' ? '#fde2e4' : '#e2ece9',
                    color: persona.rol === 'Novio' ? '#9d0208' : '#005f73'
                  }}>
                    {persona.rol || 'Invitado'}
                  </span>
                </td>
                <td>{persona.telefono || '—'}</td>
                <td>{persona.correoElect || '—'}</td>
                <td>{persona.observacion || '—'}</td>
                <td>
                  <button
                    onClick={() => abrirModalEditar(persona)}
                    style={{
                      backgroundColor: '#d4a373',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      marginRight: '8px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => manejarEliminacion(persona.idPerso)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {personas.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No hay personas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {modalAbierto && personaEditando && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Persona #{personaEditando.idPerso}</h3>
              <button className="btn-cerrar-modal" onClick={cerrarModal}>&times;</button>
            </div>

            <form onSubmit={guardarEdicion} className="modal-form">
              {errorModal && <div className="modal-error">{errorModal}</div>}

              <div className="form-grupo">
                <label>Nombre y Apellido *</label>
                <input
                  type="text"
                  name="nombreApe"
                  value={personaEditando.nombreApe}
                  onChange={manejarCambioModal}
                  required
                />
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={personaEditando.rol}
                    onChange={manejarCambioModal}
                  >
                    <option value="Invitado">Invitado</option>
                    <option value="Novio">Novio</option>
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={personaEditando.telefono}
                    onChange={manejarCambioModal}
                  />
                </div>
              </div>

              <div className="form-grupo">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correoElect"
                  value={personaEditando.correoElect}
                  onChange={manejarCambioModal}
                />
              </div>

              <div className="form-grupo">
                <label>Observación</label>
                <textarea
                  name="observacion"
                  rows="3"
                  value={personaEditando.observacion}
                  onChange={manejarCambioModal}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ListaPersonas;
