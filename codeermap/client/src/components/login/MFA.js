import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";  
import axios from "axios";
import Swal from "sweetalert2"; 
import "./style/LoginPage.css";

const MFA = ({ email, onMFAVerified }) => {
  const [mfaMethod, setMfaMethod] = useState(null);
  const [qrCode, setQrCode] = useState("");  
  const [totpToken, setTotpToken] = useState("");  
  const [error, setError] = useState("");  
  const [isMFAEnabled, setIsMFAEnabled] = useState(false); 

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/check-mfa-enabled", { params: { email } })
      .then((response) => {
        // Handle the response
      })
      .catch(() => setError("Error while checking MFA status"));

    axios
      .post("http://localhost:5000/api/setup-totp", { email })
      .then((response) => {
        setMfaMethod("totp");
        setQrCode(response.data.qrCodeUrl); 
      })
      .catch(() => setError("Error while fetching MFA setup"));
            
      },[email]);

  const handleSubmit = async (otpValue, event, email) => {
    event.preventDefault(); 

    const data = {
      email: email,   
      otp: otpValue,  
    };
    const response = await fetch('http://localhost:5000/api/verify-totp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      Swal.fire({
        title: "MFA Verified",
        text: "Your Multi-Factor Authentication was successful.",
        icon: "success",
        confirmButtonText: "Proceed",
      }).then(() => {
        onMFAVerified(); 
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Invalid OTP. Please try again.",
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
          {mfaMethod === "totp" && (
            <div className="login-mfa-setup">
              <h3 className="login-right-panel-description">
                Scan this QR code with your authenticator app
              </h3>
              <div>
              <QRCodeSVG value={qrCode} />
              </div>
              <div>
              <input
                type="text"
                className="login-input"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                placeholder="Enter TOTP"
              />
              <button
                className="login"
                onClick={(e) => handleSubmit(totpToken, e,email)}
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

export default MFA;