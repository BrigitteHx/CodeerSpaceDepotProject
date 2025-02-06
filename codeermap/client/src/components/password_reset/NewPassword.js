import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style/password_reset.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Password visibility state

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
        validatePasswordStrength(password);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
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
            const response = await fetch('http://localhost:5000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage(data.message);
                setTimeout(() => {
                    navigate('/login');
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
                    
                    {/* New Password input */}
                    <div className="password-input-container">
                        <input 
                            type={showPassword ? "text" : "password"}
                            className="password-reset-input"
                            placeholder="New Password" 
                            value={newPassword} 
                            onChange={handlePasswordChange} 
                            required 
                        />
                        <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>

                    {/* Confirm Password input */}
                    <div className="password-input-container">
                        <input 
                            type={showPassword ? "text" : "password"} // You may want to handle confirm password visibility separately if desired
                            className="password-reset-input"
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                        <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </div>
                    </div>

                    <button type="submit" className="password-reset-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
