const { Twilio } = require("twilio");

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Active phone number from Twilio

// Twilio client setup
const client =new Twilio(accountSid, authToken);

// Method to send OTP via SMS using Twilio
async function sendPhoneOTP(phoneNumber) {
    try {
        const otp = generateOTP(); // Generate a 6-digit OTP

        const message = await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: twilioPhoneNumber,
            to: `91${phoneNumber}`,
        });

        console.log('OTP sent successfully:', message.sid);
        return otp;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, error: error.message };
    }
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
}

module.exports = {
    sendPhoneOTP,
}


// const axios = require('axios');

// // Fast2SMS credentials
// const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;  
// const SENDER_ID = 'FSTSMS';  

// // Method to send OTP via SMS using Fast2SMS
// async function sendPhoneOTP(phoneNumber) {
//     try {
//         const otp = generateOTP();  // Generate a 6-digit OTP

//         // API URL for sending SMS through Fast2SMS
//         const apiURL = 'https://www.fast2sms.com/dev/bulk';

//         // Request parameters
//         const params = {
//             authorization: FAST2SMS_API_KEY,
//             sender_id: SENDER_ID,
//             message: `Your OTP code for Lara Jobs verification is ${otp}`,
//             language: 'english', // Message language
//             route: 'p',  // 'p' for promotional messages or 't' for transactional messages
//             numbers: `91${phoneNumber}`, // The recipient phone number, adding India country code (91)
//         };

//         // Send the SMS request to Fast2SMS
//         const response = await axios.post(apiURL, null, { params });

//         if (response.data.status === 'success') {
//             console.log('OTP sent successfully:', response.data);
//             return otp;  // Return the OTP for storing it in the database, 
//         } else {
//             console.error('Failed to send OTP:', response.data);
//             return { success: false, error: 'Failed to send OTP via Fast2SMS' };
//         }
//     } catch (error) {
//         console.log('Error sending OTP : ', error)
//         console.error('Error sending OTP:', error.message);
//         return { success: false, error: error.message };
//     }
// }

// // Function to generate a 6-digit OTP
// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
// }

// module.exports = {
//     sendPhoneOTP,
// };


// const unirest = require('unirest');

// // Fast2SMS credentials
// const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

// // Method to send OTP via SMS using Fast2SMS
// async function sendPhoneOTP(phoneNumber) {
//     try {
//         const otp = generateOTP(); // Generate a 6-digit OTP

//         // Prepare the message
//         const message = `Your OTP code is ${otp}`;

//         // Sending the request to Fast2SMS using unirest
//         const req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

//         req.headers({
//             "authorization": FAST2SMS_API_KEY,
//         });

//         // Fast2SMS request parameters
//         req.form({
//             "variables_values": otp, // OTP value
//             "route": "otp",          // OTP route
//             "numbers": `91${phoneNumber}`, // Phone numbers to send OTP to (with India country code)
//         });

//         // Send the request and handle the response
//         req.end(function (res) {
//             if (res.error) {
//                 console.log('error while sending sms :', res.error)
//                 throw new Error(res.error);
//             }

//             // Log the response body for debugging purposes
//             console.log('Response:', res.body);

//             // If the message is sent successfully, return the OTP
//             if (res.body && res.body.return) {
//                 console.log('OTP sent successfully:', res.body.message);
//                 return otp;  // Return OTP for use in verification
//             } else {
//                 console.error('Failed to send OTP:', res.body);
//                 return { success: false, error: 'Failed to send OTP via Fast2SMS' };
//             }
//         });
//     } catch (error) {
//         console.log("Error while sinding phone otp : ", error)
//         console.error('Error sending OTP:', error.message);
//         return { success: false, error: error.message };
//     }
// }

// // Function to generate a 6-digit OTP
// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
// }

// module.exports = {
//     sendPhoneOTP,
// };
