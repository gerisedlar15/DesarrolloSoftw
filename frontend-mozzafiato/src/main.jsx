import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Mantiene tus estilos globales si los tenés

// 1. Importamos el motor de rutas
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos la aplicación entera acá */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
