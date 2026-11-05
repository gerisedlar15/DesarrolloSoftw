import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './listaPersonas.css';
import './modal.css';

export default function ListaPlanners() {
  const [planners, setPlanners] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [plannerEditando, setPlannerEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const cargarPlanners = () => {
    setCargando(true);
    fetch('http://localhost:3000/planners')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        if (Array.isArray(datos)) {
          setPlanners(datos);
        } else {
          setPlanners([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar planners:", err);
        setError(err.message);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarPlanners();
  }, []);

  const abrirModalEditar = (planner) => {
    setPlannerEditando({
      idPlanner: planner.idPlanner,
      nombre: planner.nombre || '',
      usuario: planner.usuario || '',
      contrasenia: '' // Vacío por seguridad; solo si escribe algo se cambia
    });
    setErrorModal('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPlannerEditando(null);
    setErrorModal('');
  };

  const manejarCambioModal = (e) => {
    setPlannerEditando({
      ...plannerEditando,
      [e.target.name]: e.target.value
    });
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();
    if (!plannerEditando.nombre.trim() || !plannerEditando.usuario.trim()) {
      setErrorModal('Nombre y usuario son obligatorios');
      return;
    }

    setGuardando(true);
    setErrorModal('');

    try {
      const respuesta = await fetch(`http://localhost:3000/planners/${plannerEditando.idPlanner}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plannerEditando)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar el planner');
      }

      const plannerActualizado = data.planner || {
        idPlanner: plannerEditando.idPlanner,
        nombre: plannerEditando.nombre,
        usuario: plannerEditando.usuario
      };

      setPlanners(prev =>
        prev.map(p => (p.idPlanner === plannerActualizado.idPlanner ? plannerActualizado : p))
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al guardar planner:", err);
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminacion = async (idPlanner) => {
    if (!confirm(`¿Seguro que querés eliminar el planner con ID: ${idPlanner}?`)) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/planners/${idPlanner}`, {
        method: 'DELETE'
      });
      const data = await respuesta.json();

      if (respuesta.ok) {
        setPlanners(prev => prev.filter(p => p.idPlanner !== idPlanner));
      } else {
        alert(data.error || "Error al eliminar planner");
      }
    } catch (err) {
      alert("Error de conexión: " + err.message);
    }
  };

  return (
    <div className="contenedor-lista">
      <h2>Lista de Planners</h2>

      <Link to="/" className="link-volver">
        ← Volver al Panel Principal
      </Link>

      {cargando && <p>Cargando planners...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && (
        <table className="tabla-personas">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planners.map((planner) => (
              <tr key={planner.idPlanner}>
                <td>{planner.idPlanner}</td>
                <td><strong>{planner.nombre}</strong></td>
                <td>@{planner.usuario}</td>
                <td>
                  <button
                    onClick={() => abrirModalEditar(planner)}
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
                    onClick={() => manejarEliminacion(planner.idPlanner)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {planners.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No hay planners registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {modalAbierto && plannerEditando && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Planner #{plannerEditando.idPlanner}</h3>
              <button className="btn-cerrar-modal" onClick={cerrarModal}>&times;</button>
            </div>

            <form onSubmit={guardarEdicion} className="modal-form">
              {errorModal && <div className="modal-error">{errorModal}</div>}

              <div className="form-grupo">
                <label>Nombre del Planner *</label>
                <input
                  type="text"
                  name="nombre"
                  value={plannerEditando.nombre}
                  onChange={manejarCambioModal}
                  required
                />
              </div>

              <div className="form-grupo">
                <label>Usuario *</label>
                <input
                  type="text"
                  name="usuario"
                  value={plannerEditando.usuario}
                  onChange={manejarCambioModal}
                  required
                />
              </div>

              <div className="form-grupo">
                <label>Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  name="contrasenia"
                  placeholder="Dejar en blanco para no cambiar..."
                  value={plannerEditando.contrasenia}
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
