import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMfaVerified, setIsMfaVerified] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Function to check if the user is logged in
  const isLoggedIn = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') ? true : false;
  };
  const setMfaVerified = (status) => {
    setIsMfaVerified(status);
};
  // Function to fetch user data and MFA status
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    try {
      const response = await axios.get('http://localhost:5000/api/user/user-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      setError('Error fetching user data.');
      console.error('Error fetching user data:', error);
    }
  };

  // Function to handle login
  const login = async (token) => {
    localStorage.setItem('authToken', token); // Store token in localStorage
    setLoggedIn(true); // Set loggedIn state to true
    await fetchUserData(); // Fetch user data after login
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from localStorage
    sessionStorage.removeItem('authToken');
    setLoggedIn(false); // Set loggedIn state to false
    setMfaVerified(false); // Reset MFA status
    setUserData(null); // Reset user data
  };

  useEffect(() => {
    const checkLoginStatus = isLoggedIn();
    setLoggedIn(checkLoginStatus);
    if (checkLoginStatus) {
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, userData, error, setUserData, login, logout, isMfaVerified, setMfaVerified }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
