import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import "./style/LoginPage.css";

const MFAEmail = ({ email, onMFAVerified }) => {
  const [mfaMethod, setMfaMethod] = useState(null);
  const [error, setError] = useState("");
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/check-mfa-enabled", { params: { email } })
      .then((response) => {
      })
      .catch(() => setError("Error while checking MFA status"));

    axios
      .post("http://localhost:5000/api/setup-mfa", { email })
      .then((response) => {
        setMfaMethod("email");
      })
      .catch(() => setError("Error while fetching MFA setup"));
  }, [email]);

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
                className="login-input"
                placeholder="Enter TOTP"
              />
              <button
                className="login"
              >
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