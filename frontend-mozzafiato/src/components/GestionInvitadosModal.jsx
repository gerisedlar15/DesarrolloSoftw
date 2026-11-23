import { useState, useEffect } from 'react';
import './GestionInvitados.css';

export default function GestionInvitadosModal({ boda, alCerrar, alActualizar, abrirDirectoAsociar = false }) {
  const [invitadosBoda, setInvitadosBoda] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [error, setError] = useState('');
  const [enviandoCorreos, setEnviandoCorreos] = useState(false);

  // Estado para el panel/submodal de asociar invitados
  const [mostrandoAsociar, setMostrandoAsociar] = useState(abrirDirectoAsociar);
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [seleccionadosParaAsociar, setSeleccionadosParaAsociar] = useState([]);
  const [guardandoAsociacion, setGuardandoAsociacion] = useState(false);

  const idBoda = boda?.idBoda;

  // 1. Cargar invitados vinculados a la boda
  const cargarInvitados = async () => {
    if (!idBoda) return;
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:3000/api/bodas/${idBoda}/invitados`);
      if (!res.ok) throw new Error('Error al cargar la lista de invitados');
      const data = await res.json();
      setInvitadosBoda(Array.isArray(data) ? data : []);
      if (abrirDirectoAsociar) {
        await cargarPersonasDisponibles(data);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudieron obtener los invitados vinculados.');
    } finally {
      setCargando(false);
    }
  };

  const cargarPersonasDisponibles = async (invitadosActuales = invitadosBoda) => {
    try {
      const res = await fetch('http://localhost:3000/api/personas');
      if (!res.ok) throw new Error('Error al consultar personas');
      const personas = await res.json();

      const idsYaAsociados = new Set((invitadosActuales || []).map(i => i.idPerso));
      const disponibles = personas.filter(p => {
        const esInvitado = p.rol && p.rol.trim().toLowerCase() === 'invitado';
        return esInvitado && !idsYaAsociados.has(p.idPerso);
      });

      setPersonasDisponibles(disponibles);
      setSeleccionadosParaAsociar([]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarInvitados();
  }, [idBoda]);

  // Cargar personas con rol = 'Invitado' disponibles para asociar
  const abrirPanelAsociar = async () => {
    await cargarPersonasDisponibles(invitadosBoda);
    setMostrandoAsociar(true);
  };

  // Manejar selección de checkboxes en el panel de asociación
  const toggleSeleccion = (idPerso) => {
    setSeleccionadosParaAsociar(prev => {
      if (prev.includes(idPerso)) {
        return prev.filter(id => id !== idPerso);
      } else {
        return [...prev, idPerso];
      }
    });
  };

  const seleccionarTodos = () => {
    if (seleccionadosParaAsociar.length === personasDisponibles.length) {
      setSeleccionadosParaAsociar([]);
    } else {
      setSeleccionadosParaAsociar(personasDisponibles.map(p => p.idPerso));
    }
  };

  // 2. Guardar asociación de invitados (POST /api/bodas/:idBoda/invitados)
  const guardarAsociacion = async () => {
    if (seleccionadosParaAsociar.length === 0) {
      alert('Por favor selecciona al menos un invitado.');
      return;
    }

    setGuardandoAsociacion(true);
    try {
      const res = await fetch(`http://localhost:3000/api/bodas/${idBoda}/invitados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPersonas: seleccionadosParaAsociar })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al asociar invitados');

      setMensajeExito(`¡${seleccionadosParaAsociar.length} invitado(s) asociado(s) con éxito!`);
      setTimeout(() => setMensajeExito(''), 3500);
      setMostrandoAsociar(false);
      setSeleccionadosParaAsociar([]);
      await cargarInvitados();
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al guardar la asociación.');
    } finally {
      setGuardandoAsociacion(false);
    }
  };

  // 3. Envío masivo de invitaciones (POST /api/bodas/:idBoda/enviar-invitaciones)
  const enviarInvitacionesMasivas = async () => {
    const pendientes = invitadosBoda.filter(i => !i.invitacionEnviada);
    if (pendientes.length === 0) {
      alert('Todos los invitados cargados ya tienen su invitación enviada.');
      return;
    }

    if (!confirm(`¿Deseas enviar las invitaciones por email a los ${pendientes.length} invitado(s) pendientes?`)) {
      return;
    }

    setEnviandoCorreos(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/bodas/${idBoda}/enviar-invitaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar el envío de invitaciones');

      setMensajeExito(data.mensaje || '¡Invitaciones enviadas con éxito!');
      setTimeout(() => setMensajeExito(''), 4500);
      await cargarInvitados();
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al enviar las invitaciones.');
    } finally {
      setEnviandoCorreos(false);
    }
  };

  // Reenviar invitación individual a un invitado específico
  const reenviarInvitacionIndividual = async (idPerso, nombreApe) => {
    setEnviandoCorreos(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3000/api/bodas/${idBoda}/enviar-invitaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPerso })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      setMensajeExito(`¡Invitación enviada por email a ${nombreApe}!`);
      setTimeout(() => setMensajeExito(''), 3500);
      await cargarInvitados();
      if (alActualizar) alActualizar();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al enviar invitación.');
    } finally {
      setEnviandoCorreos(false);
    }
  };

  // Desvincular un invitado individual de la boda
  const desasociarInvitado = async (idPerso, nombreApe) => {
    if (!confirm(`¿Seguro que deseas quitar a "${nombreApe}" de esta boda?`)) return;
    try {
      const res = await fetch(`http://localhost:3000/api/bodas/${idBoda}/invitados/${idPerso}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setInvitadosBoda(prev => prev.filter(i => i.idPerso !== idPerso));
        if (alActualizar) alActualizar();
      }
    } catch (err) {
      console.error(err);
      alert('Error al desvincular invitado');
    }
  };

  const formatearNovios = (novios) => {
    if (!Array.isArray(novios) || novios.length === 0) return `Boda #${idBoda}`;
    return novios.map(n => n.nombreApe).join(' & ');
  };

  const totalPendientes = invitadosBoda.filter(i => !i.invitacionEnviada).length;

  return (
    <div className="modal-invitados-overlay" onClick={alCerrar}>
      <div className="modal-invitados-contenido" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="modal-invitados-header">
          <div>
            <h3>👥 Gestión de Invitados</h3>
            <p className="modal-invitados-subtitulo">
              Boda #{idBoda}: <strong>{formatearNovios(boda?.novios)}</strong>
            </p>
          </div>
          <button className="btn-cerrar-modal" onClick={alCerrar} title="Cerrar modal">&times;</button>
        </div>

        {/* Cuerpo */}
        <div className="modal-invitados-cuerpo">
          {mensajeExito && <div className="alerta-exito-invitados">✓ {mensajeExito}</div>}
          {error && <div className="alerta-presupuesto-excedido">⚠️ {error}</div>}

          {/* Barra de Acciones */}
          <div className="toolbar-invitados">
            <div>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Total: <strong>{invitadosBoda.length}</strong> invitados (<strong>{totalPendientes}</strong> pendientes de envío)
              </span>
            </div>

            <div className="toolbar-botones">
              <button
                type="button"
                className="btn-accion-invitado btn-asociar"
                onClick={abrirPanelAsociar}
              >
                ➕ Asociar Invitados
              </button>

              <button
                type="button"
                className="btn-accion-invitado btn-enviar-masivo"
                onClick={enviarInvitacionesMasivas}
                disabled={enviandoCorreos || totalPendientes === 0}
              >
                {enviandoCorreos ? '⏳ Enviando correos...' : `✉️ Enviar Invitaciones a Todos (${totalPendientes})`}
              </button>
            </div>
          </div>

          {/* Subpanel para Asociar Nuevos Invitados con Checkboxes */}
          {mostrandoAsociar && (
            <div className="panel-asociar-invitados">
              <div className="panel-asociar-header">
                <h4>Seleccionar personas registradas con rol de Invitado:</h4>
                <button
                  type="button"
                  onClick={() => setMostrandoAsociar(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px' }}
                >
                  &times;
                </button>
              </div>

              {personasDisponibles.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#888', margin: '10px 0' }}>
                  No hay más personas con rol de 'Invitado' disponibles para asociar.
                </p>
              ) : (
                <>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={seleccionarTodos}
                      style={{ background: 'none', border: 'none', color: '#b57945', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      {seleccionadosParaAsociar.length === personasDisponibles.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {seleccionadosParaAsociar.length} seleccionado(s)
                    </span>
                  </div>

                  <div className="lista-checkboxes-invitados">
                    {personasDisponibles.map(p => (
                      <label key={p.idPerso} className="item-checkbox-invitado">
                        <input
                          type="checkbox"
                          checked={seleccionadosParaAsociar.includes(p.idPerso)}
                          onChange={() => toggleSeleccion(p.idPerso)}
                        />
                        <span style={{ fontWeight: '600' }}>{p.nombreApe}</span>
                        <span style={{ color: '#777', fontSize: '12px' }}>({p.correoElect || 'Sin email'})</span>
                      </label>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-accion-invitado"
                      style={{ background: '#e2e8f0', color: '#4a5568' }}
                      onClick={() => setMostrandoAsociar(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-accion-invitado btn-asociar"
                      onClick={guardarAsociacion}
                      disabled={guardandoAsociacion || seleccionadosParaAsociar.length === 0}
                    >
                      {guardandoAsociacion ? 'Guardando...' : `Asociar ${seleccionadosParaAsociar.length} Invitados`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tabla de Invitados Cargados */}
          {cargando ? (
            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Cargando lista de invitados...</p>
          ) : invitadosBoda.length === 0 ? (
            <div className="sin-invitados">
              <p>💍 No hay invitados asociados a esta boda todavía.</p>
              <button
                type="button"
                className="btn-accion-invitado btn-asociar"
                onClick={abrirPanelAsociar}
                style={{ marginTop: '10px' }}
              >
                ➕ Asociar Invitados Ahora
              </button>
            </div>
          ) : (
            <div className="tabla-invitados-container">
              <table className="tabla-invitados">
                <thead>
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th>Correo Electrónico</th>
                    <th>Estado de Invitación</th>
                    <th style={{ textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {invitadosBoda.map(inv => (
                    <tr key={inv.idBodaInvitado || inv.idPerso}>
                      <td style={{ fontWeight: '600' }}>{inv.nombreApe}</td>
                      <td>{inv.correoElect || <em style={{ color: '#999' }}>Sin email</em>}</td>
                      <td>
                        {inv.invitacionEnviada === 1 || inv.invitacionEnviada === true ? (
                          <span className="badge-invitacion badge-enviado">
                            ✓ Enviado
                          </span>
                        ) : (
                          <span className="badge-invitacion badge-pendiente">
                            ⏳ Pendiente
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="btn-accion-invitado"
                          style={{ background: '#d4a373', color: 'white', padding: '4px 8px', fontSize: '11px', marginRight: '6px' }}
                          onClick={() => reenviarInvitacionIndividual(inv.idPerso, inv.nombreApe)}
                          title="Enviar o reenviar invitación a este invitado"
                          disabled={enviandoCorreos}
                        >
                          ✉️ Reenviar
                        </button>
                        <button
                          type="button"
                          className="btn-eliminar-invitado"
                          onClick={() => desasociarInvitado(inv.idPerso, inv.nombreApe)}
                          title="Quitar invitado de esta boda"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
