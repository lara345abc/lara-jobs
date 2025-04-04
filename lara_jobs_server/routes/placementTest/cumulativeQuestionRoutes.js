const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({dest : '../../uploads/questions'});
const express = require('express')
const cumulativeQuestionRoutes = express.Router();

const cumulativeQuestionController = require('../../controllers/placementTest/questionController');


cumulativeQuestionRoutes.post('/save-question', cumulativeQuestionController.saveCumulatvieQuestion);

cumulativeQuestionRoutes.post('/update-question', cumulativeQuestionController.updateQuestionByIdController);

cumulativeQuestionRoutes.post('/getQuestionCountsByTopicIds', cumulativeQuestionController.getQuestionCountsByTopicIds);

cumulativeQuestionRoutes.post('/saveQuestionAndAddToLink', cumulativeQuestionController.saveQuestionAndAddToLinkController);

cumulativeQuestionRoutes.post('/fetchQuestionsByTestId', cumulativeQuestionController.fetchQuestionsByTestIdController);

cumulativeQuestionRoutes.delete('/delete-question/:question_id', cumulativeQuestionController.deleteQuestion);

cumulativeQuestionRoutes.post('/getQuestionsByTopicId', cumulativeQuestionController.getQuestionsByTopicIdController);

cumulativeQuestionRoutes.post('/upload-questions-link', upload.single('file'), async (req, res) => {
    const topic_id = req.query.topic_id;
    const placement_test_id = req.query.placement_test_id; // Optional
    const filePath = req.file?.path;

    if (!topic_id) {
        return res.status(400).send({ 
            message: "The 'topic_id' query parameter is required." 
        });
    }

    if (!filePath) {
        return res.status(400).send({ 
            message: "No file uploaded. Please upload a valid Excel file." 
        });
    }

    try {
        // Call the controller method to process the file
        const response = await cumulativeQuestionController.uploadAndAssignQuestionsToLinkController(filePath, topic_id, placement_test_id);

        res.status(200).send({
            message: "Excel data processed successfully.",
            summary: response.summary,
            skippedQuestions: response.skippedQuestions
        });
    } catch (error) {
        console.error('Error processing questions:', error);
        res.status(500).send({
            message: "An error occurred while processing the Excel file.",
            error: error.message
        });
    }
});

module.exports = cumulativeQuestionRoutes;

