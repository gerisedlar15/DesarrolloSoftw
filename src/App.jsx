import { Routes, Route, Link } from 'react-router-dom';
// Importamos tus dos pantallas
import RegistroPersona from "./components/RegistroPersona"; 
import { ListaPersonas } from "./components/ListaPersonas";

// Este es el menú que ves apenas entrás a la página
function PanelPrincipal() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h2>Panel Principal - Mozzafiato</h2>
      
      {/* Botón para ir al formulario de agregar */}
      <div style={{ marginBottom: '30px' }}>
        <Link to="/registro" style={{ color: '#d4a373', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          ✚ Ir a Agregar Persona
        </Link>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* Botón para ir a la lista de eliminar */}
      <div>
        <Link to="/lista" style={{ color: 'red', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Ver lista para eliminar
        </Link>
      </div>
    </div>
  );
}

// Este es el "mapa" que conecta las URLs con las pantallas
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PanelPrincipal />} />
      <Route path="/registro" element={<RegistroPersona />} />
      <Route path="/lista" element={<ListaPersonas />} />
    </Routes>
  );
}