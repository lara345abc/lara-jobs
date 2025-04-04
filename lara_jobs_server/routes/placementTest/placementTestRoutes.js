const express = require('express')
const placementTestRoutes = express.Router();

const placementTestController = require('../../controllers/placementTest/placementTestController');
const verifyJwt = require('../../middlewares/jwtMiddleware');


placementTestRoutes.post('/test-link/create', placementTestController.createPlacementTestController);

placementTestRoutes.get('/test-link/:test_id', placementTestController.getPlacementTestByIdController);

placementTestRoutes.get('/test-links', placementTestController.getAllPlacementTestsController);

placementTestRoutes.put('/test-link/update/:test_id', placementTestController.updatePlacementTestController);

placementTestRoutes.delete('/test-link/:test_id', placementTestController.deletePlacementTestController);

placementTestRoutes.put('/test-link/link-status', placementTestController.disableLinkController);

placementTestRoutes.put('/test-link/test-monitor-status', placementTestController.updateMonitorStatus);

placementTestRoutes.post('/test-link/assign-selected-questions', placementTestController.assignQuestionsToPlacementTestController);

placementTestRoutes.post('/test-link/fetchTestTopicIdsAndQnNums', placementTestController.fetchTestTopicIdsAndQnNumsController);


// TEST RESULTS ROUTES 

placementTestRoutes.post('/test-results/save', verifyJwt, placementTestController.savePlacementTestResultsController);

placementTestRoutes.post('/test-results/isCandidateAttended', verifyJwt, placementTestController.checkIfCandidateAttendedTestController);

placementTestRoutes.post('/test-results/getAllResultsByTestId',  placementTestController.getAllResultsByTestIdController);

placementTestRoutes.get('/test-results/getResultsByCandidateId', verifyJwt,  placementTestController.getPlacementTestResultsByCandidateIdController);



module.exports = placementTestRoutes ;