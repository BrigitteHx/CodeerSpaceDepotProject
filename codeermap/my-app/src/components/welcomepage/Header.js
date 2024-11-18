import React from 'react';
import logo from './images/logo.png';
import profile from './images/profile.png';
import { useAuth } from '../AuthContext';
import DropdownMenu from './DropdownMenu'; // Nieuwe component
import './style/Header.css';

const Header = () => {
  const { loggedIn, userData, error } = useAuth();

  return (
    <div className='navbar'>
      <a href='/'>
        <img className='logo' src={logo} alt='logo'></img>
      </a>
      
      <div className='headerMenu'>
        <div className='rightMenu'>
          {loggedIn ? (
            <>
              <ul>
                <a href='/home'><li>Home</li></a>
                <a href='/solar-panel-dashboard'><li>Solar Panels Dashboard</li></a>
                <a href='/battery-dashboard'><li>Battery Dashboard</li></a>
                <a href='/simulation'><li>Simulation</li></a>
              </ul>
              <img src={profile} alt='profile' className='profile'></img>
              <span>{userData?.name}</span>
              <DropdownMenu />
            </>
          ) : (
            <>
              <ul>
                <li>About Us</li>
                <li>Customer Service</li>
                <li>How it works?</li>
              </ul>
            </>
          )}

          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
