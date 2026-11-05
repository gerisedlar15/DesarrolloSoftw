import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './listaPersonas.css';
import './modal.css';

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const cargarServicios = () => {
    setCargando(true);
    fetch('http://localhost:3000/servicios')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        if (Array.isArray(datos)) {
          setServicios(datos);
        } else {
          setServicios([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar servicios:", err);
        setError(err.message);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const abrirModalEditar = (servicio) => {
    setServicioEditando({
      idServicio: servicio.idServicio,
      nombre: servicio.nombre || '',
      descripcion: servicio.descripcion || '',
      telefono: servicio.telefono || '',
      email: servicio.email || ''
    });
    setErrorModal('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setServicioEditando(null);
    setErrorModal('');
  };

  const manejarCambioModal = (e) => {
    setServicioEditando({
      ...servicioEditando,
      [e.target.name]: e.target.value
    });
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!servicioEditando.nombre.trim()) {
      setErrorModal('El nombre del servicio es obligatorio');
      return;
    }

    setGuardando(true);
    setErrorModal('');

    try {
      const respuesta = await fetch(`http://localhost:3000/servicios/${servicioEditando.idServicio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicioEditando)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar el servicio');
      }

      const servicioActualizado = data.servicio || servicioEditando;

      setServicios(prev =>
        prev.map(s => (s.idServicio === servicioActualizado.idServicio ? servicioActualizado : s))
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminacion = async (idServicio) => {
    if (!confirm(`¿Seguro que querés eliminar el servicio con ID: ${idServicio}?`)) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/servicios/${idServicio}`, {
        method: 'DELETE'
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        setServicios(prev => prev.filter(s => s.idServicio !== idServicio));
      } else {
        alert(data.error || "Error al eliminar servicio");
      }
    } catch (err) {
      alert("Error de conexión: " + err.message);
    }
  };

  return (
    <div className="contenedor-lista">
      <h2>Lista de Servicios</h2>

      <Link to="/" className="link-volver">
        ← Volver al Panel Principal
      </Link>

      {cargando && <p>Cargando servicios...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && (
        <table className="tabla-personas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.idServicio}>
                <td>{servicio.idServicio}</td>
                <td><strong>{servicio.nombre}</strong></td>
                <td>{servicio.descripcion || '—'}</td>
                <td>{servicio.telefono || '—'}</td>
                <td>{servicio.email || '—'}</td>
                <td>
                  <button
                    onClick={() => abrirModalEditar(servicio)}
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
                    onClick={() => manejarEliminacion(servicio.idServicio)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {servicios.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No hay servicios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {modalAbierto && servicioEditando && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Servicio #{servicioEditando.idServicio}</h3>
              <button className="btn-cerrar-modal" onClick={cerrarModal}>&times;</button>
            </div>

            <form onSubmit={guardarEdicion} className="modal-form">
              {errorModal && <div className="modal-error">{errorModal}</div>}

              <div className="form-grupo">
                <label>Nombre del Servicio *</label>
                <input
                  type="text"
                  name="nombre"
                  value={servicioEditando.nombre}
                  onChange={manejarCambioModal}
                  required
                />
              </div>

              <div className="form-grupo">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={servicioEditando.descripcion}
                  onChange={manejarCambioModal}
                />
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={servicioEditando.telefono}
                    onChange={manejarCambioModal}
                  />
                </div>

                <div className="form-grupo">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={servicioEditando.email}
                    onChange={manejarCambioModal}
                  />
                </div>
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
