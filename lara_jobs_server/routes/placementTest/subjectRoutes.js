const express = require('express');
const subjectRoutes = express.Router();
const subjectController = require('../../controllers/placementTest/subjectController');
const verifyJwt = require('../../middlewares/jwtMiddleware');

//save new Subject
subjectRoutes.post('/create', subjectController.createSubject);

//fetch all subject names 
subjectRoutes.get('/get-all-subjects', subjectController.getAllSubjects);

//fethc subject by Id
subjectRoutes.get('/getSubjectById/:subject_id', subjectController.getSubjectById);

//update subject 
subjectRoutes.put('/:subject_id', subjectController.updateSubject);

//delete a subject 
subjectRoutes.delete('/:subject_id', subjectController.deleteSubject);

subjectRoutes.get('/subject-topics', subjectController.getAllSubjectsAndTopicsController);


module.exports = subjectRoutes;




