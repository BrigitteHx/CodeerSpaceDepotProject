const express = require('express');
const { 
    getUserProfile, 
    getUserInfo, 
    updateUserProfile, 
    deleteAccount, 
    uploadProfilePicture, 
    updateNotifications, 
    checkEmail, 
    toggleMFA,
    requestPasswordReset,
    resetPassword  } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.get('/user-info', verifyToken, getUserInfo);
router.get('/profile', verifyToken, getUserProfile);
router.put('/updateUserProfile', verifyToken, updateUserProfile);
router.delete('/deleteAccount', verifyToken, deleteAccount);
router.put('/uploadProfilePicture', verifyToken, uploadProfilePicture);
router.put('/updateNotifications', verifyToken, updateNotifications);
router.post('/check-email', checkEmail);
router.post('/toggle-mfa', toggleMFA);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
