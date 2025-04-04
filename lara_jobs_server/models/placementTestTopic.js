const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const Topic = require('./Topic');
const PlacementTest = require('./placementTest');

const PlacementTestTopic = sequelize.define('PlacementTestTopic', {
    placement_test_topic_id: {
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
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topics',
            key: 'topic_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'Placementtesttopics' 
});



module.exports = PlacementTestTopic;