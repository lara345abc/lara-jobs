const { sequelize, createDatabaseIfNotExists } = require('../config/dbConfig');

// ================== model imports ========================== 
const Candidate = require('./candidate');
const OTPVerification = require('./otpVerfication');
const Subject = require('./subject');
const Topic = require('./Topic');
const CumulativeQuestion = require('./cumulativeQuestions')
const PlacementTest = require('./placementTest')
const CQPlacementTest = require('./CQPlacementTest')
const Option = require('./options')
const CorrectAnswer = require('./correctAnswer')
const PlacementTestResult = require('./placementTestResult')
const PlacementTestTopic = require('./placementTestTopic')
const Company = require('./companies')

const initDatabase = async () => {
  try {
    // Creates the database if it doesn't exist
    await createDatabaseIfNotExists();

    // Sync all models  with the database and the models present in the code 
    await sequelize.sync({ alter: false });  //this {alter : true} will add newly added column to the table without dropping them 

    console.log('Database and tables created successfully!');
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};


Subject.hasMany(Topic, {
  foreignKey: 'subject_id',
  as: 'topics'
});

Topic.belongsTo(Subject, {
  foreignKey: 'subject_id',
  as: 'subject'
});
Topic.hasMany(CumulativeQuestion, {
  foreignKey: 'topic_id',
  as: 'questions'
});

CumulativeQuestion.belongsTo(Topic, {
  foreignKey: 'topic_id',
  as: 'CumulativeQuestionTopic'
});
CumulativeQuestion.belongsToMany(PlacementTest, {
  through: 'CQPlacementTest',
  foreignKey: 'cumulative_question_id',
  as: 'PlacementTests'
});

CumulativeQuestion.belongsTo(PlacementTest, {
  foreignKey: 'test_id',
  as: 'QuestionForPlacementTest'
});

PlacementTest.belongsToMany(CumulativeQuestion, {
  through: 'CQPlacementTest',
  foreignKey: 'placement_test_id',
  as: 'CumulativeQuestions'
});


PlacementTestResult.belongsTo(PlacementTest, {
  foreignKey: 'placement_test_id',
  as: 'Placementtests'
});
PlacementTestResult.belongsTo(Candidate, {
  foreignKey: 'id',
  as: 'candidates'
});

PlacementTest.hasMany(PlacementTestTopic, {
  foreignKey: 'placement_test_id',
  as: 'placementTestTopics' 
});

PlacementTestTopic.belongsTo(PlacementTest, {
  foreignKey: 'placement_test_id',
  as: 'placementTest' 
});


PlacementTestTopic.belongsTo(Topic, {
  foreignKey: 'topic_id',
  // as: 'topics'
  as: 'Topics'
});

CumulativeQuestion.hasMany(Option, {
  foreignKey: 'cumulative_question_id',
  as: 'QuestionOptions'
});

CumulativeQuestion.hasMany(CorrectAnswer, {
  foreignKey: 'cumulative_question_id',
  as: 'CorrectAnswers' 
});

module.exports = {
  sequelize,
  initDatabase,
  Candidate,
  OTPVerification,
  Subject,
  Topic,
  CumulativeQuestion, PlacementTest, CQPlacementTest, Option, CorrectAnswer, PlacementTestResult, PlacementTestTopic, Company
}