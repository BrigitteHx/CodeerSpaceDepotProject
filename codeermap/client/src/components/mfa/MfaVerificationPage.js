import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Voor betere meldingen
import { useAuth } from "../AuthContext"; // Import de useAuth hook
import "./style/MfaStyle.css";

const MfaVerificationPage = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { setMfaVerified } = useAuth(); // Haal de setMfaVerified functie uit de context
    const email = location.state?.email;

    // Functie om de code te verifiëren
    const handleVerify = async () => {
        // Controleer of de code alleen cijfers bevat
        if (!/^\d+$/.test(code)) {
            Swal.fire({
                title: 'Fout',
                text: 'De code moet alleen cijfers bevatten.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/verify-mfa', { email, code });
            Swal.fire({
                title: 'Succes!',
                text: 'Verificatie geslaagd. Je wordt doorgestuurd naar de homepage.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                // Stel de MFA-verificatiestatus in als succesvol
                setMfaVerified(true);
                navigate('/home'); // Redirect naar de homepage na succesvolle verificatie
            });
        } catch (err) {
            Swal.fire({
                title: 'Fout',
                text: 'Ongeldige of verlopen code. Probeer opnieuw.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setError("Ongeldige of verlopen code. Probeer opnieuw.");
        } finally {
            setLoading(false);
        }
    };

    // Functie om een nieuwe code aan te vragen
    const handleResendCode = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/send-mfa-code', { email });
            Swal.fire({
                title: 'Code Verzonden!',
                text: 'Een nieuwe code is naar je e-mail verzonden.',
                icon: 'info',
                confirmButtonText: 'OK',
            });
        } catch (err) {
            Swal.fire({
                title: 'Fout',
                text: 'Fout bij het opnieuw verzenden van de code.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setError("Fout bij het opnieuw verzenden van de code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mfa-container">
            <h1>MFA Verificatie</h1>
            <p>Voer de code in die naar je e-mail is gestuurd.</p>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Voer code in"
                maxLength={6}
                className="mfa-input"
            />
            <div className="mfa-buttons">
                <button onClick={handleVerify} disabled={loading}>
                    {loading ? 'Verifiëren...' : 'Verifieer'}
                </button>
                <button onClick={handleResendCode} disabled={loading}>
                    {loading ? 'Verzend opnieuw...' : 'Verzend opnieuw'}
                </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Bezig met verwerken...</p>}
        </div>
    );
};

export default MfaVerificationPage;
