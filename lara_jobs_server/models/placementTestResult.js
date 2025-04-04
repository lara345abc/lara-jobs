const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const PlacementTest = require('./placementTest');
const Candidate = require('./candidate');

const PlacementTestResult = sequelize.define('PlacementTestResult', {
    placement_test_result_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    placement_test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Placementtests', 
            key: 'placement_test_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'candidates',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    marks_obtained: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total_marks: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    university_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    college_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true, 
    tableName: 'Placementtestresults' 
});



module.exports = PlacementTestResult