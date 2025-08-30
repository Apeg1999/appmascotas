import React from 'react';
import './Sidebar.css'; 

// Agregamos onNavClick a los props del componente
const Sidebar = ({ onNewPetClick, onNavClick }) => { 
  return (
    <aside className="sidebar">
      {/*encabezado con logo y título*/}
      {/* <div className="sidebar-header">
        <img src="/icons/logo.png" alt="Paw Keeper Logo" className="logo" />
        <h2>Paw Keeper</h2>
      </div> */}

      {/* Botón "Nuevo integrante?" */}
      <button className="new-integrante-button" onClick={onNewPetClick}>
        <span className="icon">+</span> ¿Nuevo integrante?
      </button>

      {/* Navegación del Sidebar */}
      <nav className="sidebar-nav">
        <ul>
          {/* "Mis Mascotas" es vista principal*/}
          <li>
            <span role="img" aria-label="mascotas" className="nav-icon">🐾</span> 
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('home'); }}>MIS MASCOTAS</a>
          </li>
          

          <li>
            <span role="img" aria-label="jeringa" className="nav-icon">💉</span>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('vacunas'); }}>SEGUIMIENTO VACUNAS</a>
          </li>
          <li>
            <span role="img" aria-label="calendario" className="nav-icon">🗓️</span>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('citas'); }}>CITAS</a>
          </li>
          <li>
            <span role="img" aria-label="plato de comida" className="nav-icon">🍽️</span>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('alimentacion'); }}>ALIMENTACIÓN</a>
          </li>
          <li>
            <span role="img" aria-label="bicho" className="nav-icon">🪲</span>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('desparasitacion'); }}>DESPARASITACIÓN</a>
          </li>
          <li>
            <span role="img" aria-label="notas" className="nav-icon">📝</span>
            <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); onNavClick('notas'); }}>NOTAS</a>
          </li>
        </ul>
      </nav>
      {/* Si tienes un footer, puedes descomentar o añadirlo aquí */}
      {/* <div className="sidebar-footer">
        <p>© 2024 Paw Keeper</p>
      </div> */}
    </aside>
  );
};

export default Sidebar;