import React from 'react';
import logo from './images/logo.png';
import { useLocation, Link } from 'react-router-dom';
import defaultProfilePic from './images/profile.png'; // Default profile picture in case user doesn't have one
import { useAuth } from '../AuthContext';
import DropdownMenu from './DropdownMenu'; // Nieuwe component
import './style/Header.css';

const Header = () => {
  const { loggedIn, userData, error } = useAuth()
  const location = useLocation();
  const userId = userData?.id;

  const profilePic = userData?.profilePicture
    ? `http://localhost:5000${userData.profilePicture}` // If the user has a profile picture, use it
    : defaultProfilePic; // Otherwise, use the default profile ima

  const navItems = [
    { path: '/home', label: 'Home' },
    { path: '/information', label: 'Information' },
    { path: '/solar_dashboard', label: 'Solar Panels Dashboard' },
    { path: '/battery_dashboard', label: 'Battery Dashboard' },
    { path: '/simulation_dashboard' , label: 'Simulation Dashboard' },
  ];

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
                {navItems.map((item) => (
                  <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
              <img src={profilePic} alt='profile' className='profile'></img>
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
