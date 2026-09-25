import { useState } from 'react';
import './RegistroPlanner.css'; // O crea un './RegistroPlaner.css' si prefieres separar los estilos
import { Link } from 'react-router-dom';

export default function RegistroPlanner() {
  // Memoria de la pantalla: guarda todo lo que el usuario escribe en los inputs del planner
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contraseña: ''
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
    alert("Intentando enviar datos del planner...");
    
    try {
      // Apunta al backend en JavaScript que guardará el planner
      const respuesta = await fetch('http://localhost:3000/planners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (respuesta.ok) {
        // Guardamos el mensaje de éxito
        setMensajeExito("¡Planner guardado con éxito!");

        // Vaciamos los campos del formulario
        setFormData({
          nombre: '',
          usuario: '',
          contraseña: ''
        });

        // Ocultamos el mensaje de éxito a los 3 segundos
        setTimeout(() => {
          setMensajeExito('');
        }, 3000);
      } else {
        alert("Hubo un error en el servidor al guardar el planner.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="tarjeta">
      <h2>Agregar Planner</h2>
      
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          required 
          value={formData.nombre} 
          onChange={handleChange} 
          placeholder="EJ: Gerladine, Lourdes, ..."
        />

        <label htmlFor="usuario">Usuario:</label>
        <input 
          type="text" 
          id="usuario" 
          name="usuario" 
          required 
          value={formData.usuario} 
          onChange={handleChange} 
          placeholder="EJ: Gerladine, Lourdes, ..."
        />

        <label htmlFor="contraseña">Contraseña:</label>
        <input 
          type="password" 
          id="contraseña" 
          name="contraseña" 
          required 
          value={formData.contraseña} 
          onChange={handleChange} 
          placeholder="Contraseña segura..."
        />

        <button type="submit">Guardar planner</button>
      </form>

      <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}