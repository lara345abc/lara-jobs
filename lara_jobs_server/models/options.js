const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Option = sequelize.define('Option', {
    option_id: {
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
    option_description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true 
});

module.exports = Option;