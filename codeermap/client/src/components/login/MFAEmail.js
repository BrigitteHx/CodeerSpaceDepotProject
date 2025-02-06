import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import "./style/LoginPage.css";

const MFAEmail = ({ email, onMFAVerified }) => {
  const [code, setCode] = useState('');
  const [mfaMethod, setMfaMethod] = useState(null);
  const [error, setError] = useState("");
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);

  useEffect(() => {
    if (!email) return;
  
    let isSubscribed = true; // Prevent state updates after unmount
    let hasExecuted = false; // Ensure the effect only runs the API call once
  
    if (!hasExecuted) {
      hasExecuted = true; // Mark as executed
  
      axios
        .post("http://localhost:5000/api/auth/setup-mfa-by-email", { email })
        .then(() => {
          if (isSubscribed) setMfaMethod("email");
        })
        .catch(() => {
          if (isSubscribed) setError("Error initiating MFA setup. Please try again.");
        });
    }
  
    return () => {
      isSubscribed = false; // Cleanup on unmount
    };
  }, [email]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-mfa-email", {
        email,
        code,
      });

      if (response.status === 200) {
        Swal.fire({
          title: "MFA Verified",
          text: "Your Multi-Factor Authentication was successful.",
          icon: "success",
          confirmButtonText: "Proceed",
        }).then(() => onMFAVerified());
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Invalid MFA code. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <h2 className="login-right-panel-title">Enable Multi-Factor Authentication</h2>
        <div className="login-form">
          {mfaMethod === "email" && (
            <div className="login-mfa-setup">
              <h3 className="login-right-panel-description">
                Scan this QR code with your authenticator app
              </h3>
              <div>
              </div>
              <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter MFA Code"
                className="login-input"
              />
              <button type="submit" className="login" onClick={handleSubmit}>
                Verify
              </button>
              </div>
              <div/>
            </div>
          )}
          {isMFAEnabled && (
            <div className="login-mfa-enabled">
              <h3>MFA is already enabled on your account.</h3>
            </div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default MFAEmail;