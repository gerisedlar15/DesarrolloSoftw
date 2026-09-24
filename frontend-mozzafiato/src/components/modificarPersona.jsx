import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RegistroPersona.css'; // Reutilizamos tu diseño visual

export default function ModificarPersona() {
    // Sacamos el ID de la persona desde la URL (ej: /editar/3 -> id = 3)
    const { id } = useParams();
    const navigate = useNavigate();

    // Memoria para los campos del formulario
    const [persona, setPersona] = useState({
        nombreApe: '',
        telefono: '',
        correoElect: '',
        observacion: ''
    });

    // 1. Buscar los datos actuales al abrir la pantalla
    useEffect(() => {
        fetch(`http://localhost:3000/personas/${id}`)
            .then(respuesta => respuesta.json())
            .then(datos => {
                // Rellenamos la memoria con lo que devolvió la base de datos
                setPersona({
                    nombreApe: datos.nombreApe || '',
                    telefono: datos.telefono || '',
                    correoElect: datos.correoElect || '',
                    observacion: datos.observacion || ''
                });
            })
            .catch(error => console.error("Error al traer persona:", error));
    }, [id]);

    // 2. Actualizar la memoria letra por letra mientras escribís
    const handleChange = (e) => {
        setPersona({ ...persona, [e.target.name]: e.target.value });
    };

    // 3. Enviar los datos modificados al backend al hacer clic en guardar
    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        // Usamos el método PUT que armaste en tu backend para sobreescribir
        fetch(`http://localhost:3000/personas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(persona)
        })
        .then(() => navigate('/lista')) // Si sale bien, volvemos a la lista
        .catch(error => console.error("Error al modificar:", error));
    };

    return (
        <div className="contenedor-registro">
            <div className="tarjeta">
                <h2>Modificar Persona</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombreApe">Nombre de la Persona:</label>
                    <input type="text" id="nombreApe" name="nombreApe" value={persona.nombreApe} onChange={handleChange} required />
                    
                    <label htmlFor="telefono">Teléfono de la Persona:</label>
                    <input type="tel" id="telefono" name="telefono" value={persona.telefono} onChange={handleChange} required />
                    
                    <label htmlFor="correoElect">Correo electrónico:</label>
                    <input type="email" id="correoElect" name="correoElect" value={persona.correoElect} onChange={handleChange} required />
                    
                    <label htmlFor="observacion">Observación:</label>
                    <input type="text" id="observacion" name="observacion" value={persona.observacion} onChange={handleChange} required />

                    <button type="submit">Actualizar datos</button>
                </form>
                <button className="volver" onClick={() => navigate('/lista')}>← Volver a la lista</button>
            </div>
        </div>
    );
}