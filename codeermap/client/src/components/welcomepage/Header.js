import React from 'react';
import logo from './images/logo.png';
import profile from './images/profile.png';
import defaultProfilePic from './images/profile.png'; // Default profile picture in case user doesn't have one
import { useAuth } from '../AuthContext';
import DropdownMenu from './DropdownMenu'; // Nieuwe component
import './style/Header.css';

const Header = () => {
  const { loggedIn, userData, error } = useAuth();

  const profilePic = userData?.profilePicture
    ? `http://localhost:5000${userData.profilePicture}` // If the user has a profile picture, use it
    : defaultProfilePic; // Otherwise, use the default profile ima
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
                <a href='/solar_dashboard'><li>Solar Panels Dashboard</li></a>
                <a href='/battery_dashboard'><li>Battery Dashboard</li></a>
              </ul>
              <img src={profilePic} alt='profile' className='profile' />
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
