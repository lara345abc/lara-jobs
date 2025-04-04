const express = require('express')
const topicRoutes = express.Router();

const topicController = require('../../controllers/placementTest/topicController')

topicRoutes.post('/create', topicController.createTopic);

topicRoutes.put('/updateTopic', topicController.updateTopic);

topicRoutes.get('/:topic_id', topicController.getTopicById);

topicRoutes.get('/get-all-topics', topicController.getAllTopics);

topicRoutes.delete('/delete/:topic_id', topicController.deleteTopic);

topicRoutes.get('/topics-by-subject/:subject_id', topicController.getTopicsBySubjectId);

topicRoutes.post('/topics-assignedto-test', topicController.getTopicsByPlacementTestId);


module.exports = topicRoutes