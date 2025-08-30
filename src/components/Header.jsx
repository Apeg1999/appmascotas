import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        {/* icono de mascota */}
        <span role="img" aria-label="pata de mascota" style={{ fontSize: '2em', marginRight: '10px' }}>🐾</span>
        <h1 className="app-title">PAW KEEPER</h1>
      </div>
      
    </header>
  );
};

export default Header;