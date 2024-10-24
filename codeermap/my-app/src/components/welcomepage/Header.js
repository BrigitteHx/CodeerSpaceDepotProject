import React from 'react';
import './style/Header.css';
import logo from './images/logo.png';
import profile from './images/profile.png';
import LogoutButton from '../logout/LogoutButton'; 
import { useAuth } from '../AuthContext';

const Header = () => {
  const { loggedIn, userData, error, handleLogout } = useAuth();

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
                <li>About Us</li>
                <li>Customer Service</li>
                <li>How it works?</li>
              </ul>

              <img src={profile} alt='profile' className='profile'></img>
              <span>{userData?.name}</span>
              <LogoutButton />
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

          {error && <div className="error">{error}</div>} {/* Display error message */}

          <div className="menu-icon">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
