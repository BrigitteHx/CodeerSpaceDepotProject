import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import useRecaptchaV3 from "../captcha/Captcha"; 
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing React Icons for eye toggle
import { getFunctions, httpsCallable } from 'firebase/functions'; 
import "./style/RegisterForm.css"; 

const RegisterForm = () => {
  const navigate = useNavigate(); 
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  };
  const locations = [
    "Amsterdam",
    "Rotterdam",
    "Den Haag",
    "Utrecht",
    "Eindhoven",
    "Groningen",
    "Maastricht",
    "Tilburg",
    "Leiden",
    "Delft",
  ];
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize reCAPTCHA
  const executeRecaptcha = useRecaptchaV3('6Lc_A2EqAAAAANr-GXLMhgjBdRYWKpZ1y-YwF7Mk', 'register');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Functie om wachtwoordsterkte te valideren
  const validatePasswordStrength = (password) => {
    const minLength = 8; // Minimale lengte van het wachtwoord

    // Regex voor meer beveiliging (minimaal 8 tekens, 1 hoofdletter, 1 cijfer en 1 speciaal teken)
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }

    if (!strongPasswordRegex.test(password)) {
      return 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character.';
    }

    return ''; // Als het wachtwoord geldig is, geef een lege string terug
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError(null); 

    // Valideer wachtwoordsterkte
    const passwordError = validatePasswordStrength(formData.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Valideer dat de wachtwoorden overeenkomen
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that the password is at least 8 characters long
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that phoneNumber contains only numbers
    const phoneNumberPattern = /^\d+$/;
    if (!phoneNumberPattern.test(formData.phoneNumber)) {
      setError("Phone number must contain only numbers");
      setLoading(false); // Stop loading
      return; // Exit the function
    }

    // Validate that the phone number is at least 5 digits long
    if (formData.phoneNumber.length < 5) {
      setError("Phone number must be at least 5 numbers long");
      setLoading(false); // Stop loading
      return; // Exit the function
    }
    
    try {
      // Send the actual form data to the API
      await axios.post('http://localhost:5000/api/register', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
      });

      Swal.fire({
        position: "top-end",
        iconHeight: 50,
        icon: "success",
        title: "Registration Successful!",
        text: "User registered successfully",
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: 'swal-small'
        }
      });

      setIsSubmitted(true); 
    } catch (error) {
      console.log("Error registering:", error);
      setError("Error registering user. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  if (isSubmitted) {
    return (
      <div className="confirmation-container">
        <h1>Registration Successful!</h1>
        <p>Welcome, {formData.name}! Your account has been successfully created.</p>
        <p>You can now <strong> <a href="/login">log in</a> </strong> to access your dashboard and start managing your energy consumption.</p>
        <p>Thank you for joining us!</p>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-left-panel">
        <h1>Create your account!</h1>
        <p>
          Register to access your personal dashboard and real-time monitoring of
          your solar yield and battery status.
        </p>
        <p>Fill in the details to start optimizing your energy management.</p>
      </div>
      <div className="register-right-panel">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="First and last name *"
            value={formData.name}
            onChange={handleChange}
            className="register-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
            required
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              required
            />
            <div
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          <div className="password-input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password *"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="register-input"
              required
            />
            <div
              className="password-toggle-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone number *"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="register-input"
            required
          />
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="register-input"
            required
          >
            <option value="" disabled>
              Choose a location *
            </option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <div className="register-checkbox-container">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              By signing up, I agree with the <a href="/">Terms of Use</a> &amp;
              <a href="/">Privacy Policy</a>.
            </label>
          </div>
          
          <div className="register-button-container">
            <button type="submit" className="register-submit-button" disabled={loading}>
              {loading ? "Registering..." : "Sign up"}
            </button>
            <button type="button" className="register-cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          {error && <p className="register-error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
