import { useState } from 'react';
import './RegistroServicio.css';
import { Link } from 'react-router-dom';

export default function RegistroServicio() {
  const [formData, setFormData] = useState({
    Nombre: '', telefono: '', email: '', descripcion: ''
  });
  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Nos aseguramos de que apunte al puerto 3000 de Node.js
      const respuesta = await fetch('http://localhost:3000/servicios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (respuesta.ok) {
        setMensajeExito("¡Servicio guardado con éxito!");
        setFormData({ Nombre: '', telefono: '', email: '', descripcion: '' });
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        alert("El backend conectó pero rechazó los datos (posible error en la tabla de MySQL).");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el backend. Revisá si Node.js está prendido.");
    }
  };

  return (
    <div className="tarjeta">
      <h2>Agregar Servicio</h2>
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
      <form onSubmit={handleSubmit}>
        <label>Nombre del Servicio:</label>
        <input type="text" name="Nombre" required value={formData.Nombre} onChange={handleChange} placeholder="Ej: Catering, DJ, Fotografía..." />

        <label>Teléfono:</label>
        <input type="text" name="telefono" required value={formData.telefono} onChange={handleChange} placeholder="Número de teléfono..." />

        <label>Correo Electrónico:</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" />

        <label>Descripción:</label>
        <input type="text" name="descripcion" required value={formData.descripcion} onChange={handleChange} placeholder="Descripción del servicio..." />

        <button type="submit">Guardar servicio</button>
      </form>
      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}