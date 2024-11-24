import React from 'react';
import './style/SuccesAlert.css';

const SuccessAlert = ({ id, title, message, onClose, className }) => {
  return (
    <div className={`success-alert ${className}`} role="alert">
      <div className="success-alert-content">
        <div className="success-alert-icon" onClick={() => onClose(id)}>
          <span className="success-alert-close">✖</span>
        </div>
        <div className="success-alert-text">
          <strong>{title}</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
