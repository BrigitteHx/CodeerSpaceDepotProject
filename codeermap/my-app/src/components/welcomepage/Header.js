import React, { useState } from 'react';
import './style/Header.css';
import logo from './images/logo.png';
import profile from './images/profile.png';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

const Header = () => {
  const { loggedIn, userData, logout, error } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <a href="/">
        <img className="logo" src={logo} alt="logo" />
      </a>
      <div className="headerMenu">
        <div className="rightMenu">
          <ul>
            <li>About Us</li>
            <li>Customer Service</li>
            <li>How it works?</li>
          </ul>
          {loggedIn && (
            <>
              <img src={profile} alt="profile" className="profile" />
              <span>{userData?.name}</span>
            </>
          )}
          {error && <div className="error">{error}</div>}

          {/* Menu icon with conditional class */}
          <div className={`menu-icon ${isMenuOpen ? 'menu-open' : ''}`} onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Menu with close button */}
          <Menu right isOpen={isMenuOpen} disableOverlayClick>
            <button className="menu-close" onClick={toggleMenu}>&times;</button>
            <Link to="/information" className="menu-item" onClick={toggleMenu}>Information</Link>
            <Link to="/faq" className="menu-item" onClick={toggleMenu}>FAQ</Link>
            <Link to="/contact" className="menu-item" onClick={toggleMenu}>Contact</Link>
            <Link to="/user-account" className="menu-item" onClick={toggleMenu}>User Account</Link>
            <Link to="/settings" className="menu-item" onClick={toggleMenu}>Settings</Link>
            <Link to="/dashboard-solarpanel" className="menu-item" onClick={toggleMenu}>Dashboard Solar Panel</Link>
            <Link to="/dashboard-battery" className="menu-item" onClick={toggleMenu}>Dashboard Battery</Link>
            <button className="menu-item logout-button" onClick={handleLogout}>Logout</button>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
