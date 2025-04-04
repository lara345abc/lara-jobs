const express = require('express');
const candidateController = require('../controllers/candidate/candidateController');
const verifyJwt = require('../middlewares/jwtMiddleware');
const checkRole = require('../middlewares/checkRole');

const candidateRoutes = express.Router();

// Create a new candidate
// candidateRoutes.post('/candidates', candidateController.createCandidateController);

//create candidate by storing the email
candidateRoutes.post('/candidate/create', candidateController.createCandidate);

//save phone number
candidateRoutes.post('/candidate/update-phone', candidateController.updatePhoneNumber);

//update password
candidateRoutes.post('/candidate/update-password', candidateController.updatePassword);

//store the pin code 
candidateRoutes.post('/candidate/store-pin', candidateController.storePinCode);

// Get a candidate by ID
candidateRoutes.get('/candidate', verifyJwt, candidateController.getCandidateByIdController);

// Get all candidates
candidateRoutes.get('/candidates', candidateController.getAllCandidatesController);

// Update a candidate by ID
candidateRoutes.put('/candidate/update', candidateController.updateCandidateController);

candidateRoutes.put('/candidate/update-by-email', candidateController.updateCandidatebyEmailController);

// Delete a candidate by ID
candidateRoutes.delete('/candidates/:id', candidateController.deleteCandidateController);

// Search candidate by query parameters (name, email, phone number )
candidateRoutes.post('/candidates/search', candidateController.searchCandidatesController);

module.exports = candidateRoutes;
