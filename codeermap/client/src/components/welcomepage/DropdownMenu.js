import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './style/DropdownMenu.css';

const DropdownMenu = () => {
  const { logout } = useAuth(); 
  const navigate = useNavigate();  
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <div className="dropdown-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
      <Link to="/home" className="menu-item" onClick={toggleMenu}>Home</Link>
        <Link to="/information" className="menu-item" onClick={toggleMenu}>Information</Link>
        <Link to="/SolarDashboard" className="menu-item" onClick={toggleMenu}>Solar Panel Dashboard</Link>
        <Link to="/BatteryDashboard" className="menu-item" onClick={toggleMenu}>Battery Dashboard</Link>
        <Link to="/user-account/personal-info" className="menu-item" onClick={toggleMenu}>User Account</Link>
        <Link to="/faq" className="menu-item" onClick={toggleMenu}>FAQ</Link>
        <Link to="/contact" className="menu-item" onClick={toggleMenu}>Contact</Link>
        <div className="logout-container">
          <button className="menu-item logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;