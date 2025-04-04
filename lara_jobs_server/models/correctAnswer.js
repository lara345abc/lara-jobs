const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const CorrectAnswer = sequelize.define('CorrectAnswer', {
    correct_answer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cumulative_question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CumulativeQuestions',
            key: 'cumulative_question_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    answer_description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true 
});

module.exports = CorrectAnswer; 