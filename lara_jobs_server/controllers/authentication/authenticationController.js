const jwt = require('jsonwebtoken');
const handleError = require('../../errors/errorHandler');
const bcrypt = require('bcrypt');
const { Candidate } = require('../../models');
const authService = require('../../services/authentication/authService');
const candidateService = require('../../services/candidate/candidateService');
const { transporter } = require('../../utils/email/emailUtils');
const { baseURL } = require('../../config/baseURLConig');

const jwtSecret = process.env.JWT_SECRET;

const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyEmailOTP(email, otp);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        handleError(res, error)
    }
};

const verifyPhoneOTP = async (req, res) => {
    try {
        const { candidateId, otp } = req.body;
        await authService.verifyPhoneOTP(candidateId, otp);
        res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (error) {
        handleError(res, error)
    }
};

const resendOtpHandler = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await candidateService.resendOtp(email);
        return res.status(200).json(result);
    } catch (error) {
        console.log("Error while resending OTP:", error);
        return handleError(res, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(`Email : ${email}, : password : ${password}`)

        const { unique_id, token, role, emailId } = await authService.loginCandidate(email, password);
        return res.status(200).json({
            message: 'Login Success',
            unique_id,
            token,
            role,
            emailId
        });
    } catch (error) {
        console.log("Error while resending OTP:", error);
        return handleError(res, error);
    }
};

const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email received : ", email)
        // Check if the email exists in the database
        const candidate = await Candidate.findOne({ where: { email } });
        if (!candidate) {
            return res.status(403).send({ message: 'No account exists with this email ID.' });
        }
        console.log("Candidate found ", candidate)
        // Generate unique token using JWT
        const token = jwt.sign({ candidateId: candidate.id }, jwtSecret, { expiresIn: '30m' });

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Password Reset Request',
            html: `
               <html>
                    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f7fafc;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #2c5282; text-align: center; font-size: 24px;">Password Reset Request</h2>
                            <p style="text-align: center; font-size: 18px;">Hello,</p>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                                We received a request to reset the password associated with your account.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                                To proceed with the password reset, please click on the button below:
                            </p>
                            <div style="text-align: center; margin-bottom: 16px;">
                                <a href="${baseURL}/resetPassword?token=${token}" 
                                style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                    Reset Password
                                </a>
                            </div>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                                If you did not request a password reset, you can ignore this email.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                                Please note that the link will expire after 30 minutes, so make sure to reset your password promptly.
                            </p>
                            <p style="text-align: center; margin-top: 20px;">
                                <span style="font-size: 14px; color: #718096;">Thank you,</span><br>
                                <span style="font-size: 14px; color: #718096;">Lara Team</span>
                            </p>
                        </div>
                    </body>
                </html>`
        };


        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);
        console.log('Reset Link : ', `${baseURL}/resetPassword?token=${token}`)
        return res.status(200).send({ success: true, message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).send({ success: false, message: 'An error occurred while sending the password reset email.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.query.token; // Get the token from the query parameters which is sent to along with the email link

        if (!token) {
            return res.status(400).send({ message: 'Token is missing.' });
        }

        // Verify the JWT token whether it is the same token sent through email
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error('Error verifying token:', err);
                return res.status(403).send({ message: 'Invalid or expired token.' });
            } else {
                // Token verification succeeded
                const candidateId = decoded.candidateId;

                try {
                    const user = await Candidate.findByPk(candidateId);
                    if (!user) {
                        return res.status(404).send({ message: 'User not found.' });
                    }
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                    await Candidate.update({ password: hashedPassword }, { where: { id: candidateId } });

                    res.status(200).send({ message: 'Password updated successfully.' });
                } catch (error) {
                    console.error('Error finding user:', error);
                    res.status(500).send({ message: 'An error occurred while resetting the password.' });
                }
            }
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send({ message: 'An error occurred while resetting the password.' });
    }
};

module.exports = {
    verifyEmailOTP,
    verifyPhoneOTP,
    resendOtpHandler,
    login,
    sendPasswordResetEmail,
    resetPassword
}