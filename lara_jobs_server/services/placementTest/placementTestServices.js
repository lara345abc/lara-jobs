const { baseURL } = require("../../config/baseURLConig");
const CustomError = require("../../errors/CustomErrors");
const { Topic, PlacementTest, PlacementTestTopic, CumulativeQuestion, sequelize, CQPlacementTest, PlacementTestResult, Candidate } = require("../../models");

const createPlacementTest = async ({
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
}) => {
    try {
        // Validate that all provided topic_ids exist in the topics table
        const topics = await Topic.findAll({
            where: { topic_id: topic_ids },
        });

        if (topics.length !== topic_ids.length) {
            throw new CustomError('One or more topic IDs are invalid', 'TOPIC_NOT_FOUND');
        }

        // Create a new PlacementTest
        const newTest = await PlacementTest.create({
            test_link: '', // Initially empty, will be updated later
            number_of_questions,
            description,
            test_title,
            certificate_name,
            start_time, // Store as string
            end_time, // Store as string
            show_result: show_result !== undefined ? show_result : true, // Default to true if not provided
            is_Monitored: is_Monitored !== undefined ? is_Monitored : false, // Default to false if not provided
            issue_certificate: issue_certificate !== undefined ? issue_certificate : false, // Default to false if not provided
        });

        // Generate the test link with the placement_test_id
        const test_link = `${baseURL}/test/${newTest.placement_test_id}`;
        newTest.test_link = test_link;
        await newTest.save();

        // Save the topic IDs in the PlacementTestTopic table
        const topicPromises = topic_ids.map(topic_id =>
            PlacementTestTopic.create({
                placement_test_id: newTest.placement_test_id,
                topic_id,
            })
        );

        await Promise.all(topicPromises);

        // Distribute questions among the selected topics
        const questionsPerTopic = Math.floor(number_of_questions / topic_ids.length);
        const remainderQuestions = number_of_questions % topic_ids.length;

        for (let i = 0; i < topic_ids.length; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            // Fetch and associate questions with the test
            const questions = await CumulativeQuestion.findAll({
                where: {
                    topic_id: topicId,
                    test_id: null, // Only fetch questions not yet associated with any test
                },
                limit: questionsToFetch,
                order: sequelize.random(),
            });

            for (const question of questions) {
                await question.update({ test_id: newTest.placement_test_id });
            }
        }

        return newTest;
    } catch (error) {
        console.error('error while creating placement test link : ', error)
        throw new CustomError('Error creating placement test: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const updatePlacementTest = async ({
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
}) => {
    try {
        console.log("test id received in services method : ", test_id)
        // Find the placement test by ID
        const test = await PlacementTest.findByPk(test_id);
        if (!test) {
            throw new CustomError('Placement test not found', 'PLACEMENT_TEST_NOT_FOUND');
        }

        // Validate that all provided topic_ids exist in the topics table
        const topics = await Topic.findAll({
            where: { topic_id: topic_ids },
        });

        if (topics.length !== topic_ids.length) {
            throw new CustomError('One or more topic IDs are invalid', 'TOPIC_NOT_FOUND');
        }

        // Update placement test details
        await test.update({
            number_of_questions,
            description,
            test_title,
            certificate_name,
            start_time, // Store as string
            end_time, // Store as string
            show_result: show_result !== undefined ? show_result : test.show_result, // Use previous value if not provided
            is_Monitored: is_Monitored !== undefined ? is_Monitored : test.is_Monitored, // Use previous value if not provided
            issue_certificate: issue_certificate !== undefined ? issue_certificate : test.issue_certificate, // Use previous value if not provided
        });

        // Clear existing topics associated with this test
        await PlacementTestTopic.destroy({
            where: { placement_test_id: test_id },
        });

        // Save new topic IDs in the PlacementTestTopic table
        const topicPromises = topic_ids.map(topic_id =>
            PlacementTestTopic.create({
                placement_test_id: test_id,
                topic_id,
            })
        );
        await Promise.all(topicPromises);

        // Distribute questions among the selected topics
        const questionsPerTopic = Math.floor(number_of_questions / topic_ids.length);
        const remainderQuestions = number_of_questions % topic_ids.length;

        for (let i = 0; i < topic_ids.length; i++) {
            const topicId = topic_ids[i];
            let questionsToFetch = questionsPerTopic;

            if (i < remainderQuestions) {
                questionsToFetch += 1;
            }

            // Fetch and associate questions with the test
            const questions = await CumulativeQuestion.findAll({
                where: {
                    topic_id: topicId,
                    test_id: null, // Only fetch questions not yet associated with any test
                },
                limit: questionsToFetch,
                order: sequelize.random(),
            });

            for (const question of questions) {
                await question.update({ test_id: test_id });
            }
        }

        return test; // Return the updated placement test
    } catch (error) {
        console.log("Error updating test details : ", error)
        throw new CustomError('Error updating placement test: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};



const getPlacementTestById = async (test_id) => {
    try {
        const test = await PlacementTest.findByPk(test_id, {
            include: [
                {
                    model: PlacementTestTopic,
                    as: 'placementTestTopics'
                }
            ]
        });

        if (!test) {
            throw new CustomError('Placement test not found', 'PLACEMENT_TEST_NOT_FOUND');
        }

        return test;
    } catch (error) {
        throw new CustomError('Error retrieving placement test: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Service method to get all placement tests
const getAllPlacementTests = async () => {
    try {
        const tests = await PlacementTest.findAll({
            include: [
                {
                    model: PlacementTestTopic,
                    as: 'placementTestTopics'
                }
            ]
        });

        return tests;
    } catch (error) {
        throw new CustomError('Error retrieving placement tests: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

// Service method to delete a placement test by ID
const deletePlacementTest = async (test_id) => {
    try {
        const test = await PlacementTest.findByPk(test_id);

        if (!test) {
            throw new CustomError('Placement test not found', 'PLACEMENT_TEST_NOT_FOUND');
        }

        // Remove associated topics first
        await PlacementTestTopic.destroy({ where: { placement_test_id: test_id } });

        // Remove associated questions
        await CumulativeQuestion.update({ test_id: null }, { where: { test_id: test_id } });

        // Remove the test itself
        await test.destroy();

        return { message: 'Placement test deleted successfully' };
    } catch (error) {
        throw new CustomError('Error deleting placement test: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const updateTestLinkStatus = async (test_id, is_Active) => {
    try {
        await PlacementTest.update(
            { is_Active },
            { where: { placement_test_id: test_id } }
        );
    } catch (error) {
        throw new CustomError('Error updating link status: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};
const updateIsMonitoredStatus = async (test_id, is_Monitored) => {
    try {
        await PlacementTest.update(
            { is_Monitored },
            { where: { placement_test_id: test_id } }
        );
    } catch (error) {
        throw new CustomError('Error updating isMonitored status: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const assignQuestionsToPlacementTestService = async (placement_test_id, question_ids) => {
    try {
        // Check if placement_test_id exists in PlacementTest table
        const test = await PlacementTest.findByPk(placement_test_id);
        if (!test) {
            throw new Error(`Placement test with ID ${placement_test_id} not found.`);
        }

        // Check which question_ids are already assigned to the placement test
        const existingAssignments = await CQPlacementTest.findAll({
            where: { placement_test_id: placement_test_id },
            attributes: ['cumulative_question_id']
        });

        const assignedQuestionIds = existingAssignments.map(a => a.cumulative_question_id);

        // Filter out already assigned question_ids
        const newQuestionIds = question_ids.filter(id => !assignedQuestionIds.includes(id));

        if (newQuestionIds.length === 0) {
            return { success: false, assignments: [] };  // No new questions to assign
        }

        // Create an array of objects to bulk create entries in CumulativeQuestionPlacementTest
        const assignments = newQuestionIds.map(question_id => ({
            cumulative_question_id: question_id,
            placement_test_id: placement_test_id
        }));

        // Bulk create entries in the CumulativeQuestionPlacementTest table
        const createdAssignments = await CQPlacementTest.bulkCreate(assignments);

        return { success: true, assignments: createdAssignments };
    } catch (error) {
        console.error('Error in assignQuestionsToPlacementTestService:', error);
        throw new Error('An error occurred while assigning questions to the placement test.');
    }
};

const fetchTestTopicIdsAndQnNumsService = async (encrypted_test_id) => {
    try {
        // Validate if encrypted_test_id is provided
        if (!encrypted_test_id) {
            throw new CustomError('Encrypted Test ID is required.', 'INVALID_INPUT');
        }

        // Fetch active test
        const activeTest = await PlacementTest.findByPk(encrypted_test_id);
        if (!activeTest) {
            throw new CustomError('Test Not Found', 'NOT_FOUND');
        }

        // Check if test is active
        if (!activeTest.is_Active) {
            throw new CustomError('Access Forbidden', 'FORBIDDEN');
        }

        // Fetch associated topic IDs
        const placementTestTopics = await PlacementTestTopic.findAll({
            where: {
                placement_test_id: encrypted_test_id
            },
            attributes: ['topic_id']
        });

        // Fetch placement test details (e.g., number_of_questions, show_result, etc.)
        const placementTest = await PlacementTest.findByPk(encrypted_test_id, {
            attributes: ['number_of_questions', 'show_result', 'is_Monitored', 'test_title', 'certificate_name', 'issue_certificate']
        });

        if (!placementTest) {
            throw new CustomError('Placement test not found', 'NOT_FOUND');
        }

        const topic_ids = placementTestTopics.map(topic => topic.topic_id);

        return {
            topic_ids,
            number_of_questions: placementTest.number_of_questions,
            show_result: placementTest.show_result,
            is_Monitored: placementTest.is_Monitored,
            test_title: placementTest.test_title,
            certificate_name: placementTest.certificate_name,
            issue_certificate: placementTest.issue_certificate
        };
    } catch (error) {


        console.error('Error fetching test details in service:', error.stack);

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND' || error.code === 'FORBIDDEN') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error creating subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const savePlacementTestResultsService = async (placement_test_id, candidate_id, marks_obtained, total_marks) => {
    try {
        // Check if there is already a result for this combination
        const existingResult = await PlacementTestResult.findOne({
            where: {
                placement_test_id,
                candidate_id,
            },
        });

        if (existingResult) {
            throw new CustomError("You have already attended this test.", "DUPLICATE_RESULT");
        }

        // Check if the student exists
        const placementStudent = await Candidate.findByPk(candidate_id);
        if (!placementStudent) {
            throw new CustomError("Candidat Not Found", "NOT_FOUND");
        }

        // Save the test results
        const testResults = await PlacementTestResult.create({
            placement_test_id,
            candidate_id,
            marks_obtained,
            total_marks
        });

        return testResults;
    } catch (error) {
        console.error("Error saving placement test results:", error.stack);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'NOT_FOUND', error.code === 'DUPLICATE_RESULT') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error fetching candidate: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const checkIfCandidateAttendedTestService = async (placement_test_id, candidate_id) => {
    try {
        const existingResult = await PlacementTestResult.findOne({
            where: {
                placement_test_id,
                candidate_id,
            },
        });

        if (existingResult) {
            return true;
        }

        return false;

    } catch (error) {
        console.error("Error checking if candidate attended the test:", error.stack);

        // Handle database error
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        // Catch any other errors
        throw new CustomError('Error checking candidate attendance: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getAllResultsByTestIdService = async (placement_test_id) => {
    try {
        if (!placement_test_id) {
            throw new CustomError('placement_test_id is required', 'BAD_REQUEST');
        }

        const results = await PlacementTestResult.findAll({
            where: { placement_test_id },
            attributes: ['candidate_id', 'marks_obtained', 'total_marks']
        });

        const studentIds = results.map(result => result.candidate_id);
        if (studentIds.length === 0) {
            throw new CustomError('No results found for the provided placement_test_id', 'NOT_FOUND');
        }

        const candidates = await Candidate.findAll({
            where: { id: studentIds },
            attributes: ['id', 'name', 'email', 'phone_number','town', 'district', 'state']
        });

        const assignedTopics = await PlacementTestTopic.findAll({
            where: { placement_test_id },
            attributes: ['topic_id']
        });

        const topicIds = assignedTopics.map(topic => topic.topic_id);

        const topics = await Topic.findAll({
            where: { topic_id: topicIds },
            attributes: ['topic_id', 'name']
        });

        const topicNames = topics.map(topic => topic.name);

        const combinedResults = results.map(result => {
            const student = candidates.find(student => student.id === result.candidate_id);
            return {
                candidate_id: result.candidate_id,
                marks_obtained: result.marks_obtained,
                total_marks: result.total_marks,
                student_details: student ? {
                    student_name: student.name,
                    email: student.email,
                    phone_number: student.phone_number,
                    district: student.district,
                    state: student.state,
                } : null
            };
        });

        return { candidates: combinedResults, topics: topicNames };

    } catch (error) {
        console.error("Erroro fetching all results : ", error)
        throw new CustomError('Error fetching results', 'INTERNAL_SERVER_ERROR');
    }
};

const getPlacementTestResultsByCandidateIdService = async (candidate_id) => {
    try {
        if (!candidate_id) {
            throw new CustomError('Email is required', 'BAD_REQUEST');
        }

        // Find the student by email
        const placementStudent = await Candidate.findOne({
            where: { id : candidate_id },
            attributes: ['id', 'name', 'email', 'phone_number', 'district', 'state'],
        });

        if (!placementStudent) {
            throw new CustomError('NO Candidate found', 'NOT_FOUND');
        }

        const { id } = placementStudent;

        // Fetch all test results for the student
        const testResults = await PlacementTestResult.findAll({
            where: { candidate_id : id },
            attributes: ['placement_test_id', 'marks_obtained', 'total_marks', 'createdAt'],
            include: [
                {
                    model: PlacementTest,
                    as: 'Placementtests',
                    attributes: ['test_title', 'start_time', 'certificate_name'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        if (testResults.length === 0) {
            throw new CustomError('No test results found for this student.', 'NOT_FOUND');
        }

        return {
            student: placementStudent,
            testResults,
        };
    } catch (error) {
        console.error('Error in fetching placement test results:', error);
        throw new CustomError(error.message, error.code || 'INTERNAL_SERVER_ERROR');
    }
};



module.exports = {
    createPlacementTest,
    updatePlacementTest,
    getPlacementTestById,
    getAllPlacementTests,
    deletePlacementTest,
    updateTestLinkStatus,
    updateIsMonitoredStatus,
    assignQuestionsToPlacementTestService,
    fetchTestTopicIdsAndQnNumsService,
    savePlacementTestResultsService,
    checkIfCandidateAttendedTestService,
    getAllResultsByTestIdService,
    getPlacementTestResultsByCandidateIdService
};
