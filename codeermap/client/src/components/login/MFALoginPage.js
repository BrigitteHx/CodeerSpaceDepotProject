import React, { useState } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";
import "./style/LoginPage.css"; 

const MFALoginPage = ({ email, onMFAVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/verify-mfa', { email, otp });

      if (response.data.success) {
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
          title: "Invalid OTP",
          text: "The OTP you entered is incorrect. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "There was an error verifying your OTP. Please try again later.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
    <div className="login-left-panel">
      <h1 className="login-right-panel-title">Enter your MFA code</h1>
      <form onSubmit={handleMfaSubmit} className="login-form">
        <input
          type="text"
          className="login-input"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          required
        />
        <button
          type="submit"
          className="login"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
    </div>
  );
};


export default MFALoginPage;
