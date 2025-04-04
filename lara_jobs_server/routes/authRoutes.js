const express = require('express')
const authRoutes = express.Router();

const authController = require('../controllers/authentication/authenticationController');

authRoutes.post('/verify-email-otp', authController.verifyEmailOTP);

authRoutes.post('/verify-phone-otp', authController.verifyPhoneOTP);

authRoutes.post('/resend-email-otp', authController.resendOtpHandler);

authRoutes.post('/login', authController.login);

authRoutes.post('/password-reset-email', authController.sendPasswordResetEmail);

authRoutes.post('/reset-password', authController.resetPassword);

module.exports = authRoutes