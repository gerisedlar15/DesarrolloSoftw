import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './listaBodas.css';
import './modal.css';

export default function ListaBodas() {
  const [bodas, setBodas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Opciones para los selects del modal
  const [plannersDisponibles, setPlannersDisponibles] = useState([]);
  const [personasDisponibles, setPersonasDisponibles] = useState([]);

  // Estado para el modal de edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bodaEditando, setBodaEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState('');

  const cargarBodas = () => {
    setCargando(true);
    fetch('http://localhost:3000/bodas')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error(`Error del servidor: ${respuesta.status}`);
        return respuesta.json();
      })
      .then(datos => {
        if (Array.isArray(datos)) {
          setBodas(datos);
        } else {
          setBodas([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar bodas:", err);
        setError(err.message);
      })
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarBodas();

    // Cargar planners y personas para los dropdowns del modal de edición
    fetch('http://localhost:3000/planners')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPlannersDisponibles(d); })
      .catch(() => {});

    fetch('http://localhost:3000/personas')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPersonasDisponibles(d); })
      .catch(() => {});
  }, []);

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatearHora = (fechaISO) => {
    if (!fechaISO) return '—';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatearMoneda = (valor) => {
    if (valor == null) return '—';
    return Number(valor).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatearNovios = (novios) => {
    if (!Array.isArray(novios) || novios.length === 0) return 'Sin novios asignados';
    return novios.map(n => n.nombreApe).join(' y ');
  };

  const badgeEstado = (estado) => {
    const clases = {
      'Planificada': 'badge-planificada',
      'En proceso': 'badge-en-proceso',
      'Finalizada': 'badge-finalizada',
      'Cancelada': 'badge-cancelada',
    };
    return clases[estado] || 'badge-default';
  };

  // Convertir fecha ISO a formato requerido por <input type="datetime-local" />: "YYYY-MM-DDTHH:mm"
  const aFormatoDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const pad = (n) => String(n).padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    } catch {
      return '';
    }
  };

  // Abrir modal con datos precargados
  const abrirModalEditar = (boda) => {
    const novio1 = (boda.novios && boda.novios[0]) ? boda.novios[0].idPerso : '';
    const novio2 = (boda.novios && boda.novios[1]) ? boda.novios[1].idPerso : '';

    setBodaEditando({
      idBoda: boda.idBoda,
      fechaHoraPlanif: aFormatoDateTimeLocal(boda.fechaHoraPlanif),
      presupuesto: boda.presupuesto || 0,
      seniaBoda: boda.seniaBoda || 0,
      estadoBoda: boda.estadoBoda || 'Planificada',
      idPlanner: boda.idPlanner || '',
      idNovio1: novio1,
      idNovio2: novio2
    });
    setErrorModal('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setBodaEditando(null);
    setErrorModal('');
  };

  const manejarCambioModal = (e) => {
    setBodaEditando({
      ...bodaEditando,
      [e.target.name]: e.target.value
    });
  };

  // Guardar cambios con PUT y actualizar el estado local de React
  const guardarEdicionBoda = async (e) => {
    e.preventDefault();
    if (!bodaEditando.fechaHoraPlanif || !bodaEditando.presupuesto || !bodaEditando.idPlanner) {
      setErrorModal('Fecha, presupuesto y planner son obligatorios');
      return;
    }

    setGuardando(true);
    setErrorModal('');

    try {
      const respuesta = await fetch(`http://localhost:3000/bodas/${bodaEditando.idBoda}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodaEditando)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al actualizar la boda');
      }

      // Actualizar estado local
      const bodaActualizada = data.boda;
      setBodas(prev =>
        prev.map(b => (b.idBoda === bodaActualizada.idBoda ? bodaActualizada : b))
      );

      cerrarModal();
    } catch (err) {
      console.error("Error al actualizar boda:", err);
      setErrorModal(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminacion = async (idBoda) => {
    if (!confirm(`¿Seguro que querés eliminar la boda #${idBoda}?`)) return;

    try {
      const respuesta = await fetch(`http://localhost:3000/bodas/${idBoda}`, {
        method: 'DELETE'
      });
      if (respuesta.ok) {
        setBodas(prev => prev.filter(b => b.idBoda !== idBoda));
      } else {
        alert("Error al eliminar la boda en el backend");
      }
    } catch (err) {
      alert("Error de conexión: " + err.message);
    }
  };

  if (cargando) {
    return (
      <div className="contenedor-bodas">
        <h2>Listado de Bodas</h2>
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando bodas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenedor-bodas">
        <h2>Listado de Bodas</h2>
        <div className="error-mensaje">
          <p>⚠️ No se pudieron cargar las bodas</p>
          <p className="error-detalle">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-reintentar">
            Reintentar
          </button>
        </div>
        <Link to="/" className="link-volver">← Volver al Panel Principal</Link>
      </div>
    );
  }

  return (
    <div className="contenedor-bodas">
      <h2>Listado de Bodas</h2>

      <Link to="/" className="link-volver">← Volver al Panel Principal</Link>

      {bodas.length === 0 ? (
        <p className="sin-datos">No hay bodas registradas todavía.</p>
      ) : (
        <div className="grid-bodas">
          {bodas.map((boda) => (
            <div className="card-boda" key={boda.idBoda}>
              {/* Header con estado */}
              <div className="card-header">
                <span className={`badge ${badgeEstado(boda.estadoBoda)}`}>
                  {boda.estadoBoda}
                </span>
                <span className="card-id">#{boda.idBoda}</span>
              </div>

              {/* Nombres de los novios */}
              <h3 className="card-novios">
                💍 {formatearNovios(boda.novios)}
              </h3>

              {/* Detalle de cada novio */}
              {Array.isArray(boda.novios) && boda.novios.length > 0 && (
                <div className="novios-detalle">
                  {boda.novios.map((novio) => (
                    <div className="novio-chip" key={novio.idPerso}>
                      <span className="novio-nombre">{novio.nombreApe}</span>
                      {novio.telefono && <span className="novio-info">📞 {novio.telefono}</span>}
                      {novio.correoElect && <span className="novio-info">✉️ {novio.correoElect}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Info principal */}
              <div className="card-info">
                <div className="info-item">
                  <span className="info-label">📅 Fecha</span>
                  <span className="info-valor">{formatearFecha(boda.fechaHoraPlanif)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🕐 Hora</span>
                  <span className="info-valor">{formatearHora(boda.fechaHoraPlanif)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💰 Presupuesto</span>
                  <span className="info-valor">{formatearMoneda(boda.presupuesto)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">💵 Seña abonada</span>
                  <span className="info-valor">{formatearMoneda(boda.seniaBoda)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">🧑‍💼 Planner</span>
                  <span className="info-valor">{boda.nombrePlanner || '—'}</span>
                </div>
              </div>

              {/* Barra de progreso seña/presupuesto */}
              {boda.presupuesto > 0 && (
                <div className="barra-container">
                  <div className="barra-labels">
                    <span>Seña pagada</span>
                    <span>{Math.round((boda.seniaBoda / boda.presupuesto) * 100)}%</span>
                  </div>
                  <div className="barra-fondo">
                    <div
                      className="barra-progreso"
                      style={{ width: `${Math.min((boda.seniaBoda / boda.presupuesto) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => abrirModalEditar(boda)}
                  style={{
                    flex: 1,
                    backgroundColor: '#d4a373',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  ✏️ Editar Boda
                </button>
                <button
                  onClick={() => manejarEliminacion(boda.idBoda)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición de boda */}
      {modalAbierto && bodaEditando && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Boda #{bodaEditando.idBoda}</h3>
              <button className="btn-cerrar-modal" onClick={cerrarModal}>&times;</button>
            </div>

            <form onSubmit={guardarEdicionBoda} className="modal-form">
              {errorModal && <div className="modal-error">{errorModal}</div>}

              <div className="form-grupo">
                <label>Fecha y Hora de la Boda *</label>
                <input
                  type="datetime-local"
                  name="fechaHoraPlanif"
                  value={bodaEditando.fechaHoraPlanif}
                  onChange={manejarCambioModal}
                  required
                />
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Presupuesto ($) *</label>
                  <input
                    type="number"
                    name="presupuesto"
                    step="0.01"
                    value={bodaEditando.presupuesto}
                    onChange={manejarCambioModal}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label>Seña Abonada ($)</label>
                  <input
                    type="number"
                    name="seniaBoda"
                    step="0.01"
                    value={bodaEditando.seniaBoda}
                    onChange={manejarCambioModal}
                  />
                </div>
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Estado de la Boda</label>
                  <select
                    name="estadoBoda"
                    value={bodaEditando.estadoBoda}
                    onChange={manejarCambioModal}
                  >
                    <option value="Planificada">Planificada</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Finalizada">Finalizada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Planner Asignado *</label>
                  <select
                    name="idPlanner"
                    value={bodaEditando.idPlanner}
                    onChange={manejarCambioModal}
                    required
                  >
                    <option value="">Seleccione planner...</option>
                    {plannersDisponibles.map(pl => (
                      <option key={pl.idPlanner} value={pl.idPlanner}>
                        {pl.nombre} (@{pl.usuario})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-fila">
                <div className="form-grupo">
                  <label>Novio/a 1</label>
                  <select
                    name="idNovio1"
                    value={bodaEditando.idNovio1}
                    onChange={manejarCambioModal}
                  >
                    <option value="">Seleccione persona...</option>
                    {personasDisponibles.map(p => (
                      <option key={p.idPerso} value={p.idPerso}>
                        {p.nombreApe} ({p.rol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Novio/a 2</label>
                  <select
                    name="idNovio2"
                    value={bodaEditando.idNovio2}
                    onChange={manejarCambioModal}
                  >
                    <option value="">Seleccione persona...</option>
                    {personasDisponibles.map(p => (
                      <option key={p.idPerso} value={p.idPerso}>
                        {p.nombreApe} ({p.rol})
                      </option>
                    ))}
                  </select>
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
