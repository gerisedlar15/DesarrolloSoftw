import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RegistroPersona from "./components/RegistroPersona";

// Componente temporal para el Panel Principal (luego lo pasaremos a su propio archivo)
function PanelPrincipal() {
  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h2>Panel Principal - Mozzafiato</h2>
      <Link to="/registro" style={{ color: '#d4a373', textDecoration: 'none', fontWeight: 'bold' }}>
        Ir a Agregar Persona →
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Cuando la URL esté vacía (/), muestra el Panel Principal */}
        <Route path="/" element={<PanelPrincipal />} />
        
        {/* Cuando la URL sea /registro, muestra tu formulario */}
        <Route path="/registro" element={<RegistroPersona />} />
      </Routes>
    </BrowserRouter>
  );
}