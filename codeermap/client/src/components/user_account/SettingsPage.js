import React, { useState, useEffect } from "react";
import "./style/SettingsPage.css";
import { useAuth } from "../AuthContext"; // Context for user data and authentication token
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const { userData, setUserData, token } = useAuth();

  // Use effect to get user settings from API or localStorage
  useEffect(() => {
    if (token) {
      const authToken = localStorage.getItem("authToken");

      axios
        .get("/api/user-info", {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          setUserData(response.data.user);
          setTwoFactorAuth(response.data.user.mfa_enabled); // Sync MFA status
        })
        .catch((err) => {
          console.error("Failed to load user data:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load user data. Please try again later.",
          });
        });
    }

    // Set the initial state based on localStorage
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedTwoFactor = localStorage.getItem("twoFactorAuth");
    if (savedTwoFactor !== null) {
      setTwoFactorAuth(JSON.parse(savedTwoFactor));
    }
  }, [token, setUserData]);

  // Function to handle saving settings
  const handleSaveChanges = () => {
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your settings have been successfully saved!',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Function to handle Two Factor Auth
  const handleTwoFactorToggle = async () => {
  // Check if the user is already logged in
  if (userData && userData.loggedIn) { // Assuming userData has a `loggedIn` flag or similar logic
    Swal.fire({
      icon: 'warning',
      title: 'Action Required',
      text: 'To enable two-factor authentication, you need to log out first. Please log out and then try again.',
      showConfirmButton: true,
    });
    return;
  }

  // Proceed with toggling MFA only if the user is not logged in
  const action = twoFactorAuth ? "disable" : "enable";
  try {
    const response = await axios.post('http://localhost:5000/api/toggle-mfa', {
      email: userData.email,
      action: action
    });

    // Update the UI state based on success
    setTwoFactorAuth(!twoFactorAuth);
    Swal.fire({
      icon: 'success',
      title: response.data.message,
      text: `You have ${action === "enable" ? "enabled" : "disabled"} two-factor authentication.`,
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to toggle MFA. Please try again later.',
    });
  }
};


  // Function to handle notifications toggle
  const handleNotificationToggle = async () => {
    try {
      const newStatus = !notifications;
      setNotifications(newStatus);
      localStorage.setItem("notifications", JSON.stringify(newStatus)); // Save to localStorage

      await axios.put('http://localhost:5000/update-notifications', {
        notifications: newStatus
      }, {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, 
              "Content-Type": "application/json",
          },
      });

      Swal.fire({
        icon: 'success',
        title: 'Notification Setting Updated',
        text: `Notifications have been turned ${newStatus ? "on" : "off"}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update notification settings. Please try again.',
      });
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format. Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      // API request to send reset link
      const response = await axios.post('http://localhost:5000/api/password-reset', { email });
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Instructions Sent',
        text: 'Check your email for the password reset instructions.',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Email Not Registered',
            text: 'This email is not registered.',
          });
        } else if (error.response.status === 429) {
          Swal.fire({
            icon: 'error',
            title: 'Too Many Requests',
            text: 'You have reached the maximum number of password reset requests. Please try again later.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error Processing Request',
            text: 'There was an error processing your request. Please try again.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Please check your connection and try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h1>Settings</h1>
        <p>Customize your experience and preferences</p>
      </div>

      {/* Notification Setting */}
      <div className="settings-box">
        <h2>Notifications</h2>
        <div className="setting-item">
          <label>Enable Notifications:</label>
          <div className="toggle-switch">
            <button
              className={`toggle-btn ${notifications ? "on" : "off"}`}
              onClick={handleNotificationToggle}
            >
              {notifications ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="settings-box">
        <h2>Languages</h2>
        <div className="setting-item">
          <label htmlFor="language">Preferred Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-control"
          >
            <option value="English">English</option>
            <option value="Dutch">Dutch</option>
          </select>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="settings-box">
        <h2>Privacy</h2>
        <div className="setting-item">
          <label>Two-Factor Authentication:</label>
          <button
            className={`toggle-btn ${twoFactorAuth ? "on" : "off"}`}
            onClick={handleTwoFactorToggle}
          >
            {twoFactorAuth ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="settings-box">
        <h2>Change Password</h2>
        <p>If you want to change your password, enter your email and request a password reset.</p>

        {/* Email Input for Password Reset */}
        <div className="setting-item">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        {/* Message Display */}
        {message && (
          <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>
        )}

        <button onClick={handlePasswordReset} className="btn-save" disabled={loading}>
          {loading ? "Sending..." : "Send Password Reset Link"}
        </button>
      </div>

      {/* Sharing and Access */}
      <div className="settings-box">
        <h2>Sharing and Access</h2>
        <p>Manage access to your profile and shared content.</p>
        <Link to="/user-account/data-sharing" className="btn-save">Manage Sharing Settings</Link>
      </div>

      {/* Save Changes */}
      <div className="settings-box">
        <button onClick={handleSaveChanges} className="btn-save">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
