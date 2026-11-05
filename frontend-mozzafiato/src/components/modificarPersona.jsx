import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RegistroPersona.css';

export default function ModificarPersona() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [persona, setPersona] = useState({
        nombreApe: '',
        telefono: '',
        correoElect: '',
        observacion: '',
        rol: 'Invitado'
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/personas/${id}`)
            .then(respuesta => {
                if (!respuesta.ok) throw new Error("No se pudo cargar la persona");
                return respuesta.json();
            })
            .then(datos => {
                setPersona({
                    nombreApe: datos.nombreApe || '',
                    telefono: datos.telefono || '',
                    correoElect: datos.correoElect || '',
                    observacion: datos.observacion || '',
                    rol: datos.rol || 'Invitado'
                });
            })
            .catch(err => {
                console.error("Error al traer persona:", err);
                setError(err.message);
            })
            .finally(() => setCargando(false));
    }, [id]);

    const handleChange = (e) => {
        setPersona({ ...persona, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');

        try {
            const respuesta = await fetch(`http://localhost:3000/personas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(persona)
            });

            const data = await respuesta.json();
            if (!respuesta.ok) {
                throw new Error(data.error || "Error al actualizar");
            }

            navigate('/lista');
        } catch (err) {
            console.error("Error al modificar:", err);
            setError(err.message);
        }
    };

    if (cargando) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando datos...</div>;
    }

    return (
        <div className="contenedor-registro">
            <div className="tarjeta">
                <h2>Modificar Persona #{id}</h2>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombreApe">Nombre de la Persona *</label>
                    <input type="text" id="nombreApe" name="nombreApe" value={persona.nombreApe} onChange={handleChange} required />
                    
                    <label htmlFor="rol">Rol:</label>
                    <select
                        id="rol"
                        name="rol"
                        value={persona.rol}
                        onChange={handleChange}
                        style={{ padding: '10px', marginTop: '5px', width: '100%', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        <option value="Invitado">Invitado</option>
                        <option value="Novio">Novio</option>
                    </select>

                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" name="telefono" value={persona.telefono} onChange={handleChange} />
                    
                    <label htmlFor="correoElect">Correo electrónico:</label>
                    <input type="email" id="correoElect" name="correoElect" value={persona.correoElect} onChange={handleChange} />
                    
                    <label htmlFor="observacion">Observación:</label>
                    <input type="text" id="observacion" name="observacion" value={persona.observacion} onChange={handleChange} />

                    <button type="submit">Actualizar datos</button>
                </form>
                <button className="volver" onClick={() => navigate('/lista')}>← Volver a la lista</button>
            </div>
        </div>
    );
}
