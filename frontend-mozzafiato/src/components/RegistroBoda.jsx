import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RegistroBoda.css';

export default function RegistroBoda() {
  const [formData, setFormData] = useState({
    fechaHoraPlanif: '',
    presupuesto: '',
    seniaBoda: '',
    estadoBoda: 'Planificada',
    idPlanner: '',
    idNovio1: '',
    idNovio2: ''
  });

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [invitadosSeleccionados, setInvitadosSeleccionados] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorEnvio, setErrorEnvio] = useState('');

  // 1. Peticiones GET al cargar el formulario
  useEffect(() => {
    setCargando(true);
    Promise.all([
      fetch('http://localhost:3000/personas').then(r => r.json()),
      fetch('http://localhost:3000/planners').then(r => r.json()),
      fetch('http://localhost:3000/servicios').then(r => r.json())
    ])
      .then(([datosPersonas, datosPlanners, datosServicios]) => {
        if (Array.isArray(datosPersonas)) setPersonas(datosPersonas);
        if (Array.isArray(datosPlanners)) setPlanners(datosPlanners);
        if (Array.isArray(datosServicios)) setServicios(datosServicios);
      })
      .catch(err => {
        console.error("Error al cargar datos del backend:", err);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Filtrar personas con rol de novio (case-insensitive)
  const esRolNovio = (rol) => {
    if (!rol) return false;
    const r = rol.trim().toLowerCase();
    return r === 'novio' || r === 'novia' || r === 'novios';
  };

  const listaNovios = personas.filter(p => esRolNovio(p.rol));
  // Si no hubiera novios explícitos por rol, mostramos las personas disponibles para no bloquear el uso
  const noviosDisponibles = listaNovios.length > 0 ? listaNovios : personas;

  // Personas disponibles con rol = 'Invitado'
  const personasInvitados = personas.filter(p => p.rol && p.rol.trim().toLowerCase() === 'invitado');

  // Planners registrados (del endpoint /planners y de personas con rol planner si existieren)
  const plannersCombinados = [...planners];
  personas.forEach(p => {
    if (p.rol && p.rol.trim().toLowerCase() === 'planner') {
      if (!plannersCombinados.some(pl => pl.idPlanner === p.idPerso)) {
        plannersCombinados.push({
          idPlanner: p.idPerso,
          nombre: p.nombreApe,
          usuario: p.correoElect || 'planner'
        });
      }
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejo de selección/deselección de servicios con checkboxes
  const handleToggleServicio = (idServicio) => {
    setServiciosSeleccionados(prev => {
      if (prev.includes(idServicio)) {
        return prev.filter(id => id !== idServicio);
      } else {
        return [...prev, idServicio];
      }
    });
  };

  // 2. Cálculo y Validación de Presupuesto en Tiempo Real
  const presupuestoNumero = parseFloat(formData.presupuesto) || 0;

  const costoTotalServicios = serviciosSeleccionados.reduce((acumulado, id) => {
    const serv = servicios.find(s => s.idServicio === id);
    const precio = serv ? (parseFloat(serv.precio) || 0) : 0;
    return acumulado + precio;
  }, 0);

  const excedePresupuesto = presupuestoNumero > 0 && costoTotalServicios > presupuestoNumero;
  const montoExcedido = costoTotalServicios - presupuestoNumero;

  const formatearDinero = (monto) => {
    return Number(monto || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // 3. Envío al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorEnvio('');

    if (!formData.idNovio1 || !formData.idNovio2) {
      alert("Por favor seleccioná a ambos novios.");
      return;
    }

    if (formData.idNovio1 === formData.idNovio2) {
      alert("Novio 1 y Novio 2 no pueden ser la misma persona.");
      return;
    }

    if (!formData.idPlanner) {
      alert("Por favor seleccioná un planner.");
      return;
    }

    const payload = {
      fechaHoraPlanif: formData.fechaHoraPlanif,
      presupuesto: presupuestoNumero,
      seniaBoda: parseFloat(formData.seniaBoda) || 0,
      estadoBoda: formData.estadoBoda,
      idPlanner: Number(formData.idPlanner),
      idNovio1: Number(formData.idNovio1),
      idNovio2: Number(formData.idNovio2),
      idServicio1: serviciosSeleccionados[0] || null,
      idServicio2: serviciosSeleccionados[1] || null,
      servicios: serviciosSeleccionados,
      idServicios: serviciosSeleccionados,
      idPersonas: invitadosSeleccionados,
      invitados: invitadosSeleccionados
    };

    try {
      const respuesta = await fetch('http://localhost:3000/bodas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const datosRespuesta = await respuesta.json().catch(() => ({}));

      if (respuesta.ok) {
        setMensajeExito("¡Boda, novios y servicios guardados con éxito!");
        setFormData({
          fechaHoraPlanif: '',
          presupuesto: '',
          seniaBoda: '',
          estadoBoda: 'Planificada',
          idPlanner: '',
          idNovio1: '',
          idNovio2: ''
        });
        setServiciosSeleccionados([]);
        setInvitadosSeleccionados([]);

        setTimeout(() => {
          setMensajeExito('');
        }, 3500);
      } else {
        setErrorEnvio(datosRespuesta.error || "El servidor rechazó los datos.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setErrorEnvio("No se pudo conectar con el servidor backend.");
    }
  };

  return (
    <div className="tarjeta-boda">
      <h2>Agregar Boda</h2>

      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
      {errorEnvio && <div className="alerta-presupuesto-excedido">{errorEnvio}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="fechaHoraPlanif">Fecha y Hora de la Boda *</label>
        <input
          type="datetime-local"
          id="fechaHoraPlanif"
          name="fechaHoraPlanif"
          required
          value={formData.fechaHoraPlanif}
          onChange={handleChange}
        />

        <div className="form-grid-2">
          <div>
            <label htmlFor="presupuesto">Presupuesto ($) *</label>
            <input
              type="number"
              id="presupuesto"
              name="presupuesto"
              required
              min="0"
              step="0.01"
              placeholder="Ej: 50000"
              value={formData.presupuesto}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="seniaBoda">Seña Abonada ($)</label>
            <input
              type="number"
              id="seniaBoda"
              name="seniaBoda"
              min="0"
              step="0.01"
              placeholder="Ej: 10000"
              value={formData.seniaBoda}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label htmlFor="estadoBoda">Estado</label>
            <select
              id="estadoBoda"
              name="estadoBoda"
              value={formData.estadoBoda}
              onChange={handleChange}
            >
              <option value="Planificada">Planificada</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label htmlFor="idPlanner">Planner *</label>
            <select
              id="idPlanner"
              name="idPlanner"
              required
              value={formData.idPlanner}
              onChange={handleChange}
            >
              <option value="">Seleccione un planner...</option>
              {plannersCombinados.map(pl => (
                <option key={pl.idPlanner} value={pl.idPlanner}>
                  {pl.nombre} {pl.usuario ? `(@${pl.usuario})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label htmlFor="idNovio1">Novio/a 1 *</label>
            <select
              id="idNovio1"
              name="idNovio1"
              required
              value={formData.idNovio1}
              onChange={handleChange}
            >
              <option value="">Seleccione novio/a 1...</option>
              {noviosDisponibles.map(p => (
                <option
                  key={p.idPerso}
                  value={p.idPerso}
                  disabled={Number(formData.idNovio2) === p.idPerso}
                >
                  {p.nombreApe}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idNovio2">Novio/a 2 *</label>
            <select
              id="idNovio2"
              name="idNovio2"
              required
              value={formData.idNovio2}
              onChange={handleChange}
            >
              <option value="">Seleccione novio/a 2...</option>
              {noviosDisponibles.map(p => (
                <option
                  key={p.idPerso}
                  value={p.idPerso}
                  disabled={Number(formData.idNovio1) === p.idPerso}
                >
                  {p.nombreApe}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sección de Selección de Servicios con Checkboxes */}
        <div className="seccion-servicios">
          <label className="titulo-servicios">
            🛠️ Servicios para la Boda:
          </label>

          {cargando ? (
            <p style={{ color: '#888', fontSize: '13px' }}>Cargando servicios disponibles...</p>
          ) : servicios.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>No hay servicios registrados en el sistema.</p>
          ) : (
            <div className="lista-servicios">
              {servicios.map(serv => {
                const estaSeleccionado = serviciosSeleccionados.includes(serv.idServicio);
                const precio = parseFloat(serv.precio) || 0;
                return (
                  <div
                    key={serv.idServicio}
                    className={`item-servicio ${estaSeleccionado ? 'seleccionado' : ''}`}
                    onClick={() => handleToggleServicio(serv.idServicio)}
                  >
                    <label
                      className="item-servicio-label"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => handleToggleServicio(serv.idServicio)}
                      />
                      <span>{serv.nombre || `Servicio #${serv.idServicio}`}</span>
                    </label>
                    <span className="servicio-precio">
                      ${formatearDinero(precio)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sección de Selección de Invitados con Checkboxes */}
        <div className="seccion-servicios" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label className="titulo-servicios" style={{ margin: 0 }}>
              👥 Invitados de la Boda ({invitadosSeleccionados.length} seleccionados):
            </label>
            <span style={{ fontSize: '12px', color: '#8c5828', fontWeight: 'bold' }}>
              Rol: Invitado
            </span>
          </div>

          {cargando ? (
            <p style={{ color: '#888', fontSize: '13px' }}>Cargando invitados disponibles...</p>
          ) : personasInvitados.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>No hay personas registradas con rol 'Invitado'.</p>
          ) : (
            <div className="lista-servicios" style={{ maxHeight: '180px' }}>
              {personasInvitados.map(p => {
                const estaSel = invitadosSeleccionados.includes(p.idPerso);
                return (
                  <div
                    key={p.idPerso}
                    className={`item-servicio ${estaSel ? 'seleccionado' : ''}`}
                    onClick={() => {
                      setInvitadosSeleccionados(prev =>
                        prev.includes(p.idPerso) ? prev.filter(id => id !== p.idPerso) : [...prev, p.idPerso]
                      );
                    }}
                  >
                    <label className="item-servicio-label" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={estaSel}
                        onChange={() => {
                          setInvitadosSeleccionados(prev =>
                            prev.includes(p.idPerso) ? prev.filter(id => id !== p.idPerso) : [...prev, p.idPerso]
                          );
                        }}
                      />
                      <span>{p.nombreApe}</span>
                    </label>
                    <span style={{ fontSize: '12px', color: '#666' }}>{p.correoElect || 'Sin email'}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resumen de cálculo y validación de presupuesto en tiempo real */}

        <button type="submit" className="btn-submit-boda">
          Preparar Boda
        </button>
      </form>

      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}
