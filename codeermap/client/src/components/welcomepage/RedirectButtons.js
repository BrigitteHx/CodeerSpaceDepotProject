import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from './ErrorAlert';

const RedirectButtons = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  const handleNavigateWithError = (targetPath) => {
    try {
      // Simulated error message
      // if (targetPath === '/login') {
      //   throw new Error('Simulated navigation error');
      // }
      navigate(targetPath);
    } catch (error) {
      const newAlert = {
        id: Date.now(),
        title: 'Navigation Error',
        message: error.message,
        fading: false,
      };
      setAlerts((prevAlerts) => [...prevAlerts, newAlert]);

      // Set timeout to remove alert
      setTimeout(() => {
        fadeOutAlert(newAlert.id);
      }, 4000);
    }
  };

  const fadeOutAlert = (id) => {
    // Add 'hide' class for fade-out animation
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, fading: true } : alert
      )
    );

    // Remove the alert after the fade-out animation
    setTimeout(() => {
      removeAlert(id);
    }, 1000); // Duration of fade-out
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div>
      <button className='login' onClick={() => handleNavigateWithError('/login')}>Login</button>
      <button className='register' onClick={() => handleNavigateWithError('/register')}>Register</button>

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

export default RedirectButtons;
