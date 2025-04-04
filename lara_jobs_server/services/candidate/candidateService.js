const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const CustomError = require('../../errors/CustomErrors');
const Candidate = require('../../models/candidate');
const OTPVerification = require('../../models/otpVerfication')
const { sendEmailOTP } = require('../../utils/email/emailUtils');
const { sendPhoneOTP } = require('../../utils/phoneOTP/phoneUtils');

// Create a new candidate
// const createCandidate = async (candidateData) => {
//     try {
//         const candidate = await Candidate.create(candidateData);
//         return candidate;
//     } catch (error) {
//         throw new Error('Error creating candidate: ' + error.message);
//     }
// };

const createCandidate = async (email) => {
    try {
        // Check if a candidate with the same email already exists
        const existingCandidate = await Candidate.findOne({ where: { email } });
        if (existingCandidate) {
            // Candidate exists but the email is not verified
            if (!existingCandidate.email_verified) {
                const otp = await sendEmailOTP(existingCandidate.email);

                // Check if OTPVerification record exists for this candidate
                const existingOTP = await OTPVerification.findOne({ where: { candidate_id: existingCandidate.id } });

                if (existingOTP) {
                    // Update the existing OTP record for email OTP
                    await existingOTP.update({
                        otp_email: otp,
                        otp_email_sent_at: new Date().toISOString(),
                    });
                } else {
                    // Create a new OTPVerification record if it doesn't exist
                    await OTPVerification.create({
                        candidate_id: existingCandidate.id,
                        otp_email: otp,
                        otp_email_sent_at: new Date().toISOString(),
                    });
                }

                return existingCandidate;
            }
            // Candidate exists and email is verified
            throw new CustomError('A candidate with this email already exists.', 'EMAIL_ALREADY_EXISTS');
        }

        // Get the current date to generate a unique_id (YYYYMMDD format)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}${month}${day}`;

        // Find the highest sequence number used so far for today's date
        const maxCandidate = await Candidate.findOne({
            where: {
                unique_id: {
                    [Op.like]: `${currentDate}%`, // Look for unique_id starting with today's date
                },
            },
            order: [['unique_id', 'DESC']], // Sort by unique_id in descending order
        });

        let sequenceNumber = 1;
        if (maxCandidate) {
            // Extract the sequence number from the last created unique_id
            const lastUniqueId = maxCandidate.unique_id;
            const lastSequence = parseInt(lastUniqueId.slice(-4), 10);
            sequenceNumber = lastSequence + 1;
        }

        // Pad the sequence number to 4 digits (e.g., 0001, 0002, etc.)
        const sequenceString = String(sequenceNumber).padStart(4, '0');

        // Generate the unique_id for the new candidate
        const unique_id = `${currentDate}${sequenceString}`;

        // Create the candidate with the generated unique_id
        const candidate = await Candidate.create({ email, unique_id });

        // Generate and send OTP email
        const otp = await sendEmailOTP(candidate.email);

        // Check if OTPVerification record exists for this candidate
        const existingOTP = await OTPVerification.findOne({ where: { candidate_id: candidate.id } });

        if (existingOTP) {
            // Update the existing OTP record for email OTP
            await existingOTP.update({
                otp_email: otp,
                otp_email_sent_at: new Date().toISOString(),
            });
        } else {
            // Create a new OTPVerification record if it doesn't exist
            await OTPVerification.create({
                candidate_id: candidate.id,
                otp_email: otp,
                otp_email_sent_at: new Date().toISOString(),
            });
        }

        return candidate;
    } catch (error) {
        console.log("error ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }
        if (error.code === 'EMAIL_ALREADY_EXISTS') {
            throw new CustomError(error.message, error.code);
        }
        if (error.code === 'EMAIL_SENDING_FAILED') {
            throw new CustomError('We were unable to send an OTP email. Please try again later.' + error.message, 'EMAIL_SENDING_FAILED');
        }
        throw new CustomError('Error creating candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const resendOtp = async (email) => {
    try {
        // Check if the candidate with the provided email exists
        const candidate = await Candidate.findOne({ where: { email } });

        if (!candidate) {
            throw new CustomError('Candidate with this email does not exist.', 'CANDIDATE_NOT_FOUND');
        }

        // Check if the candidate's email is already verified
        if (candidate.email_verified) {
            throw new CustomError('Email is already verified. No need to resend OTP.', 'EMAIL_ALREADY_VERIFIED');
        }

        // Find the existing OTP verification entry for the candidate
        const otpRecord = await OTPVerification.findOne({
            where: { candidate_id: candidate.id },
        });

        let otp;

        if (otpRecord) {
            // If OTP record exists, update the OTP and its timestamp
            otp = await sendEmailOTP(candidate.email);  // Generate a new OTP
            otpRecord.otp_email = otp; // Update OTP
            otpRecord.otp_email_sent_at = new Date().toISOString(); // Update the time of sending
            await otpRecord.save(); // Save the updated OTP record
        } else {
            // If no OTP record exists, create a new record
            otp = await sendEmailOTP(candidate.email); // Generate a new OTP
            await OTPVerification.create({
                candidate_id: candidate.id,
                otp_email: otp,
                otp_email_sent_at: new Date().toISOString(),
            });
        }

        return { message: 'OTP has been resent to your email.' };
    } catch (error) {
        console.log("Error while resending OTP:", error);

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'CANDIDATE_NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        if (error.code === 'EMAIL_ALREADY_VERIFIED') {
            throw new CustomError(error.message, error.code);
        }

        if (error.code === 'EMAIL_SENDING_FAILED') {
            throw new CustomError('We were unable to send the OTP email. Please try again later.', 'EMAIL_SENDING_FAILED');
        }

        throw new CustomError('Error resending OTP: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const updatePhoneNumber = async (email, phoneNumber) => {
    try {
        const candidate = await Candidate.findOne({ where: { email } });

        if (!candidate) {
            throw new CustomError('Candidate with this email does not exist.', 'NOT_FOUND');
        }

        if (candidate.phone_number === phoneNumber) {
            throw new CustomError('Phone number already registered.', 'DUPLICATE_PHONE_NUMBER');
        }

        await Candidate.update(
            { phone_number: `91${phoneNumber}` },
            { where: { id: candidate.id } }
        );

        // Generate OTP
        // const otp = await sendPhoneOTP(phoneNumber);

        // Check if OTPVerification record exists for this candidate
        // const existingOTP = await OTPVerification.findOne({ where: { candidate_id: candidate.id } });

        // if (existingOTP) {
        //     // Update the existing OTP record
        //     await existingOTP.update({
        //         otp_phone: otp,
        //         otp_phone_sent_at: new Date(),
        //     });
        // } else {
        //     // Create a new OTPVerification record if it doesn't exist
        //     await OTPVerification.create({
        //         candidate_id: candidate.id,
        //         otp_phone: otp,
        //         otp_phone_sent_at: new Date(),
        //     });
        // }

        return candidate;
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', + error.message, 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        if (error.code === 'DUPLICATE_PHONE_NUMBER') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error updating phone number: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const updatePassword = async (email, newPassword) => {
    try {
        const candidate = await Candidate.findOne({ where: { email } });

        if (!candidate) {
            throw new CustomError('Candidate with this email does not exist.', 'CANDIDATE_NOT_FOUND');
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Candidate.update(
            { password: hashedPassword },
            { where: { id: candidate.id } }
        );

        return candidate;
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', error.message, 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error updating password: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const storePinCode = async (candidateId, pinCode) => {
    try {
        await Candidate.update(
            { pin_code: pinCode },
            { where: { id: candidateId } }
        );
        return true;
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        throw new CustomError('Error storing pin code: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const getCandidateById = async (id) => {
    try {
        const candidate = await Candidate.findByPk(id);
        
        if (!candidate) {
            throw new CustomError('Candidate not found', 'NOT_FOUND');
        }

        const { password, ...candidateWithoutPassword } = candidate.toJSON();
        
        return candidateWithoutPassword;
    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error fetching candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Get all candidates
const getAllCandidates = async (page = 1, pageSize = 10) => {
    try {
        const { count, rows } = await Candidate.findAndCountAll({
            offset: (page - 1) * pageSize,
            limit: pageSize,
        });

        return {
            total: count,
            candidates: rows,
        };
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        throw new CustomError('Error fetching candidates: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

//search candidates by search query 
const searchCandidates = async (searchQuery, page = 1, pageSize = 10) => {
    try {
        const { name, email, phone_number } = searchQuery;

        // Build the search filter object
        const whereConditions = {};

        if (name) {
            whereConditions.name = { [Op.like]: `%${name}%` }; // Search by name
        }

        if (email) {
            whereConditions.email = { [Op.like]: `%${email}%` }; // Search by email
        }

        if (phone_number) {
            whereConditions.phone_number = { [Op.like]: `%${phone_number}%` }; // Search by phone number
        }

        // Use Sequelize to find candidates with the search query and pagination
        const candidates = await Candidate.findAll({
            where: whereConditions,
            offset: (page - 1) * pageSize, // Calculate offset for pagination
            limit: pageSize, // Limit results per page
        });

        // Return the results
        return candidates;
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        throw new CustomError('Error searching candidates: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


// Update a candidate by ID
const updateCandidate = async (id, updateData) => {
    try {
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            throw new CustomError('Candidate not found', 'NOT_FOUND');
        }
        await candidate.update(updateData);
        return candidate;
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error updating candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const updateCandidateByEmail = async (updateData) => {
    try {
        const candidate = await Candidate.findOne({
            where : {email : updateData.email}
        });
        if (!candidate) {
            throw new CustomError('Candidate not found', 'NOT_FOUND');
        }
        await candidate.update(updateData);
        return candidate;
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error updating candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Delete a candidate by ID
const deleteCandidate = async (id) => {
    try {
        const candidate = await Candidate.findByPk(id);
        if (!candidate) {
            throw new CustomError('Candidate not found', 'NOT_FOUND');
        }
        await candidate.destroy();
        return { message: 'Candidate deleted successfully' };
    } catch (error) {

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error deleting candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};




module.exports = {
    // createCandidate,
    createCandidate,
    resendOtp,
    updatePhoneNumber,
    updatePassword,
    storePinCode,
    getCandidateById,
    searchCandidates,
    getAllCandidates,
    updateCandidate,
    deleteCandidate,
    updateCandidateByEmail,
};
