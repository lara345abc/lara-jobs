const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Subject = require('./subject');
const CumulativeQuestion = require('./cumulativeQuestions');

const Topic = sequelize.define('Topic', {
    topic_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Subjects',
            key: 'subject_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});



module.exports = Topic;