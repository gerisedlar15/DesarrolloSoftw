import { useState } from 'react';
import './RegistroServicio.css';
import { Link } from 'react-router-dom';

export default function RegistroServicio() {
  // Memoria de la pantalla: guarda todo lo que el usuario escribe en los inputs del servicio
  const [formData, setFormData] = useState({
    Nombre: '',
    telefono: '',
    email: '',
    descripcion: '' // Valor por defecto
  });

  // Memoria exclusiva para el cartel de éxito
  const [mensajeExito, setMensajeExito] = useState('');

  // Cada vez que el usuario escribe algo en un input, se ejecuta esta función
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Intentando enviar datos del servicio...");
    
    try {
      // Apunta al backend en PHP que guardará el servicio
      const respuesta = await fetch('http://localhost/backend-mozzafiato/guardarServicio.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (respuesta.ok) {
        // Guardamos el mensaje de éxito
        setMensajeExito("¡Servicio guardado con éxito!");

        // Vaciamos los campos del formulario
        setFormData({
          Nombre: '',
          telefono: '',
          email: '',
          descripcion: ''
        });

        // Ocultamos el mensaje de éxito a los 3 segundos
        setTimeout(() => {
          setMensajeExito('');
        }, 3000);
      } else {
        alert("Hubo un error en el servidor al guardar el servicio.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="tarjeta">
      <h2>Agregar Servicio</h2>
      
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="Nombre">Nombre del Servicio:</label>
        <input 
          type="text" 
          id="Nombre" 
          name="Nombre" 
          required 
          value={formData.Nombre} 
          onChange={handleChange} 
          placeholder="Ej: Catering, DJ, Fotografía..."
        />

        <label htmlFor="telefono">Teléfono del Servicio:</label>
        <input 
          type="text" 
          id="telefono" 
          name="telefono" 
          required 
          value={formData.telefono} 
          onChange={handleChange} 
          placeholder="Número de teléfono..."
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="ejemplo@correo.com"
        />

        <label htmlFor="descripcion">Descripción del Servicio:</label>
        <input
          id="descripcion" 
          name="descripcion" 
          required 
          value={formData.descripcion} 
          onChange={handleChange}
          placeholder="Descripción del servicio..."
        />

        <button type="submit">Guardar servicio</button>
      </form>

      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}