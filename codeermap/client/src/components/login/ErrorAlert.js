import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import './style/SuccesAlert.css';

const SuccessAlert = ({ title, message, onClose, className }) => {
  useEffect(() => {
    Swal.fire({
      position: "top-end",
      iconHeight: 50,
      icon: "error", // You had "error" which may not be intended for a success alert.
      title: title, // Pass title as a string, not as {title}
      text: message, // Pass message as a string, not as {message}
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal-small',
      },
    }).then(() => {
      if (onClose) onClose(); // Optional callback after alert closes
    });
  }, [title, message, onClose]); // Dependencies to re-run the effect if props change

  return null; // This component doesn't render any UI, it just triggers the alert
};

export default SuccessAlert
