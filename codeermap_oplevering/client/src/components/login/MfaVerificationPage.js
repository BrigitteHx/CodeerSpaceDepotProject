import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import "./style/LoginPage.css";

const MfaVerificationPage = ({ email, onMFAVerified }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setMfaVerified } = useAuth();

  const handleVerify = async () => {
    if (!/^\d+$/.test(code)) {
      Swal.fire({
        title: "Error",
        text: "The code must only contain numbers.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-email-mfa", { email, code });
      Swal.fire({
        title: "Success!",
        text: "Verification successful. You will be redirected to the homepage.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setMfaVerified(true);
        navigate("/home");
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: "Invalid or expired code. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-mfa-code", { email });
      Swal.fire({
        title: "Code Sent!",
        text: "A new code has been sent to your email.",
        icon: "info",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error while resending the code.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Error while resending the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container mfa-container">
      <div className="login-left-panel">
        <h1 className="login-right-panel-title">MFA Verification</h1>
        <p className="login-right-panel-description">
          Enter the code that was sent to your email.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          maxLength={6}
          className="login-input"
        />
        <div className="login-form">
          <button onClick={handleVerify} disabled={loading} className="login">
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="cancel-button"
          >
            {loading ? "Sending..." : "Click to resend code."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaVerificationPage;
