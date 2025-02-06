const express = require('express');
const { 
    register, 
    login,  
    setupTOTP,
    verifyTOTP,
    enableMFA,
    verifyMFA,
    setupMFAbyEmail,
    checkMFAStatus,
    verifyMFAEmail,
    sendMFACode,
    verifyEmailMFA,
    disableMFA,
    checkMFAEnabled } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setup-totp',  setupTOTP);
router.post('/verify-totp',  verifyTOTP);
router.post('/enable-mfa',  enableMFA);
router.post('/verify-mfa', verifyMFA);
router.post('/setup-mfa-by-email', setupMFAbyEmail);
router.get('/check-mfa-enabled', checkMFAStatus);
router.post('/verify-mfa-email', verifyMFAEmail)
router.post('/send-mfa-code', sendMFACode)
router.post('/verify-email-mfa', verifyEmailMFA);
router.post("/disable-MFA", disableMFA)
router.post("/check-mfa-enabled", checkMFAEnabled);

module.exports = router;