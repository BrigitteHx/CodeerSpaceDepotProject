// LoginButtons.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from './ErrorAlert';


const LoginButtons = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  const handleNavigateWithError = (targetPath) => {
    try {
      navigate(targetPath);
    } catch (error) {
      const newAlert = {
        id: Date.now(),
        title: 'Navigatie Fout',
        message: error.message,
        fading: false,
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      setTimeout(() => {
        fadeOutAlert(newAlert.id);
      }, 4000);
    }
  };

  const fadeOutAlert = (id) => {
    // 'hide' class toe voor fade-out animatie
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, fading: true } : alert
      )
    );

    setTimeout(() => {
      removeAlert(id);
    }, 1000); // Duur van fade-out
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const handleLogin = () => {
    handleNavigateWithError('/login');
  };

  return (
    <div>
      <button className='login' onClick={handleLogin}> Login </button>

      <div className="alert-container">
        {alerts.map((alert) => (
          <ErrorAlert
            key={alert.id}
            id={alert.id}
            title={alert.title}
            message={alert.message}
            onClose={removeAlert}
            className={alert.fading ? 'hide' : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginButtons;
