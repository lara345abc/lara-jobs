const CustomError = require("../../errors/CustomErrors");
const { Subject, Topic } = require("../../models");


const createSubject = async (name) => {
    try {
        console.log("Subject name ", name )
        const existingSubject = await Subject.findOne({ where: { name } });
        if (existingSubject) {
            throw new CustomError('A subject with this name already exists.', 'SUBJECT_ALREADY_EXISTS');
        }

        const subject = await Subject.create({ name });

        return subject;
    } catch (error) {
        console.log("error ", error);

        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred', 'DATABASE_ERROR');
        }

        if (error.code === 'SUBJECT_ALREADY_EXISTS') {
            throw new CustomError(error.message, error.code);
        }

        throw new CustomError('Error creating subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const getAllSubjects = async () => {
    try {
        const subjects = await Subject.findAll();
        return subjects;
    } catch (error) {
        console.log("Error while fetching subjects: ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while fetching subjects', 'DATABASE_ERROR');
        }
        throw new CustomError('Error fetching subjects: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getSubjectById = async (subjectId) => {
    try {
        console.log("Subject id ", subjectId)
        console.log("Inside get subject by ID : =================")
        const subject = await Subject.findByPk(subjectId);
        if (!subject) {
            throw new CustomError('Subject not found', 'SUBJECT_NOT_FOUND');
        }
        return subject;
    } catch (error) {
        console.log("Error while fetching subject: ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while fetching the subject', 'DATABASE_ERROR');
        }
        if (error.code === 'SUBJECT_NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }
        throw new CustomError('Error fetching subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};


const updateSubject = async (subjectId, name) => {
    try {
        const subject = await Subject.findByPk(subjectId);
        if (!subject) {
            throw new CustomError('Subject not found', 'SUBJECT_NOT_FOUND');
        }

        // Check if the updated name already exists
        const existingSubject = await Subject.findOne({ where: { name } });
        if (existingSubject && existingSubject.subject_id !== subjectId) {
            throw new CustomError('A subject with this name already exists.', 'SUBJECT_ALREADY_EXISTS');
        }

        // Update the subject
        subject.name = name;
        await subject.save();
        return subject;
    } catch (error) {
        console.log("Error while updating subject: ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while updating the subject', 'DATABASE_ERROR');
        }
        if (error.code === 'SUBJECT_NOT_FOUND' || error.code === 'SUBJECT_ALREADY_EXISTS') {
            throw new CustomError(error.message, error.code);
        }
        throw new CustomError('Error updating subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const deleteSubject = async (subjectId) => {
    try {
        const subject = await Subject.findByPk(subjectId);
        if (!subject) {
            throw new CustomError('Subject not found', 'SUBJECT_NOT_FOUND');
        }

        await subject.destroy();
        return { message: 'Subject deleted successfully', };
    } catch (error) {
        console.log("Error while deleting subject: ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while deleting the subject', 'DATABASE_ERROR');
        }
        if (error.code === 'SUBJECT_NOT_FOUND') {
            throw new CustomError(error.message, error.code);
        }
        throw new CustomError('Error deleting subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
};

const getAllSubjectsAndTopics = async () => {
    try {
        console.log("Req received in services : all topics and subjects ")
        const subjectAndTopics = await Subject.findAll({
            include: [
                {
                    model: Topic,
                    as: 'topics'
                }
            ]
        });
        return subjectAndTopics;
    } catch (error) {
        console.log("Error while fetching subject and topics: ", error);
        if (error.name === 'SequelizeDatabaseError') {
            throw new CustomError('Database error occurred while deleting the subject', 'DATABASE_ERROR');
        }

        throw new CustomError('Error deleting subject: ' + error.message, 'INTERNAL_SERVER_ERROR');
    }
}

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
    getAllSubjectsAndTopics,
}