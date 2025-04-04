const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CustomError = require('../../errors/CustomErrors');
const Candidate = require('../../models/candidate');
const OTPVerification = require('../../models/otpVerfication')



const JWT_SECRET = process.env.JWT_SECRET


const verifyEmailOTP = async (email, otp) => {
    try {

        const candidate = await Candidate.findOne({
            where : {email : email}
        })

        if (!candidate) {
            throw new CustomError('Candidate not found', 'NOT_FOUND');
        }

        // Find the OTP record based on candidateId and OTP
        const verification = await OTPVerification.findOne({
            where: { candidate_id: candidate.id, otp_email: otp },
        });

        // If OTP not found, throw error
        if (!verification) {
            throw new CustomError('Invalid OTP', 'INVALID_OTP')
        }

        // Get the OTP sent time (stored in UTC)
        const otpSentAt = verification.otp_email_sent_at;

        // Get the current time in UTC
        const currentTimeUTC = new Date().toISOString(); // Get the current UTC time

        // Calculate the expiry time (10 minutes from OTP sent time)
        const expiryTime = 10 * 60 * 1000;
        const otpSentTime = new Date(otpSentAt).getTime();
        const currentTime = new Date(currentTimeUTC).getTime();

        // Check if OTP has expired (more than 10 minutes)
        if (currentTime - otpSentTime > expiryTime) {
            throw new CustomError('OTP expired', 'OTP_EXPIRED')
        }

        // OTP is valid and not expired, update candidate email_verified status
        await Candidate.update(
            { email_verified: true },
            { where: { id: candidate.id } }
        );

        return true;
    } catch (error) {
        console.log('Error while verifying the Email otp : ', error)
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred',+ error.message, 'DATABASE_ERROR');
        }

        if(error.code === 'OTP_EXPIRED'){
            throw new CustomError('The OTP has expired.'+ error.message, 'OTP_EXPIRED')
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        if(error.code === 'INVALID_OTP'){
            throw new CustomError('Error while validating OTP'+ error.message, 'INVALID_OTP')
        }

        throw new CustomError('Error creating candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const verifyPhoneOTP = async (candidateId, otp) => {
    try {
        const verification = await OTPVerification.findOne({
            where: { candidate_id: candidateId, otp_phone: otp },
        });
        if (!verification) {
            throw new Error('Invalid OTP');
        }

        await Candidate.update(
            { phone_verified: true },
            { where: { id: candidateId } }
        );
        return true;
    } catch (error) {
        throw new CustomError('Error verifying phone OTP: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const loginCandidate = async (email, password) => {
    try {
        // console.log(`Service method : Email : ${email}, : password : ${password}`)

        // Check if the candidate exists
        const candidate = await Candidate.findOne({
            where : {email : email}
        })

        if (!candidate) {
            throw new CustomError('Candidate with this email does not exist.', 'NOT_FOUND');
        }

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (!isPasswordValid) {
            throw new CustomError('Invalid credentials.', 'INVALID_CREDENTIALS');
        }

        // Generate JWT token after successful login
        const payload = {
            email: candidate.email,
            unique_id: candidate.unique_id,
            id: candidate.id,
            role: candidate.role,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); //token expires after 7 days

        // Return the candidate and the generated JWT token
        return {
            unique_id : candidate.unique_id, 
            token,
            role: candidate.role, 
            emailId : candidate.email
        };
    } catch (error) {
        console.log('Login error: ', error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred during login', 'DATABASE_ERROR');
        }
        if (error.code === 'CANDIDATE_NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }
        if (error.code === 'INVALID_PASSWORD') {
            throw new CustomError(error.message, error.code);
        }
        throw new CustomError('Error during login: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


module.exports = {
    verifyEmailOTP,
    verifyPhoneOTP,  
    loginCandidate,   
}