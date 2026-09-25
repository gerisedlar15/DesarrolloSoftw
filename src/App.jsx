import { Routes, Route, Link } from 'react-router-dom';
// Importamos tus dos pantallas
import RegistroPersona from "./components/RegistroPersona"; 
import { ListaPersonas } from "./components/ListaPersonas";
import RegistroServicio from './components/RegistroServicio';
import RegistroPlanner from './components/RegistroPlanner';


// Este es el menú que ves apenas entrás a la página
function PanelPrincipal() {
  return (
    <div id="contenedor-botones" style={{ textAlignment: 'center' }}>
      <h2>Panel Principal - Mozzafiato</h2>
      
      {/* Botón para ir al formulario de agregar */}
      <div className="contenedor-botones">
        <Link to="/registro" className="boton-panel" style={{ color: '#d4a373', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
          ✚ Ir a Agregar Persona
        </Link>
      </div>
      <div className="contenedor-botones">
        <Link to="/agregar-servicio" className="boton-panel" style={{ color: '#d4a373', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }} >
          ✚  Ir a Agregar Servicio
        </Link>
      </div>
      <div className="contenedor-botones">
        <Link to="/agregar-planner" className="boton-panel" style={{ color: '#d4a373', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }} >
          ✚  Ir a Agregar Planner
        </Link>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* Botón para ir a la lista de personas (eliminar/modificar) */}
      <div style={{ textAlign: 'center' }}>
        <Link to="/lista" style={{ color: ' rgb(119, 119, 124)', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Ver lista de personas
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
      <Route path="/agregar-servicio" element={<RegistroServicio />} />
      <Route path="/agregar-planner" element={<RegistroPlanner />} />
    </Routes>
  );
}