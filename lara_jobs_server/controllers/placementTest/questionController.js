const xlsx = require('xlsx');
const handleError = require("../../errors/errorHandler");
const questionService = require("../../services/placementTest/questionServices")


const saveCumulatvieQuestion = async (req, res) => {
    try {
        const questionData = req.body;

        const cumulatvieQuestion = await questionService.createCumulativeQuestion(questionData);
        return res.status(201).json({
            message: 'Question Saved Successfully',
            cumulatvieQuestion
        })
    } catch (error) {
        console.log('Error while saving question : ', error);
        handleError(res, error);
    }
}

const updateCumulativeQuestion = async (req, res) => {
    try {
        // const question_id = req.params;
        const { question_id, questionData } = req.body;
        console.log("Question id received in controller : ",question_id)

        const question = await questionService.updateCumulativeQuestion(question_id, questionData);
        return res.status(200).json({
            message: 'Question updated successfully ',
            question,
        })
    } catch (error) {
        console.log("Error while updating Question : ", error);
        handleError(res, error);
    }
}

const deleteQuestion = async (req, res) => {
    try {
        const {question_id} = req.params;
        console.log("Question : id ", question_id)
        await questionService.deleteQuestion(question_id);
        return res.status(200).json({
            message: 'Question deleted successfully ',
        })
    } catch (error) {
        console.log("Error while updating Question : ", error);
        handleError(res, error);
    }
}


const assignQuestionsToPlacementTestController = async (req, res) => {
    try {
        const { placement_test_id, question_ids } = req.body;

        const result = await placementTestService.assignQuestionsToPlacementTestService(placement_test_id, question_ids);

        return res.status(200).json({
            message: result.message,
            assignments: result.assignments || [],
        });
    } catch (error) {
        // Handle errors
        console.log("Error while assigning questions to the placement test:", error);
        handleError(res, error);
    }
};

const saveQuestionAndAddToLinkController = async (req, res) => {
    try {
        const data = req.body;

        const result = await questionService.saveQuestionAndAddToLinkService(data);

        return res.status(201).json({
            message: result.message,
            question: result.question,
        });
    } catch (error) {
        console.log("Error while saving question and adding to placement test:", error);
        handleError(res, error);
    }
};

const uploadAndAssignQuestionsToLinkController = async (filePath, topic_id, placement_test_id) => {
    try {
        if (!filePath || !topic_id) {
            throw new Error('File path and topic ID are required.');
        }
        console.log("test id received in controller : ", placement_test_id)

        const result = await questionService.uploadAndAssignQuestionsToLinkService(filePath, topic_id, placement_test_id);

        // Respond with the result summary and skipped questions (if any)
        return {
            message: result.message,
            summary: result.summary,
            skippedQuestions: result.skippedQuestions
        };
    } catch (error) {
        console.error("Error while uploading and assigning questions:", error);
        handleError(res, error)
    }
};

const getQuestionCountsByTopicIds = async (req, res) => {
    try {
        const { topic_ids } = req.body;
        console.log("Received topic IDs:", topic_ids);

        const questionCounts = await questionService.getQuestionCountsByTopicIds(topic_ids);

        return res.status(200).json(questionCounts);
    } catch (error) {
        console.error("Error in getQuestionCountsByTopicIds Controller:", error);
        handleError(res, error);
    }
};

const fetchQuestionsByTestIdController = async (req, res) => {
    try {
        const { placement_test_id } = req.body;
        
        if (!placement_test_id) {
            return res.status(400).send({ message: "Placement Test ID is required" });
        }

        const questions = await questionService.fetchQuestionsByTestIdService(placement_test_id);

        if (questions.length > 0) {
            return res.status(200).json(questions);
        } else {
            return res.status(404).send({ message: "No questions found for the given test ID" });
        }
    } catch (error) {
        console.log("Error in fetchQuestionsByTestIdController:", error);
        handleError(res, error);
    }
};

// const updateQuestionById = async (req, res) => {
//     try {
//         const { cumulative_question_id, question_description, options, correct_answers } = req.body;

//         if (!cumulative_question_id) {
//             return res.status(400).send({ message: "Cumulative Question ID is required" });
//         }

//         // Find the question by ID
//         const question = await db.CumulativeQuestion.findByPk(cumulative_question_id);

//         if (!question) {
//             return res.status(404).send({ message: "Question not found" });
//         }

//         // Update the question description
//         question.question_description = question_description || question.question_description;
//         await question.save();

//         // Update options
//         if (options && options.length) {
//             // Delete existing options
//             await db.Option.destroy({
//                 where: { cumulative_question_id }
//             });

//             // Add new options
//             for (let option of options) {
//                 await db.Option.create({
//                     cumulative_question_id,
//                     option_description: option.option_description
//                 });
//             }
//         }

//         // Filter correct answers to keep only those that match the available options
//         const validCorrectAnswers = correct_answers.filter(answer => 
//             options.some(option => option.option_description === answer)
//         );

//         // Update correct answers
//         if (validCorrectAnswers && validCorrectAnswers.length) {
//             // Delete existing correct answers
//             await db.CorrectAnswer.destroy({
//                 where: { cumulative_question_id }
//             });

//             // Add new valid correct answers
//             for (let answer of validCorrectAnswers) {
//                 await db.CorrectAnswer.create({
//                     cumulative_question_id,
//                     answer_description: answer
//                 });
//             }
//         }

//         res.status(200).send({ message: "Question updated successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// };


// controller.js


const updateQuestionByIdController = async (req, res) => {
    try {
        const { cumulative_question_id, question_description, options, correct_answers } = req.body;

        if (!cumulative_question_id) {
            return res.status(400).send({ message: "Cumulative Question ID is required" });
        }

        // Call the service to update the question
        const result = await questionService.updateQuestionService(cumulative_question_id, question_description, options, correct_answers);

        return res.status(200).send(result);
    } catch (error) {
        console.log("Error while updating question:", error);
        return res.status(500).send({ message: error.message });
    }
};

const getQuestionsByTopicIdController = async (req, res) => {
    try {
        const { topic_id } = req.body;  

        if (!topic_id) {
            return res.status(400).send({ message: 'Topic ID is required' });
        }

        const questions = await questionService.fetchQuestionsByTopicIdService(topic_id);

        if (questions.length > 0) {
            return res.status(200).json({
                message: 'Questions retrieved successfully',
                questions,
            });
        } else {
            return res.status(404).send({ message: 'No questions found for this topic' });
        }
    } catch (error) {
        console.log('Error in fetchQuestionsByTopicIdController:', error);
        handleError(res, error);  // Assuming you have a global error handler
    }
};


module.exports = {
    saveCumulatvieQuestion,
    updateCumulativeQuestion,
    deleteQuestion,
    assignQuestionsToPlacementTestController,
    saveQuestionAndAddToLinkController,
    uploadAndAssignQuestionsToLinkController,
    getQuestionCountsByTopicIds, 
    fetchQuestionsByTestIdController,
    // updateQuestionById,
    updateQuestionByIdController,
    getQuestionsByTopicIdController
}