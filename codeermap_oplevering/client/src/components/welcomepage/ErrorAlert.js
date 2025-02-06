import React from 'react';
import './style/ErrorAlert.css';

const ErrorAlert = ({ id, title, message, onClose, className }) => {
  return (
    <div className={`error-alert ${className}`}>
      <div className="error-alert-content">
        <div className="error-alert-icon" onClick={() => onClose(id)}>
          <span className="error-alert-close">✖</span>
        </div>
        <div className="error-alert-text">
          <strong>{title}</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;