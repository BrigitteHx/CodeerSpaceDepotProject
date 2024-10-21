import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import LoginButtons from "./LoginButtons";
import "./Style/LoginPage.css";

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
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate(); // To redirect users after a successful login.

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is blocked
    if (isBlocked) {
      const remainingTime = Math.ceil((blockTime - Date.now()) / 1000 / 60); // in minutes
      showAlert('Account Blocked', `Your account is temporarily blocked due to too many failed login attempts. Try again in ${remainingTime} minutes.`);
      return;
    }

    try {
      setLoading(true); // Show loading state
      const response = await axios.post('http://localhost:5000/api/login', formData); // Send login data to the API
      const { token } = response.data;

      // Save the token in localStorage or sessionStorage
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      } else {
        sessionStorage.setItem('authToken', token);
      }

      setLoginAttempts(0); // Reset failed attempts
      showAlert('Login Successful', 'Redirecting to your dashboard...', 'success'); // Toon succesmelding met groene alert

      setTimeout(() => {
        navigate('/dashboard'); // Redirect to the dashboard after successful login
      }, 1000); // Short delay to show feedback

    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to welcome page (or another page)
  };
  
  // Error handling function
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        setLoginAttempts(prev => prev + 1);
        
        // Block the account after 5 failed attempts
        if (loginAttempts + 1 >= 5) {
          setBlockTime(Date.now() + 15 * 60 * 1000); // Block for 15 minutes
          setIsBlocked(true);
          showAlert('Blocked', 'Too many failed attempts. Please try again in 15 minutes.');
        } else {
          const remainingAttempts = 5 - (loginAttempts + 1);
          showAlert('Login Error', `Invalid username or email. You have ${remainingAttempts} attempts left.`);
        }
      } else {
        showAlert('Server Error', 'Server error. Please try again later.');
      }
    } else {
      showAlert('Network Error', 'Network error. Please check your connection.');
    }
  };

  // Functie om meldingen te tonen
  const showAlert = (title, message, type = 'error') => {
    const newAlert = {
      id: Date.now(),
      title,
      message,
      type, // Voeg het type alert toe (error of success)
      fading: false,
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    if (isBlocked && blockTime) {
      const timer = setInterval(() => {
        if (Date.now() >= blockTime) {
          setIsBlocked(false); // Unblock the user after the timeout
          setLoginAttempts(0); // Reset attempts
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTime]);

  return (
    <div className="login-container">
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
            aria-label="Email Address" 
          />
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
            aria-label="Password" 
          />
          <div className="login-checkbox-container">
            <div>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                aria-label="Remember me" 
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/password_reset" className="forgot-password-link">Forgot password?</a>
          </div>
          
          <div className="button">
          <LoginButtons onClick={handleSubmit} />
            {/* Add the cancel button here */}
            <button type="button" className="cancel-button" onClick={handleCancel}>Back to welcome page</button>
          </div>

          <div className="alert-container">
            {alerts.map((alert) => (
              alert.type === 'success' ? (
                <SuccessAlert
                  key={alert.id}
                  id={alert.id}
                  title={alert.title}
                  message={alert.message}
                  onClose={removeAlert}
                  className=""
                />
              ) : (
                <ErrorAlert
                  key={alert.id}
                  id={alert.id}
                  title={alert.title}
                  message={alert.message}
                  onClose={removeAlert}
                  className=""
                />
              )
            ))}
          </div>

          {/* Display a subtle loading indicator while redirecting */}
          {loading && <p>Logging in...</p>}
        </form>

        <div className="navigation-links">
          <p className="login-signup-prompt">
            Don't have an account? <a href="/register" className="register-link">Register here</a>
          </p>
        </div>

        <div className="login-or-divider">
          <span>OR</span>
        </div>
        <div className="login-social-login">
          <button className="login-social-button facebook">f</button>
          <button className="login-social-button google">G</button>
          <button className="login-social-button apple"></button>
        </div>
      </div>
      <div className="login-right-panel">
        <h1>Welcome back!</h1>
        <p>
          Log in to your account to access your dashboard and continue optimizing
          your energy management.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
