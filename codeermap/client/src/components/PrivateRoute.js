import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  console.log("Token:", token); // Debugging: Check if token is retrieved
  
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
