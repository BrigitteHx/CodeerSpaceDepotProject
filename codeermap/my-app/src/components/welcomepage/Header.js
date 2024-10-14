import React from 'react';
import './Style/Header.css';
import logo from './images/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span className="company-name">Solar Panel Simulation</span>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
      </div>

      <nav className="nav">
        <button>About Us</button>
        <button>Customer Service</button>
        <button>How it works?</button>
      </nav>
    </header>
  );
};

export default Header;
