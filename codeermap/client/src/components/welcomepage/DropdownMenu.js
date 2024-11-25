import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  // Zorg ervoor dat je deze import hebt
import './style/DropdownMenu.css';

const DropdownMenu = () => {
  const { logout } = useAuth();  // Haal de logout functie op uit AuthContext
  const navigate = useNavigate();  // Gebruik de navigate functie voor redirects
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();  // Roep de logout functie aan
    navigate('/login');  // Redirect naar de loginpagina
  };

  return (
    <div className="dropdown-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
        <Link to="/information" className="menu-item" onClick={toggleMenu}>Information</Link>
        <Link to="/user-account" className="menu-item" onClick={toggleMenu}>User Account</Link>
        <Link to="/faq" className="menu-item" onClick={toggleMenu}>FAQ</Link>
        <Link to="/settings" className="menu-item" onClick={toggleMenu}>Settings</Link>
        <Link to="/dashboard-battery" className="menu-item" onClick={toggleMenu}>Battery Dashboard</Link>
        <Link to="/dashboard-solarpanel" className="menu-item" onClick={toggleMenu}>Solar Panel Dashboard</Link>
        <div className="logout-container">
          <button className="menu-item logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
