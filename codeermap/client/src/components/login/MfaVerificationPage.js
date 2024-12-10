import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext";
import "./style/LoginPage.css";

const MfaVerificationPage = ({ email, onMFAVerified }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setMfaVerified } = useAuth();

  const handleVerify = async () => {
    if (!/^\d+$/.test(code)) {
      Swal.fire({
        title: "Fout",
        text: "De code moet alleen cijfers bevatten.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/verify-mfa-email", { email, code });
      Swal.fire({
        title: "Succes!",
        text: "Verificatie geslaagd. Je wordt doorgestuurd naar de homepage.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setMfaVerified(true);
        navigate("/home");
      });
    } catch (err) {
      Swal.fire({
        title: "Fout",
        text: "Ongeldige of verlopen code. Probeer opnieuw.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Ongeldige of verlopen code. Probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/send-mfa-code", { email });
      Swal.fire({
        title: "Code Verzonden!",
        text: "Een nieuwe code is naar je e-mail verzonden.",
        icon: "info",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Fout",
        text: "Fout bij het opnieuw verzenden van de code.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setError("Fout bij het opnieuw verzenden van de code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container mfa-container">
      <div className="login-left-panel">
        <h1 className="login-right-panel-title">MFA Verificatie</h1>
        <p className="login-right-panel-description">
          Voer de code in die naar je e-mail is gestuurd.
        </p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Voer code in"
          maxLength={6}
          className="login-input"
        />
        <div className="login-form">
          <button onClick={handleVerify} disabled={loading} className="login">
            {loading ? "Verifiëren..." : "Verifieer"}
          </button>
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="cancel-button"
          >
            {loading ? "Verzenden..." : "Klik om code te verzenden."}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaVerificationPage ;
