import React, { useState } from "react";
import './Style/password_reset.css';

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Om de staat van indienen bij te houden

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dummy validatie voor email opmaak
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      return;
    }

    // Simulatie van een verzoek naar backend om wachtwoordherstel aan te vragen
    try {
      // const response = await axios.post('/api/password-reset', { email });
      setMessage("If this email is registered, you will receive an email with instructions to reset your password.");
      setIsSubmitted(true); // Formulier is succesvol ingediend
    } catch (error) {
      setMessage("There was an error processing your request. Please try again.");
    }
  };

  return (
    <div className="password-reset-container">

      <div className="password-reset-left-panel">
        <h1>Forgot password?</h1>
        <p>No worries, we’ll help you reset your password. Enter your email address below, and we’ll send you a link to reset it.</p>
      </div>

      <div className="password-reset-right-panel">
        <p> <strong>Email address: *</strong> </p>
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
          <button type="submit" className="password-reset-button">Send Link!</button>
        </form>

        {/* state om bij te houden of het formulier succesvol is ingediend.*/}
        {isSubmitted && message && (
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

