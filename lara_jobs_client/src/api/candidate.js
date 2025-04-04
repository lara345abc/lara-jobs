import axios from 'axios';
import { baseURL } from '../config/baseURL';

// Get the token from localStorage 
const token = localStorage.getItem('token');
const config = {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
}


// Function to create a candidate and send OTP
export const createCandidate = async (email) => {
    try {
        const response = await axios.post(`${baseURL}/api/candidate/create`, {
            email: email,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (password) => {
    try {
        const email = localStorage.getItem('email');
        const response = await axios.post(`${baseURL}/api/candidate/update-password`, {
            email: email,
            password: password
        });
        return response;
    } catch (error) {
        throw error;
    }
};


export const updateCandidateBasicDetails = async (candidateDetails) => {
    try {
        

        const response = await axios.put(
            `${baseURL}/api/candidate/update-by-email`,
            candidateDetails,
            config
        );

        return response.data;
    } catch (error) {
        console.error('Error while updating details : ', error)
        throw error;
    }
};


export const getCandidateDetails = async () => {
    try {
        const jwToken = localStorage.getItem('token');
        const response = await axios.get(`${baseURL}/api/candidate`, 
            {
                headers: {
                    'Authorization': `Bearer ${jwToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        return response.data;
    } catch (error) {
        console.error("Error while fetching candidate data : ", error);
        throw error;
    }
}