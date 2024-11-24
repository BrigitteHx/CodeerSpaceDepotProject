import React, { useState } from "react";
import axios from 'axios';
import './style/password_reset.css';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for feedback

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Validate email format
    if (!validateEmailFormat(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      setLoading(false); // Stop loading
      return;
    }

    try {
      // Request to the server to check if the email is registered
      const response = await axios.post('http://localhost:5000/api/password-reset', { email });
      setMessage("Password reset instructions have been sent to your email.");
      setIsSubmitted(true);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setMessage("This email is not registered.");
        } else if (error.response.status === 429) {
          setMessage("You have reached the maximum number of password reset requests. Please try again later.");
        } else {
          setMessage("There was an error processing your request. Please try again.");
        }
      } else {
        setMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="password-reset-container">
      <div className="password-reset-left-panel">
        <h1>Forgot password?</h1>
        <p>No worries, we’ll help you reset your password. Enter your email address below, and we’ll send you a link to reset it.</p>
      </div>

      <div className="password-reset-right-panel">
        <p><strong>Email address: *</strong></p>
        <form onSubmit={handleSubmit} className="password-reset-form">
          <input
            type="email"
            name="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={handleChange}
            className="password-reset-input"
            required
          />
          <button type="submit" className="password-reset-button" disabled={loading}>
            {loading ? "Sending..." : "Send Link!"}
          </button>
        </form>

        {message && (
          <p className="password-reset-message">{message}</p>
        )}

        <div className="password-reset-links">
          <a href="/login" className="password-reset-login-link">Remembered your password? Log in</a>
          <a href="/register" className="password-reset-register-link">No account yet? Register here</a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;