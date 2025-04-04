import axios from "axios";
import { baseURL } from "../config/baseURL";

export const sendOtp = async (email) => {
  try {
    return "sendOtp"
  } catch (error) {
    console.error("Error sending OTP", error);
    throw new Error("Unable to send OTP");
  }
};

export const verifyOtp = async (email, otp) => {
  try {

    const response = await axios.post(`${baseURL}/api/auth/verify-email-otp`, {
      email: email,
      otp : otp
    });

    return response;
  } catch (error) {
    console.error("Error verifying OTP", error);
    throw new Error("Invalid OTP");
  }
};

export const resendEmailOtp = async (email, otp) => {
  try {

    const response = await axios.post(`${baseURL}/api/auth/resend-email-otp`, {
      email: email,
    });

    return response;
  } catch (error) {
    console.error("Error while resending the OTP : ", error);
    throw new Error("Invalid OTP");
  }
};

export const savePhoneNumber = async (email, phone) => {
  try {
    const response = await axios.post(`${baseURL}/api/candidate/update-phone`, {
      email: email,
      phoneNumber : phone
    });
    return response;
  } catch (error) {
    console.error("Error saving phone number ", error);
    throw new Error("Unable to send OTP");
  }
};

export const verifyPhoneOtp = async (phone, otp) => {
  try {
    return "verifyPhoneOtp"
  } catch (error) {
    console.error("Error verifying phone OTP", error);
    throw new Error("Invalid OTP");
  }
};


export const sendResetPasswordEmail = async (email) => {
  try {
    return 'email sent '
  } catch (error) {
    console.error("Error while sending email", error);
    throw new Error("Error while sending forgot password mail");
  }
};

export const signInUser = async (email, password) => {
  try {
    // console.log(`Received email ${email} : password : ${password}`)
    const response = await axios.post(`${baseURL}/api/auth/login`, {
      email: email, 
      password: password
    });

    return response;
  } catch (error) {
    console.error("Error while log in", error);
    throw new Error("Login Failed");
  }
};
