import { useState, useEffect, useCallback } from 'react';

const useRecaptchaV3 = (siteKey) => {
    const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

    useEffect(() => {
        if (window.grecaptcha) {
            setIsRecaptchaReady(true);
        } else {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
            script.async = true;
            document.head.appendChild(script);
            script.onload = () => setIsRecaptchaReady(true);
            script.onerror = () => {
                console.error("Failed to load reCAPTCHA script.");
            };
        }
    }, [siteKey]);

    const executeRecaptcha = useCallback(async (action) => {
        if (isRecaptchaReady && window.grecaptcha) {
            try {
                const token = await window.grecaptcha.execute(siteKey, { action });
                console.log(`reCAPTCHA executed successfully for action "${action}". Token:`, token);
                return token;
            } catch (error) {
                console.error(`Failed to execute reCAPTCHA for action "${action}".`, error);
                return null;
            }
        } else {
            console.warn("reCAPTCHA is not ready or grecaptcha is undefined.");
            return null;
        }
    }, [isRecaptchaReady, siteKey]);

    return executeRecaptcha;
};

export default useRecaptchaV3;
