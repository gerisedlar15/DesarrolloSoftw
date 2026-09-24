import { useState } from 'react';
import './RegistroPersona.css';
import { Link } from 'react-router-dom';

export default function RegistroPersona() {
  const [formData, setFormData] = useState({ //es la memoria de la pantalla. guasrda todo lo qeu el usuario escribe en los inputs
    nombreApe: '', 
    telefono: '',
    correoElect: '',
    observacion: '',
    rol: 'Invitado' // Valor por defecto
  });
  // Memoria exclusiva para el cartel de éxito
const [mensajeExito, setMensajeExito] = useState('');

//crea una memoria a corto plazo para tu componente.
//formData: Es la variable que usamos para leer lo que hay en la memoria.
//setFormData: Es la función (la única herramienta autorizada) para modificar esa memoria.

  const handleChange = (e) => { //cada vez que el usuario escribe algo en un input, se ejecuta esta función
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
//El atributo onChange es un vigilante. Cada vez que tocás una tecla en el input, captura ese movimiento y genera un "evento" (eso es la e).
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Intentando enviar datos...");
    try {
      const respuesta = await fetch('http://localhost/backend-mozzafiato/guardarPersona.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // el rol está en la memoria (formData), mandamos el paquete directo
        body: JSON.stringify(formData) 
      });

      if (respuesta.ok) {
        
        // guardamos el mensaje en nuestra nueva memoria
        setMensajeExito("¡Guardado con éxito!"); 
        
        // Vaciamos los inputs
        setFormData({ nombreApe: '', telefono: '', correoElect: '', observacion: '', rol: 'Invitado' });
        
        // Hacemos que el mensaje desaparezca solo después de 3 segundos
        setTimeout(() => {
          setMensajeExito('');
        }, 3000);
      } else {
        alert("Hubo un error en el servidor.");
      }

    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };
    
  return (
    <div className="tarjeta">
      <h2>Agregar Persona</h2>
      {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>} 
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombreApe">Nombre de la Persona:</label>
        <input type="text" id="nombreApe" name="nombreApe" required value={formData.nombreApe} onChange={handleChange} />

        <label htmlFor="telefono">Teléfono de la Persona:</label>
        <input type="tel" id="telefono" name="telefono" required value={formData.telefono} onChange={handleChange} />

        <label htmlFor="correoElect">Correo electrónico de la Persona</label>
        <input type="email" id="correoElect" name="correoElect" required value={formData.correoElect} onChange={handleChange} />

        <label htmlFor="observacion">Observación de la Persona</label>
        <input type="text" id="observacion" name="observacion" required value={formData.observacion} onChange={handleChange} />
      <label htmlFor="rol">Rol de la Persona:</label>
        <select 
          id="rol" 
          name="rol" 
          required 
          value={formData.rol} 
          onChange={handleChange}
          style={{ padding: '10px', marginTop: '5px', width: '100%', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="Invitado">Invitado</option>
          <option value="Novio">Novio</option>
        </select>
        <button type="submit">Guardar datos</button>
      </form>
     <Link to="/" className="volver">← Volver al Panel Principal</Link>
    </div>
  );
}