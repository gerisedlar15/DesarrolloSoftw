import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegistroPlanner.css';

export default function RegistroBoda() {
  const [formData, setFormData] = useState({
    fechaHoraPlanif: '',
    presupuesto: '',
    seniaBoda: '',
    estadoBoda: 'Planificada',
    idPlanner: '',
    idNovio1: '',
    idNovio2: '',
    idServicio1: '', 
    idServicio2: ''  
  });

  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const respuesta = await fetch('http://localhost:3000/bodas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) 
      });

      if (respuesta.ok) {
        setMensajeExito("¡Boda, novios y servicios guardados con éxito!"); 
        setFormData({ 
          fechaHoraPlanif: '', presupuesto: '', seniaBoda: '', estadoBoda: 'Planificada', 
          idPlanner: '', idNovio1: '', idNovio2: '', idServicio1: '', idServicio2: '' 
        });
        
        setTimeout(() => { setMensajeExito(''); }, 3000);
      } else {
        alert("Error: El servidor rechazó los datos.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="tarjeta">
      <h2>Agregar Boda</h2>
      
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <form onSubmit={handleSubmit}>
        <label>Fecha y Hora:</label>
        <input type="datetime-local" name="fechaHoraPlanif" required value={formData.fechaHoraPlanif} onChange={handleChange} />

        <label>Presupuesto ($):</label>
        <input type="number" name="presupuesto" required value={formData.presupuesto} onChange={handleChange} />

        <label>Seña abonada ($):</label>
        <input type="number" name="seniaBoda" required value={formData.seniaBoda} onChange={handleChange} />

        <label>Estado:</label>
        <select name="estadoBoda" value={formData.estadoBoda} onChange={handleChange}>
          <option value="Planificada">Planificada</option>
          <option value="En proceso">En proceso</option>
          <option value="Finalizada">Finalizada</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <label>ID Planner:</label>
        <input type="number" name="idPlanner" required value={formData.idPlanner} onChange={handleChange} />

        <label>ID Novio/a 1:</label>
        <input type="number" name="idNovio1" required value={formData.idNovio1} onChange={handleChange} />

        <label>ID Novio/a 2:</label>
        <input type="number" name="idNovio2" required value={formData.idNovio2} onChange={handleChange} />

        <label>ID Servicio 1 (Opcional):</label>
        <input type="number" name="idServicio1" value={formData.idServicio1} onChange={handleChange} />

        <label>ID Servicio 2 (Opcional):</label>
        <input type="number" name="idServicio2" value={formData.idServicio2} onChange={handleChange} />

        <button type="submit">Preparar Boda</button>
      </form>

      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}