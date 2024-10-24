import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/password_reset.css';

function ResetPassword() {
    const { token } = useParams(); // Get the token from the URL parameters
    const navigate = useNavigate(); // Hook to navigate to another page
    const [newPassword, setNewPassword] = useState(''); // State for the new password
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming the new password
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [successMessage, setSuccessMessage] = useState(''); // State for success messages
    const [passwordStrength, setPasswordStrength] = useState(''); // State for password strength feedback

    const validatePasswordStrength = (password) => {
        const minLength = 8;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        const mediumPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

        if (password.length < minLength) {
            setPasswordStrength('Too Short');
            return false;
        } else if (strongPasswordRegex.test(password)) {
            setPasswordStrength('Strong');
            return true;
        } else if (mediumPasswordRegex.test(password)) {
            setPasswordStrength('Medium');
            return false;
        } else {
            setPasswordStrength('Weak');
            return false;
        }
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        validatePasswordStrength(password); // Validate the password strength in real-time
    };

    const handleResetPassword = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        
        // Validate password strength
        const isValidPassword = validatePasswordStrength(newPassword);
        if (!isValidPassword) {
            setErrorMessage('Your password does not meet the required strength.');
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        // Make API call to reset the password
        try {
            const response = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }), // Send the token and new password
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setTimeout(() => {
                    navigate('/login'); // Redirect to login page after 2 seconds
                }, 2000);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred, please try again.');
        }
    };

    return (
        <div className="new-password-container">
            <div className="new-password-panel">
                <h1>Solar Panel Simulation</h1>
                <p>Reset your password to regain access to your account.</p>

                <form className="password-reset-form" onSubmit={handleResetPassword}>
                    <h2>Reset Password</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                    {/* Real-time feedback on password strength */}
                    <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                        Password Strength: {passwordStrength}
                    </p>
                    <input 
                        type="password" 
                        className="password-reset-input"
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={handlePasswordChange} 
                        required 
                    />

                    {/* Confirm Password input */}
                    <input 
                        type="password" 
                        className="password-reset-input"
                        placeholder="Confirm Password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="password-reset-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;