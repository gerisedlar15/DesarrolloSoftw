import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GestionInvitadosModal from './GestionInvitadosModal';
import './listaBodas.css';
import './modal.css';

export default function ListaBodas() {
  const [bodas, setBodas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal de gestión de invitados
  const [bodaInvitados, setBodaInvitados] = useState(null);

  // Opciones para los selects del modal
  const [plannersDisponibles, setPlannersDisponibles] = useState([]);
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

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

    // Cargar planners, personas y servicios para los dropdowns y checkboxes del modal de edición
    fetch('http://localhost:3000/planners')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPlannersDisponibles(d); })
      .catch(() => {});

    fetch('http://localhost:3000/personas')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPersonasDisponibles(d); })
      .catch(() => {});

    fetch('http://localhost:3000/servicios')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setServiciosDisponibles(d); })
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

  // Helper para verificar rol de novio
  const esRolNovio = (rol) => {
    if (!rol) return false;
    const r = rol.trim().toLowerCase();
    return r === 'novio' || r === 'novia' || r === 'novios';
  };

  // Abrir modal con datos precargados
  const abrirModalEditar = (boda) => {
    const novio1 = (boda.novios && boda.novios[0]) ? boda.novios[0].idPerso : '';
    const novio2 = (boda.novios && boda.novios[1]) ? boda.novios[1].idPerso : '';
    const serviciosIds = Array.isArray(boda.servicios) ? boda.servicios.map(s => s.idServicio) : [];

    setBodaEditando({
      idBoda: boda.idBoda,
      fechaHoraPlanif: aFormatoDateTimeLocal(boda.fechaHoraPlanif),
      presupuesto: boda.presupuesto || 0,
      seniaBoda: boda.seniaBoda || 0,
      estadoBoda: boda.estadoBoda || 'Planificada',
      idPlanner: boda.idPlanner || '',
      idNovio1: novio1,
      idNovio2: novio2,
      serviciosSeleccionados: serviciosIds
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

  const manejarToggleServicioModal = (idServicio) => {
    setBodaEditando(prev => {
      const actuales = prev.serviciosSeleccionados || [];
      const nuevos = actuales.includes(idServicio)
        ? actuales.filter(id => id !== idServicio)
        : [...actuales, idServicio];
      return {
        ...prev,
        serviciosSeleccionados: nuevos
      };
    });
  };

  // Guardar cambios con PUT y actualizar el estado local de React
  const guardarEdicionBoda = async (e) => {
    e.preventDefault();
    if (!bodaEditando.fechaHoraPlanif || bodaEditando.presupuesto === undefined || !bodaEditando.idPlanner) {
      setErrorModal('Fecha, presupuesto y planner son obligatorios');
      return;
    }

    if (bodaEditando.idNovio1 && bodaEditando.idNovio2 && bodaEditando.idNovio1 === bodaEditando.idNovio2) {
      setErrorModal('Novio 1 y Novio 2 no pueden ser la misma persona');
      return;
    }

    setGuardando(true);
    setErrorModal('');

    const payload = {
      ...bodaEditando,
      presupuesto: Number(bodaEditando.presupuesto),
      seniaBoda: Number(bodaEditando.seniaBoda || 0),
      idPlanner: Number(bodaEditando.idPlanner),
      idNovio1: Number(bodaEditando.idNovio1),
      idNovio2: Number(bodaEditando.idNovio2),
      servicios: bodaEditando.serviciosSeleccionados || [],
      idServicios: bodaEditando.serviciosSeleccionados || [],
      idServicio1: (bodaEditando.serviciosSeleccionados && bodaEditando.serviciosSeleccionados[0]) || null,
      idServicio2: (bodaEditando.serviciosSeleccionados && bodaEditando.serviciosSeleccionados[1]) || null,
    };

    try {
      const respuesta = await fetch(`http://localhost:3000/bodas/${bodaEditando.idBoda}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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

  // Filtrado de novios para el modal de edición
  const listaNoviosFiltrados = personasDisponibles.filter(p => esRolNovio(p.rol));
  const noviosParaModal = listaNoviosFiltrados.length > 0 ? listaNoviosFiltrados : personasDisponibles;

  // Cálculo y Validación de Presupuesto en Tiempo Real para el Modal
  const presupuestoModal = bodaEditando ? (parseFloat(bodaEditando.presupuesto) || 0) : 0;
  const serviciosModalSeleccionados = (bodaEditando && bodaEditando.serviciosSeleccionados) || [];
  const costoTotalServiciosModal = serviciosModalSeleccionados.reduce((acc, id) => {
    const serv = serviciosDisponibles.find(s => s.idServicio === id);
    return acc + (serv ? (parseFloat(serv.precio) || 0) : 0);
  }, 0);
  const excedePresupuestoModal = presupuestoModal > 0 && costoTotalServiciosModal > presupuestoModal;
  const montoExcedidoModal = costoTotalServiciosModal - presupuestoModal;

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

              {/* Servicios contratados */}
              {Array.isArray(boda.servicios) && boda.servicios.length > 0 && (
                <div style={{ marginTop: '12px', padding: '10px', background: '#fdfaf6', borderRadius: '8px', border: '1px solid #f0e4d7', fontSize: '13px' }}>
                  <span style={{ fontWeight: '600', color: '#b57945', display: 'block', marginBottom: '4px' }}>🛠️ Servicios incluidos:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {boda.servicios.map(s => (
                      <span
                        key={s.idServicio}
                        style={{
                          background: '#fff',
                          border: '1px solid #d4a373',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '12px',
                          color: '#333'
                        }}
                      >
                        {s.nombre} ({formatearMoneda(s.precio)})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sección de Gestión de Invitados de la Boda */}
              <div style={{ marginTop: '14px', padding: '12px', background: '#faf8f5', borderRadius: '8px', border: '1px solid #ebdcd0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontWeight: 'bold', color: '#8c5828', fontSize: '13px' }}>
                    👥 Invitados ({Array.isArray(boda.invitados) ? boda.invitados.length : 0})
                  </span>
                  <button
                    type="button"
                    onClick={() => setBodaInvitados({ ...boda, abrirDirecto: true })}
                    style={{
                      backgroundColor: '#d4a373',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Asociar Invitados
                  </button>
                </div>

                {/* Tabla de Invitados Cargados */}
                {Array.isArray(boda.invitados) && boda.invitados.length > 0 ? (
                  <div style={{ maxHeight: '140px', overflowY: 'auto', background: 'white', borderRadius: '5px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa', color: '#555', borderBottom: '1px solid #dee2e6' }}>
                          <th style={{ padding: '6px 8px' }}>Nombre</th>
                          <th style={{ padding: '6px 8px' }}>Correo</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boda.invitados.map(inv => (
                          <tr key={inv.idBodaInvitado || inv.idPerso} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '6px 8px', fontWeight: '600' }}>{inv.nombreApe}</td>
                            <td style={{ padding: '6px 8px', color: '#666' }}>{inv.correoElect || '—'}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                              {inv.invitacionEnviada === 1 || inv.invitacionEnviada === true ? (
                                <span style={{ color: '#065f46', background: '#d1fae5', border: '1px solid #a7f3d0', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>
                                  ✓ Enviado
                                </span>
                              ) : (
                                <span style={{ color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', padding: '2px 6px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>
                                  ⏳ Pendiente
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ margin: '6px 0 10px 0', fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                    No hay invitados asociados a esta boda aún.
                  </p>
                )}

                {/* Botón de Envío Masivo de Invitaciones */}
                <button
                  type="button"
                  onClick={() => setBodaInvitados(boda)}
                  style={{
                    width: '100%',
                    backgroundColor: '#2b8a3e',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  ✉️ Enviar Invitaciones a Todos
                </button>
              </div>

              {/* Botones de acción */}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setBodaInvitados(boda)}
                  style={{
                    flex: 1,
                    backgroundColor: '#4a5568',
                    color: 'white',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                  title="Abrir panel completo de invitados"
                >
                  👥 Ver Panel Invitados
                </button>
                <button
                  onClick={() => abrirModalEditar(boda)}
                  style={{
                    flex: 1,
                    backgroundColor: '#d4a373',
                    color: 'white',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '13px'
                  }}
                >
                  ✏️ Editar
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
                  title="Eliminar boda"
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
                  <label>Novio/a 1 *</label>
                  <select
                    name="idNovio1"
                    value={bodaEditando.idNovio1}
                    onChange={manejarCambioModal}
                    required
                  >
                    <option value="">Seleccione novio/a 1...</option>
                    {noviosParaModal.map(p => (
                      <option
                        key={p.idPerso}
                        value={p.idPerso}
                        disabled={Number(bodaEditando.idNovio2) === p.idPerso}
                      >
                        {p.nombreApe}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grupo">
                  <label>Novio/a 2 *</label>
                  <select
                    name="idNovio2"
                    value={bodaEditando.idNovio2}
                    onChange={manejarCambioModal}
                    required
                  >
                    <option value="">Seleccione novio/a 2...</option>
                    {noviosParaModal.map(p => (
                      <option
                        key={p.idPerso}
                        value={p.idPerso}
                        disabled={Number(bodaEditando.idNovio1) === p.idPerso}
                      >
                        {p.nombreApe}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selector de Servicios con Checkboxes */}
              <div className="form-grupo">
                <label>🛠️ Servicios para la Boda</label>
                <div className="modal-servicios-lista">
                  {serviciosDisponibles.length === 0 ? (
                    <p style={{ color: '#888', fontSize: '13px', margin: '4px 0' }}>No hay servicios registrados.</p>
                  ) : (
                    serviciosDisponibles.map(serv => {
                      const estaSel = serviciosModalSeleccionados.includes(serv.idServicio);
                      const precio = parseFloat(serv.precio) || 0;
                      return (
                        <div
                          key={serv.idServicio}
                          className={`modal-servicio-item ${estaSel ? 'seleccionado' : ''}`}
                          onClick={() => manejarToggleServicioModal(serv.idServicio)}
                        >
                          <label
                            className="modal-servicio-label"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={estaSel}
                              onChange={() => manejarToggleServicioModal(serv.idServicio)}
                            />
                            <span>{serv.nombre || `Servicio #${serv.idServicio}`}</span>
                          </label>
                          <span className="modal-servicio-precio">
                            {formatearMoneda(precio)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Cálculo y Validación de Presupuesto en Tiempo Real */}
              <div className="modal-presupuesto-box">
                <div className="modal-presupuesto-fila">
                  <span>Presupuesto ingresado:</span>
                  <strong>{formatearMoneda(presupuestoModal)}</strong>
                </div>
                <div className="modal-presupuesto-fila">
                  <span>Total servicios seleccionados ({serviciosModalSeleccionados.length}):</span>
                  <strong style={{ color: excedePresupuestoModal ? '#b91c1c' : '#047857' }}>
                    {formatearMoneda(costoTotalServiciosModal)}
                  </strong>
                </div>

                {excedePresupuestoModal && (
                  <div className="modal-alerta-exceso">
                    ⚠️ El costo total excede el presupuesto por {formatearMoneda(montoExcedidoModal)}
                  </div>
                )}

                {!excedePresupuestoModal && presupuestoModal > 0 && serviciosModalSeleccionados.length > 0 && (
                  <div className="modal-alerta-ok">
                    ✓ Total dentro del presupuesto (Disponible: {formatearMoneda(presupuestoModal - costoTotalServiciosModal)})
                  </div>
                )}
              </div>

              {/* Sección de Invitados dentro del Modal de Edición */}
              <div style={{ marginTop: '10px', padding: '12px', background: '#faf8f5', borderRadius: '8px', border: '1px solid #ebdcd0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#8c5828', fontSize: '13px' }}>
                    👥 Gestión de Invitados
                  </span>
                  <button
                    type="button"
                    onClick={() => setBodaInvitados({ ...bodaEditando, novios: bodas.find(b => b.idBoda === bodaEditando.idBoda)?.novios, abrirDirecto: true })}
                    style={{
                      backgroundColor: '#d4a373',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Asociar Invitados
                  </button>
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

      {/* Modal de Gestión de Invitados y Envío Masivo */}
      {bodaInvitados && (
        <GestionInvitadosModal
          boda={bodaInvitados}
          abrirDirectoAsociar={!!bodaInvitados.abrirDirecto}
          alCerrar={() => setBodaInvitados(null)}
          alActualizar={cargarBodas}
        />
      )}
    </div>
  );
}
