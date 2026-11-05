import { Routes, Route, Link } from 'react-router-dom';
import RegistroPersona from "./components/RegistroPersona";
import { ListaPersonas } from "./components/ListaPersonas";
import ModificarPersona from "./components/modificarPersona";
import RegistroServicio from './components/RegistroServicio';
import ListaServicios from './components/ListaServicios';
import RegistroPlanner from './components/RegistroPlanner'; 
import ListaPlanners from './components/ListaPlanners';
import RegistroBoda from './components/RegistroBoda';
import ListaBodas from './components/ListaBodas';

function PanelPrincipal() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '25px' }}>Panel Principal - Mozzafiato</h2>
      
      <h3 style={{ fontSize: '18px', color: '#888', marginBottom: '15px' }}>➕ Registros (Crear)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '35px' }}>
        <Link to="/registro" style={btnEstilo}>
          ✚ Agregar Persona
        </Link>
        <Link to="/registro-planner" style={btnEstilo}>
          ✚ Agregar Planner
        </Link>
        <Link to="/registro-servicio" style={btnEstilo}>
          ✚ Agregar Servicio
        </Link>
        <Link to="/agregar-boda" style={btnEstilo}>
          ✚ Agregar Boda
        </Link>
      </div>
      
      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      <h3 style={{ fontSize: '18px', color: '#888', marginBottom: '15px' }}>📋 Listados y Gestión (Ver, Editar, Eliminar)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
        <Link to="/lista" style={btnListadoEstilo}>
          👥 Ver Lista de Personas
        </Link>
        <Link to="/lista-planners" style={btnListadoEstilo}>
          🧑‍💼 Ver Lista de Planners
        </Link>
        <Link to="/lista-servicios" style={btnListadoEstilo}>
          🛠️ Ver Lista de Servicios
        </Link>
        <Link to="/lista-bodas" style={{ ...btnListadoEstilo, background: '#faf3ec', borderColor: '#d4a373', color: '#b57945' }}>
          💍 Ver Listado de Bodas
        </Link>
      </div>
    </div>
  );
}

const btnEstilo = {
  padding: '12px 16px',
  color: '#d4a373',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  border: '2px solid #d4a373',
  borderRadius: '8px',
  display: 'inline-block',
  transition: 'all 0.2s'
};

const btnListadoEstilo = {
  padding: '14px 18px',
  color: '#495057',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  background: '#f8f9fa',
  border: '1px solid #ced4da',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  transition: 'all 0.2s'
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PanelPrincipal />} />
      <Route path="/registro" element={<RegistroPersona />} />
      <Route path="/lista" element={<ListaPersonas />} />
      <Route path="/editar/:id" element={<ModificarPersona />} />
      <Route path="/registro-servicio" element={<RegistroServicio />} />
      <Route path="/lista-servicios" element={<ListaServicios />} />
      <Route path="/registro-planner" element={<RegistroPlanner />} />
      <Route path="/lista-planners" element={<ListaPlanners />} />
      <Route path="/agregar-boda" element={<RegistroBoda />} />
      <Route path="/lista-bodas" element={<ListaBodas />} />
    </Routes>
  );
}
