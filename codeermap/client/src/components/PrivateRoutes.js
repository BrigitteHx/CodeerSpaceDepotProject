import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Zorg ervoor dat deze import klopt

const PrivateRoute = ({ children, requireMfa = false }) => {
  const { loggedIn, mfaVerified } = useAuth(); // Gebruik de context om de status van de gebruiker en MFA te controleren

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  if (requireMfa && !mfaVerified) {
    // Als MFA vereist is en de gebruiker MFA niet heeft voltooid, redirect naar de MFA-pagina
    return <Navigate to="/mfa-verification" />;
  }

  return children;
};

export default PrivateRoute;
