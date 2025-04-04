const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const PlacementTest = require('./placementTest');

const CumulativeQuestion = sequelize.define('CumulativeQuestion', {
    cumulative_question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topics',
            key: 'topic_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    question_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    no_of_marks_allocated: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    difficulty_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    test_id: {  // ✅ Adding the test_id field
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'PlacementTests',
            key: 'placement_test_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true
});

CumulativeQuestion.belongsTo(PlacementTest, {
    foreignKey: 'test_id',
    as: 'PlacementTest'
});

module.exports = CumulativeQuestion;
