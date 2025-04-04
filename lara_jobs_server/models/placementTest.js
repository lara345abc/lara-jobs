const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 

const PlacementTest = sequelize.define('PlacementTest', {
    placement_test_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    test_link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number_of_questions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    start_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    show_result: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_Active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_Monitored: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    issue_certificate: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    test_title: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    certificate_name: {
        type: DataTypes.STRING,
        allowNull: true 
    },
    isDescriptiveTest: {
        type: DataTypes.BOOLEAN,
        allowNull: true 
    },
}, {
    timestamps: true,
    tableName: 'Placementtests'
});



module.exports = PlacementTest;