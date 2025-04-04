const CustomError = require('../../errors/CustomErrors');
const { Topic, Subject, PlacementTestTopic } = require('../../models');
const subjectService = require('./subjectSevices')

const createTopic = async (name, subjectId) => {
    try {
        // First, check if the subject exists using the getSubjectById method
        const subject = await subjectService.getSubjectById(subjectId);

        if (!subject) {
            throw new CustomError('Subject not found', 'SUBJECT_NOT_FOUND');
        }

        // Create the topic if the subject exists
        const topic = await Topic.create({
            name,
            subject_id: subjectId
        });

        return topic;
    } catch (error) {
        console.log('Error while creating topic: ', error);

        if (error.code === 'SUBJECT_NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        // If error is related to the database or Sequelize model
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while creating the topic', 'DATABASE_ERROR');
        }

        // If any other unknown error occurred
        throw new CustomError('Error creating topic: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const updateTopic = async (name, topic_id) => {
    try {
        name = name.trim();
        const topic = await Topic.findByPk(topic_id);

        if (!topic) {
            throw new CustomError('Topic Not Found ', 'TOPIC_NOT_FOUND');
        }

        const existingTopic = await Topic.findOne({
            where: { name }
        })

        if (existingTopic) {
            throw new CustomError('Topic with this name exists', 'TOPIC_NAME_EXIST');
        }

        topic.name = name;
        await topic.save();
        return topic;

    } catch (error) {
        console.log('Error while updating topic : ', error)
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while updating the subject', 'DATABASE_ERROR');
        }
        if (error.code === 'TOPIC_NOT_FOUND' || error.code === 'TOPIC_NAME_EXIST') {
            throw new CustomError(error.message, error.code);
        }
        throw new CustomError('Error updating subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
}

const getTopicById = async (topicId) => {
    try {
        const topic = await Topic.findByPk(topicId);
        if (!topic) {
            throw new CustomError('Topic Not Found', 'TOPIC_NOT_FOUND');
        }
        return topic;
    } catch (error) {
        console.log('Error while fetching topic: ', error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while fetching the topic', 'DATABASE_ERROR');
        }
        throw new CustomError('Error fetching topic: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getAllTopics = async () => {
    try {
        const topics = await Topic.findAll();
        return topics;
    } catch (error) {
        console.log('Error while fetching all topics: ', error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while fetching topics', 'DATABASE_ERROR');
        }
        throw new CustomError('Error fetching topics: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const deleteTopic = async (topicId) => {
    try {
        const topic = await Topic.findByPk(topicId);
        if (!topic) {
            throw new CustomError('Topic Not Found', 'TOPIC_NOT_FOUND');
        }

        // Deleting the topic
        await topic.destroy();
        return { message: 'Topic deleted successfully' };
    } catch (error) {
        console.log('Error while deleting topic: ', error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while deleting the topic', 'DATABASE_ERROR');
        }
        throw new CustomError('Error deleting topic: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getTopicsBySubjectId = async (subjectId) => {
    try {
        const subject = await subjectService.getSubjectById(subjectId);

        if (!subject) {
            throw new CustomError('Subject not found', 'SUBJECT_NOT_FOUND');
        }

       const topics = await Topic.findAll({
        where : {subject_id : subjectId}
       });

       if(topics.length === 0){
        throw new CustomError('No Topics Found for this Subject', 'NO_TOPICS_ASSIGNED');
       }

        return topics;
    } catch (error) {
        console.log('Error while creating topic: ', error);

        if (error.code === 'SUBJECT_NOT_FOUND' || error.code === 'NO_TOPICS_ASSIGNED') {
            throw new CustomError(error.message, error.code);
        }

        // If error is related to the database or Sequelize model
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while creating the topic', 'DATABASE_ERROR');
        }

        // If any other unknown error occurred
        throw new CustomError('Error creating topic: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getTopicsByPlacementTestId = async (placementTestId) => {
    try {
        const topics = await PlacementTestTopic.findAll({
            where: { placement_test_id: placementTestId },
            include: [
                {
                    model: Topic,
                    as: 'Topics',
                    include: [
                        {
                            model: Subject,
                            as: 'subject',
                            attributes: ['subject_id', 'name']
                        }
                    ],
                    attributes: ['topic_id', 'name']
                }
            ],
            attributes: []
        });

        if (!topics || topics.length === 0) {
            throw new CustomError('No topics found for the given placement test ID.', 'NO_TOPICS_FOUND');
        }

        const topicDetails = topics.map(topicEntry => {
            const topicData = topicEntry.Topics;
            if (!topicData) return null;

            return {
                topic_id: topicData.topic_id,
                topic_name: topicData.name,
                subject_id: topicData.subject.subject_id,
                subject_name: topicData.subject.name
            };
        }).filter(detail => detail !== null); // Filter out any null values

        return topicDetails;
    } catch (error) {
        console.log("Error while fetching topics by placement test ID: ", error);

        // Handle specific error types
        if (error.code === 'NO_TOPICS_FOUND') {
            throw new CustomError(error.message, error.code);
        }

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while fetching topics', 'DATABASE_ERROR');
        }

        throw new CustomError('Error fetching topics: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


module.exports = {
    createTopic,
    updateTopic,
    getTopicById,
    getAllTopics,
    deleteTopic,
    getTopicsBySubjectId,
    getTopicsByPlacementTestId,
}