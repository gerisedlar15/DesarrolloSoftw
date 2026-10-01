import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './modificarPersona.css'; 

export function ModificarPersona() { 
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombreApe: '',
    telefono: '',
    correoElect: '',
    observacion: '',
    rol: 'Novio' 
  });

  // Carga los datos actuales al entrar a la pantalla
  useEffect(() => {
    fetch('http://localhost:3000/personas')
      .then(res => res.json())
      .then(datos => {
        const personaActual = datos.find(p => p.idPerso === Number(id));
        if (personaActual) {
          setFormData(personaActual);
        }
      })
      .catch(error => console.error("Error al cargar datos:", error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const respuesta = await fetch(`http://localhost:3000/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (respuesta.ok) {
        alert("¡Persona modificada con éxito!");
        navigate('/lista'); // <-- AHORA SÍ va a tu ruta correcta
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="tarjeta">
      <h2>Modificar Persona</h2>
      
      <form onSubmit={handleSubmit}>
        <label>Nombre y Apellido:</label>
        <input type="text" name="nombreApe" value={formData.nombreApe} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />

        <label>Correo Electrónico:</label>
        <input type="email" name="correoElect" value={formData.correoElect} onChange={handleChange} />

        <label>Observación:</label>
        <input type="text" name="observacion" value={formData.observacion} onChange={handleChange} />

        <label>Rol:</label>
        <select name="rol" value={formData.rol} onChange={handleChange}>
          <option value="Novio">Novio</option>
          <option value="Invitado">Invitado</option>
          <option value="Proveedor">Proveedor</option>
          <option value="Planner">Planner</option>
        </select>

        <button 
          type="submit" 
          style={{ backgroundColor: '#d4a373', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', marginTop: '15px' }}
        >
          Guardar Cambios
        </button>
      </form>
      
      <br />
      <Link to="/lista">← Cancelar y volver</Link>
    </div>
  );
}