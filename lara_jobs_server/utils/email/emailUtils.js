const nodemailer = require('nodemailer');

// Set up transporter using your email provider's SMTP settings
let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,  //HOSTINGER PORT NUMBER
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendEmailOTP = async (email) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);  // Generate a 6-digit OTP

        // HTML email body with inline styling
        const htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; background-color: #f7fafc;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #2c5282; text-align: center; font-size: 24px;">Welcome to Lara Jobs</h2>
                        <p style="text-align: center; font-size: 18px;">Hello,</p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
                            We received a request to verify your email. Your one-time password (OTP) is <strong style="color: #2b6cb0; font-size: 20px;">${otp}</strong>.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            This OTP will expire in <strong>10 minutes</strong>. If you did not request this, you can ignore this email.
                        </p>
                        <p style="text-align: center; margin-top: 20px;">
                            <span style="font-size: 14px; color: #718096;">Thank you for choosing Lara Jobs!</span>
                        </p>
                    </div>
                </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,  
            to: email,  // Recipient's email
            subject: 'Your verification OTP Code from Lara Jobs',
            html: htmlContent,  
        };

        // Send email and handle response
        const info = await transporter.sendMail(mailOptions);  
        if (info.accepted.length > 0) {
            console.log("Email sent successfully!");
        } else {
            throw new Error("Failed to send email.");
        }

        return otp;
    } catch (error) {
        throw new Error('Error sending OTP email: ' + error.message);
    }
};


// Function to send any generic email (e.g., for password reset)
const sendEmail = async (email, subject, message) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);  // Send the email
    } catch (error) {
        throw new Error('Error sending email: ' + error.message);
    }
};

module.exports = { sendEmailOTP, sendEmail, transporter };
