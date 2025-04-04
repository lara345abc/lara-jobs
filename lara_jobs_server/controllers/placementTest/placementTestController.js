const placementTestService = require('../../services/placementTest/placementTestServices');
const handleError = require('../../errors/errorHandler');

const createPlacementTestController = async (req, res) => {
    try {
        const {
            number_of_questions,
            description,
            start_time,
            end_time,
            show_result,
            topic_ids,
            is_Monitored,
            test_title,
            certificate_name,
            issue_certificate,
        } = req.body;

        if (!number_of_questions || !start_time || !end_time || !Array.isArray(topic_ids) || topic_ids.length === 0) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        const newTest = await placementTestService.createPlacementTest({
            number_of_questions,
            description,
            start_time,
            end_time,
            show_result,
            topic_ids,
            is_Monitored,
            test_title,
            certificate_name,
            issue_certificate,
        });

        return res.status(200).json({
            message: 'Placement test created successfully',
            data: newTest,
        });

    } catch (error) {
        console.log("Error while creating the placement test link:", error);
        handleError(res, error)
    }
};

const updatePlacementTestController = async (req, res) => {
    try {
        const {test_id}  = req.params;
        const {
            number_of_questions,
            description,
            start_time,
            end_time,
            show_result,
            topic_ids,
            is_Monitored,
            test_title,
            certificate_name,
            issue_certificate,
        } = req.body;

        // Ensure that required fields are provided
        if (!test_id || !number_of_questions || !start_time || !end_time || !Array.isArray(topic_ids) || topic_ids.length === 0) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Call the service to update the placement test
        const updatedTest = await placementTestService.updatePlacementTest({
            test_id,
            number_of_questions,
            description,
            start_time,
            end_time,
            show_result,
            topic_ids,
            is_Monitored,
            test_title,
            certificate_name,
            issue_certificate,
        });

        return res.status(200).json({
            message: 'Placement test updated successfully',
            data: updatedTest,
        });

    } catch (error) {
        console.log("Error while updating the placement test:", error);
       handleError(res, error)
    }
};

const getPlacementTestByIdController = async (req, res) => {
    try {
        const { test_id } = req.params;
        
        if (!test_id) {
            return res.status(400).send({ message: 'Test ID is required' });
        }

        const test = await placementTestService.getPlacementTestById(test_id);

        return res.status(200).json({
            message: 'Placement test retrieved successfully',
            data: test,
        });
    } catch (error) {
        console.log("Error while retrieving the placement test:", error);
        handleError(res, error)
    }
};

// Controller method to get all placement tests
const getAllPlacementTestsController = async (req, res) => {
    try {
        const tests = await placementTestService.getAllPlacementTests();

        return res.status(200).json({
            message: 'All placement tests retrieved successfully',
            data: tests,
        });
    } catch (error) {
        console.log("Error while retrieving all placement tests:", error);
        handleError(res, error)
    }
};

const deletePlacementTestController = async (req, res) => {
    try {
        const { test_id } = req.params;

        if (!test_id) {
            return res.status(400).send({ message: 'Test ID is required' });
        }

        const result = await placementTestService.deletePlacementTest(test_id);

        return res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        console.log("Error while deleting the placement test:", error);
        handleError(res, error)
    }
};

const disableLinkController = async (req, res) => {
    try {
        const { test_id, is_Active } = req.body;

        await placementTestService.updateTestLinkStatus(test_id, is_Active);

        return res.status(200).send({
            message: 'Test link status updated successfully',
        });
    } catch (error) {
        console.error("Error while updating test link status:", error);
        handleError(res, error);  
    }
};

const updateMonitorStatus = async (req, res) => {
    try {
        const { test_id, is_Monitored } = req.body;

        await placementTestService.updateIsMonitoredStatus(test_id, is_Monitored);

        return res.status(200).send({
            message: 'Monitoring status updated successfully',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating the monitoring status' });
    }
};

const assignQuestionsToPlacementTestController = async (req, res) => {
    const { placement_test_id, question_ids } = req.body;

    try {
        // Validate if placement_test_id and question_ids are provided
        if (!placement_test_id || !question_ids || question_ids.length === 0) {
            return res.status(400).send({ message: 'Placement test ID and question IDs are required.' });
        }

        // Call the service method to assign questions
        const result = await placementTestService.assignQuestionsToPlacementTestService(placement_test_id, question_ids);

        if (result.success) {
            return res.status(200).send({
                message: 'Questions assigned to placement test successfully.',
                assignments: result.assignments
            });
        } else {
            return res.status(200).send({ message: 'The selected questions already exist in the placement test.' });
        }
    } catch (error) {
        console.log('Error in assignQuestionsToPlacementTestController:', error);
        return res.status(500).send({ message: error.message });
    }
};


const fetchTestTopicIdsAndQnNumsController = async (req, res) => {
    try {
        const { encrypted_test_id } = req.body;

        // Call the service method to get the test details
        const result = await placementTestService.fetchTestTopicIdsAndQnNumsService(encrypted_test_id);

        // Respond with the fetched details
        return res.status(200).send({
            message: 'Placement test details retrieved successfully',
            ...result
        });
    } catch (error) {
        console.log('Error in fetchTestTopicIdsAndQnNumsController:', error);
        handleError(res, error); 
    }
};

const savePlacementTestResultsController = async (req, res) => {
    try {
        const candidate = req.candidate;
        const candidate_id = candidate.id;
        const { placement_test_id, marks_obtained, total_marks } = req.body;
        console.log('Candidate id received in controller ', candidate_id)

        // Call the service method to save test results
        const testResults = await placementTestService.savePlacementTestResultsService(
            placement_test_id,
            candidate_id,
            marks_obtained,
            total_marks
        );

        return res.status(200).send(testResults);
    } catch (error) {
        // Handle errors
        console.log('Error in saving placement test results:', error);
        handleError(res, error); 
    }
};

const checkIfCandidateAttendedTestController = async (req, res) => {
    try {
        const candidate = req.candidate;
        const candidate_id = candidate.id;
        const { placement_test_id } = req.body;

        const hasAttended = await placementTestService.checkIfCandidateAttendedTestService(placement_test_id, candidate_id);

        return res.status(200).json({
            hasAttended
        });

    } catch (error) {
        console.error("Error checking candidate attendance:", error);
        handleError(res, error); 
    }
};

const getAllResultsByTestIdController = async (req, res) => {
    try {
        const { placement_test_id } = req.body;

        const result = await placementTestService.getAllResultsByTestIdService(placement_test_id);

        return res.status(200).send(result);

    } catch (error) {
        console.log('Error in fetching placement test results:', error);

       handleError(res, error);
    }
};

const getPlacementTestResultsByCandidateIdController = async (req, res) => {
    try {
        const candidate_id = req.candidate.id

        const result = await placementTestService.getPlacementTestResultsByCandidateIdService(candidate_id);

        return res.status(200).send(result);
    } catch (error) {
        console.error('Error in fetching placement test results by email:', error);
        handleError(res, error);  
    }
};


module.exports = {
    createPlacementTestController,
    updatePlacementTestController,
    getPlacementTestByIdController,
    getAllPlacementTestsController,
    deletePlacementTestController,
    disableLinkController,
    updateMonitorStatus,
    assignQuestionsToPlacementTestController,
    fetchTestTopicIdsAndQnNumsController,
    savePlacementTestResultsController,
    checkIfCandidateAttendedTestController,
    getAllResultsByTestIdController,
    getPlacementTestResultsByCandidateIdController,
};
