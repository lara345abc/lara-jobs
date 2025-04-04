import axios from 'axios';
import { baseURL } from '../config/baseURL';

// Fetch all placement tests
export const getAllPlacementTests = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/placement-test/test/test-links`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching placement tests:', error);
        throw error;
    }
};

// Toggle the status of a placement test link
export const toggleLinkStatus = async (placement_test_id, currentStatus) => {
    try {
        const newStatus = !currentStatus;
        await axios.put(`${baseURL}/api/placement-test/test/test-link/link-status`, {
            test_id: placement_test_id,
            is_Active: newStatus,
        });
        return newStatus;
    } catch (error) {
        console.error('Error toggling link status:', error);
        throw error;
    }
};

// Update the number of questions for a placement test
export const updateNumberOfQuestions = async (test_id, number_of_questions) => {
    try {
        await axios.post(`${baseURL}/api/placement-test/updateNumberOfQuestions`, {
            test_id,
            number_of_questions,
        });
    } catch (error) {
        console.error('Error updating number of questions:', error);
        throw error;
    }
};

// Update the monitored status of a placement test
export const updateMonitoredStatus = async (test_id, is_Monitored) => {
    try {
        await axios.put(`${baseURL}/api/placement-test/test/test-link/test-monitor-status`, {
            test_id,
            is_Monitored,
        });
    } catch (error) {
        console.error('Error updating monitored status:', error);
        throw error;
    }
};


// Candidate test reuslts 

export const hasCandidateAttended = async (test_id) => {
    try {

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        const hasAttended = await axios.post(`${baseURL}/api/placement-test/test/test-results/isCandidateAttended`, {
           placement_test_id : test_id,
        },config);

        // console.log('HasAttended ', hasAttended)

        return hasAttended.data.hasAttended;
    } catch (error) {
        console.error('Error updating monitored status:', error);
        throw error;
    }
};