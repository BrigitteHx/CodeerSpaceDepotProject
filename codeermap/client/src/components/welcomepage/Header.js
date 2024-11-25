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
                <a href='/information'><li>Information</li></a>
                <a href='/SolarDashboard'><li>Solar Panels Dashboard</li></a>
                <a href='/BatteryDashboard'><li>Battery Dashboard</li></a>
              </ul>
              <img src={profile} alt='profile' className='profile'></img>
              <span>{userData?.name}</span>
              <DropdownMenu />
            </>
          ) : (
            <></>
          )}

          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Header;
