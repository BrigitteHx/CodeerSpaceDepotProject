import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Log out
    </button>
  );
};

export default LogoutButton;
