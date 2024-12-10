import React, { useState } from "react";
import axios from "axios";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import LoginButtons from "./LoginButtons";
import useRecaptchaV3 from "../captcha/Captcha";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./style/LoginPage.css";
import MFA from "./MFA"; // Import the MFA component
import MFALogin from "./MFALoginPage"
import MFAEmail from "./MFAEmail" 
import MfaVerificationPage from "./MfaVerificationPage";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [blockTime, setBlockTime] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [showMFALogin, setShowMFALogin] = useState(false); // Control MFA visibility
  const [mfaToken, setMfaToken] = useState(null); 
  const [userEmail, setUserEmail] = useState(""); // Store user email
  const [showMFAEmail, setShowMFAEmail] = useState(false);
  const [showMFAVerificationPage, setShowMFAVerificationPage] = useState(false);
  const { login } = useAuth();
  const executeRecaptcha = useRecaptchaV3('6Lc_A2EqAAAAANr-GXLMhgjBdRYWKpZ1y-YwF7Mk', 'login');
  
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };
  
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isBlocked) {
      const remainingTime = Math.ceil((blockTime - Date.now()) / 1000 / 60);
      showAlert('Account Blocked', `Your account is temporarily blocked due to too many failed login attempts. Try again in ${remainingTime} minutes.`);
      return;
    }
  
    try {
      setLoading(true);
      const recaptchaToken = await executeRecaptcha('login');
      const data = { ...formData, token: recaptchaToken };
      const response = await axios.post('http://localhost:5000/api/login', data);
      const {token} = response.data
      if (response.data.requireMFA) {
        setMfaToken(response.data.tempToken); // Store temporary token for MFA
        setUserEmail(formData.email); // Store email for MFA process
        await login(token);
        setLoginAttempts(0);
        Swal.fire({
          title: "MFA Required",
          text: "Please verify your identity using Multi-Factor Authentication.",
          icon: "info",
          showConfirmButton: true,
        });
        if (response.data.mfaMethod === "totp") {
        setShowMFALogin(true);
        }
        else if(response.data.mfaMethod === "email"){
        setShowMFAVerificationPage(true);
        }
      } else {
        await login(token);
        setLoginAttempts(0);
        showAlert('Login Successful', 'Redirecting...', 'success');
        
        Swal.fire({
          title: "Would you like to enable Multi-Factor Authentication (MFA)?",
          text: "For better account security, we recommend enabling MFA.",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Enable MFA",
          cancelButtonText: "Later",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Which MFA would you like to use??",
              text: "You can choose between Authy app (QR code) or email",
              icon: "info",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Authy",
              denyButtonText: "Email",
              cancelButtonText: "cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  setShowMFA(true);
                }
                else if (result.isDenied){
                  setShowMFAEmail(true);
                }  // Show MFA setup form
                else{
                  navigate("/home");  // Redirect to home page
                }
           });
          } else {
            navigate("/home");  // Redirect to home page
          }
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleMFASubmit = async () => {
   
    showAlert('MFA Verified', 'Redirecting...', 'success');
    setTimeout(() => navigate('/home'), 1000);

};
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setLoginAttempts(prev => prev + 1);
        if (loginAttempts + 1 >= 5) {
          setBlockTime(Date.now() + 15 * 60 * 1000);
          setIsBlocked(true);
          showAlert('Blocked', 'Too many failed attempts. Please try again in 15 minutes.');
        } else {
          const remainingAttempts = 5 - (loginAttempts + 1);
          showAlert('Login Error', "Invalid username or email. You have " + remainingAttempts + " attempts left.");
        }
      } else {
        showAlert('Server Error', 'Server error. Please try again later.');
      }
    } else {
      showAlert('Network Error', 'Network error. Please check your connection.');
    }
  };

  const showAlert = (title, message, type = 'error') => {
    const newAlert = { id: Date.now(), title, message, type, fading: false };
    setAlerts((prev) => [...prev, newAlert]);
  };

  return (
    <div className="login-container">
      {!showMFA && !showMFALogin && !showMFAEmail && !showMFAVerificationPage ? (
        <div className="login-left-panel">
          <h1>Log in to your account</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />
            <div className="login-checkbox-container">
              <div>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/password_reset" className="forgot-password-link">
                Forgot password?
              </a>
            </div>
            <div className="button">
              <LoginButtons onClick={handleSubmit} />
              <button type="button" className="cancel-button" onClick={() => navigate('/')}>
                Back to welcome page
              </button>
            </div>
            <div className="alert-container">
              {alerts.map((alert) => (
                <ErrorAlert
                  key={alert.id}
                  id={alert.id}
                  title={alert.title}
                  message={alert.message}
                  onClose={removeAlert}
                />
              ))}
            </div>
            {loading && <p>Logging in...</p>}
          </form>
        </div>
       ) : (
        showMFALogin ? (
          <MFALogin email={formData.email} onMFAVerified={handleMFASubmit} />
        ) : showMFAEmail ? (
          <MFAEmail email={formData.email} onMFAVerified={handleMFASubmit} />
        ) : showMFAVerificationPage ?(
          <MfaVerificationPage email={formData.email} onMFAVerified={handleMFASubmit} />
        ) :  (
          <MFA email={formData.email} onMFAVerified={handleMFASubmit} />
        )
      )}
    </div>
  );
};

export default LoginForm;
