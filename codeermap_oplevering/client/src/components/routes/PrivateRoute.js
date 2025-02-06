import { Navigate } from "react-router-dom";

// PrivateRoute: Only for logged-in users
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  return token ? children : <Navigate to="/login" />;
};

// PublicRoute: Only for non-logged-in users (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  // If the user is logged in, redirect to the dashboard (or any protected page)
  return !token ? children : <Navigate to="/home" />;
};

export { PrivateRoute, PublicRoute };
