import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import "../login/style/LoginPage.css";

const EmailMFA = ({ email, onMFAVerified }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setMfaVerified } = useAuth();
  
  // useEffect to fetch and set MFA method and verify MFA status
  useEffect(() => {
    // Fetch MFA setup for the given email
    axios
      .post("http://localhost:5000/api/setup-mfa", { email })
      .then((response) => {
        // Optionally handle success logic here
      })
      .catch(() => setError("Error while fetching MFA setup"));

    // Fetch MFA enabled status for the user
    axios
      .get("http://localhost:5000/api/check-mfa-enabled", { params: { email } })
      .then((response) => {
        // Handle MFA enabled response logic here if needed
      })
      .catch(() => setError("Error while checking MFA status"));
  }, [email]);

  // Function to verify the MFA code
  const handleVerify = async () => {
    if (!/^\d+$/.test(code)) {
      Swal.fire({
        title: "Error",
        text: "The code must contain only numbers.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      // Send the MFA code and email to the backend for verification
      const response = await axios.post("http://localhost:5000/api/verify-mfa-email", { email, code });

      if (response.status === 200) {
        // If verification is successful
        Swal.fire({
          title: "Success!",
          text: "Verification successful. The page will refresh.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setMfaVerified(true); // Mark MFA as verified
          window.location.reload();  // Refresh the page to reflect MFA status
        });
      }
    } catch (err) {
      // Error handling for failed verification
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Invalid or expired code. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to resend the MFA code
  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/send-mfa-code", { email });
      Swal.fire({
        title: "Code Sent!",
        text: "A new code has been sent to your email.",
        icon: "info",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error when resending the code.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Error when resending the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container mfa-container">
      <div className="login-left-panel">
        <h1 className="login-right-panel-title">MFA Verification</h1>
        <p className="login-right-panel-description">
          Enter the code sent to your email.
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
          <button 
            onClick={handleVerify} 
            disabled={loading || !code}  // Disable if no code or loading
            className="login"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="cancel-button"
          >
            {loading ? "Sending..." : "Click to resend code"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}  {/* Display error if any */}
      </div>
    </div>
  );
};

export default EmailMFA;
