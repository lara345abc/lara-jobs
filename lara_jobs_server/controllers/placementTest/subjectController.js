const handleError = require('../../errors/errorHandler');
const subjectService = require('../../services/placementTest/subjectSevices')

const createSubject = async (req, res) => {
    try {
        const { name } = req.body;
        console.log("Subject name received : ", name)
        const subject = await subjectService.createSubject(name);
        return res.status(201).json({
            message: 'Subject created successfully',
            data: subject
        });
    } catch (error) {
        console.log("Error while saving candidate email:", error);
        handleError(res, error)
    }
};


const getAllSubjects = async (req, res) => {
    try {
        const subjects = await subjectService.getAllSubjects();
        return res.status(200).json({
            message : 'Fetched All Subjects successfully', 
            data : subjects
        });
    } catch (error) {
        console.log("Error while fetching All Subjects : ", error);
        handleError(res, error);
    }
}


const getSubjectById = async (req, res) => {
    try {
        const {subject_id} = req.params;
        console.log(" subject Id " , subject_id)
        const subject = await subjectService.getSubjectById(subject_id);
        return res.status(200).json({
            message : 'Subject Found ', 
            data : subject
        });
    } catch (error) {
        console.log("Error while fetching subject By ID :", error);
        handleError(res, error);
    }
}

const updateSubject = async (req, res) => {
    try {
        const {subject_id} = req.params;
        const { subject_name } = req.body;
        const subject = await subjectService.updateSubject(subject_id, subject_name);
        return res.status(200).json({
            message : 'Subject updated successfully', 
            data : subject
        });
    } catch (error) {
        console.log('Error while updaing subject : ', error);
        handleError(res, error);
    }
}

const deleteSubject = async (req, res) => {
    try{
        const {subject_id} = req.params;
        await subjectService.deleteSubject(subject_id);
        return res.status(200).json({
            message : 'Subject Deleted Successfully',
            isDeleted : true
        })
    }catch(error){
        console.log('Error while deleting Subject : ', error);
        handleError(res, error);
    }
}

const getAllSubjectsAndTopicsController = async (req, res) => {
    try {
        console.log("Request Received in controller : ==============")
        const subjectAndTopics = await subjectService.getAllSubjectsAndTopics();
        res.status(200).json({
            message : 'Fetched All Subjeccts and their topics Successfully', 
            data : subjectAndTopics,
        })
    } catch (error) {
        console.log("Error while fetching subject and it's topics", error);
        handleError(res, error);
    }
}

module.exports = {
    createSubject,
    getAllSubjects, 
    getSubjectById, 
    updateSubject,
    deleteSubject,
    getAllSubjectsAndTopicsController,
};
