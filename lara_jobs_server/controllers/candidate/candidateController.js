const handleError = require('../../errors/errorHandler');
const candidateService = require('../../services/candidate/candidateService');

// Create a new candidate
// const createCandidateController = async (req, res) => {
//     try {
//         const candidateData = req.body;
//         const newCandidate = await candidateService.createCandidate(candidateData);
//        return res.status(201).json(newCandidate);
//     } catch (error) {
//        return res.status(500).json({ message: error.message });
//     }
// };

const createCandidate = async (req, res) => {
    try {
        const { email } = req.body;

        const newCandidate = await candidateService.createCandidate(email);

        return res.status(201).json({
            message: 'Candidate created successfully and OTP sent to email.',
            candidate: newCandidate,
        });
    } catch (error) {
        console.log("Error while saving candidate email:", error);
        handleError(res, error)
    }
};

const resendOtpHandler = async (req, res) => {
    try {
      const { email } = req.body;
  
      const result = await resendOtp(email);
      return res.status(200).json(result); 
    } catch (error) {
      console.log("Error while resending OTP:", error);
      return handleError(res, error); 
    }
  };

const updatePhoneNumber = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        console.log("email : " , email)
        console.log("email : " , phoneNumber)
        const updatedCandidate = await candidateService.updatePhoneNumber(email, phoneNumber);
        return res.status(200).json({
            message: 'Phone number updated and OTP sent to phone',
            candidate: updatedCandidate,
        });
    } catch (error) {
        console.log("Error while updating the phone number : ", error)
        handleError(res, error)
    }
};

const updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("email : " , email)
        // console.log("email : " , password)
        await candidateService.updatePassword(email, password);
        return res.status(200).json({
            message: 'Password updated',
            success : true,
        });
    } catch (error) {
        console.log("Error while updating the password : ", error)
        handleError(res, error)
    }
};



const storePinCode = async (req, res) => {
    try {
        const { candidateId, pinCode } = req.body;
        await candidateService.storePinCode(candidateId, pinCode);
        return res.status(200).json({ message: 'Pin code stored successfully' });
    } catch (error) {
        handleError(res, error)
    }
};


// Get a candidate by ID
const getCandidateByIdController = async (req, res) => {
    try {
        const id = req.candidate.id;
        console.log("Id : ", id)
        const candidate = await candidateService.getCandidateById(id);
        return res.status(200).json(candidate);
    } catch (error) {
        handleError(res, error)
    }
};

// Get all candidates
const getAllCandidatesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const { total, candidates } = await candidateService.getAllCandidates(page, pageSize);

        return res.status(200).json({
            success: true,
            data: candidates,
            total,  // Total record count for pagination
            page,
            pageSize,
        });
    } catch (error) {
        handleError(res, error)
    }
};


const searchCandidatesController = async (req, res) => {
    try {
        const { name, email, phone_number } = req.body; // search parameters 
        const { page = 1, pageSize = 10 } = req.query; // Get pagination params from query string (default to page 1 and 10 results per page)

        // Construct the search query object
        const searchQuery = { name, email, phone_number };

        // Call the service to search for candidates
        const candidates = await searchCandidates(searchQuery, page, pageSize);

        // Send back the response with search results
        return res.status(200).json({
            page,
            pageSize,
            results: candidates,
            total: candidates.length, // to get how many matching results are found
        });
    } catch (error) {
        handleError(res, error)
    }
};

// Update a candidate by ID
const updateCandidateController = async (req, res) => {
    try {
        const updateData = req.body;
        const updatedCandidate = await candidateService.updateCandidate( updateData);
        return res.status(200).json(updatedCandidate);
    } catch (error) {
        console.error('Error while updating candidate details : ', error)
        handleError(res, error)
    }
};
const updateCandidatebyEmailController = async (req, res) => {
    try {
        const updateData = req.body;
        const updatedCandidate = await candidateService.updateCandidateByEmail(updateData);
        return res.status(200).json(updatedCandidate);
    } catch (error) {
        console.error('Error while updating candidate details : ', error)
        handleError(res, error)
    }
};

// Delete a candidate by ID
const deleteCandidateController = async (req, res) => {
    try {
        const { id } = req.params;
        await candidateService.deleteCandidate(id);
        return res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        handleError(res, error)
    }
};

module.exports = {
    // createCandidateController,
    createCandidate,
    updatePhoneNumber,
    updatePassword,
    storePinCode,
    getCandidateByIdController,
    getAllCandidatesController,
    searchCandidatesController,
    updateCandidateController,
    updateCandidatebyEmailController, 
    deleteCandidateController,
};
