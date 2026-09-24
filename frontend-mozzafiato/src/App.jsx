import { Routes, Route, Link } from 'react-router-dom';
import RegistroPersona from "./components/RegistroPersona";
import { ListaPersonas } from "./components/ListaPersonas";
import ModificarPersona from "./components/modificarPersona"; // <-- ESTO FALTABA
import RegistroServicio from './components/RegistroServicio';

function PanelPrincipal() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h2>Panel Principal - Mozzafiato</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <Link to="/registro" style={{ width: '270px', padding: '10px', color: '#d4a373', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', border: '1px solid #d4a373', borderRadius: '5px' }}>
          ✚ Ir a Agregar Persona
        </Link>
        
        <Link to="/registro-servicio" style={{ width: '270px', padding: '10px', color: '#d4a373', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', border: '1px solid #d4a373', borderRadius: '5px' }} >
          ✚ Ir a Agregar Servicio
        </Link>
      </div>

      <hr style={{ margin: '40px 0' }} />

      <div>
        <Link to="/lista" style={{ color: 'rgb(119, 119, 124)', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          Ver lista de personas
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PanelPrincipal />} />
      <Route path="/registro" element={<RegistroPersona />} />
      <Route path="/lista" element={<ListaPersonas />} />
      <Route path="/editar/:id" element={<ModificarPersona />} />
      <Route path="/registro-servicio" element={<RegistroServicio />} />
    </Routes>
  );
}