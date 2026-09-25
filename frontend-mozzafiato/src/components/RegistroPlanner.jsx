import { useState } from 'react';
import './RegistroPlanner.css';
import { Link } from 'react-router-dom';

export default function RegistroPlanner() {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contrasenia: '' 
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
      const respuesta = await fetch('http://localhost:3000/planners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) 
      });

      if (respuesta.ok) {
        setMensajeExito("¡Planner guardado con éxito!"); 
        setFormData({ nombre: '', usuario: '', contrasenia: '' });
        
        setTimeout(() => {
          setMensajeExito('');
        }, 3000);
      } else {
        // Atrapamos el error exacto que manda el servidor y lo mostramos
        const errorTexto = await respuesta.text();
        alert(`Error del servidor. Código: ${respuesta.status}. Detalle: ${errorTexto}`);
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Node.js está apagado o hay un problema de red.");
    }
  };

  return (
    <div className="tarjeta">
      <h2>Agregar Planner</h2>
      
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input 
          type="text" 
          name="nombre" 
          required 
          value={formData.nombre} 
          onChange={handleChange} 
          placeholder="Ej: Geraldine..."
        />

        <label>Usuario:</label>
        <input 
          type="text" 
          name="usuario" 
          required 
          value={formData.usuario} 
          onChange={handleChange} 
          placeholder="Usuario..."
        />

        <label>Contraseña:</label>
        <input 
          type="password" 
          name="contrasenia" // <-- Cambiado a contrasenia
          required 
          value={formData.contrasenia} // <-- Cambiado a contrasenia
          onChange={handleChange} 
          placeholder="Contraseña..."
        />

        <button type="submit">Guardar planner</button>
      </form>

      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}