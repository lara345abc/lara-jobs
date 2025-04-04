const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const CQPlacementTest = sequelize.define('CQPlacementTest', {
    cumulative_question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CumulativeQuestion',
            key: 'cumulative_question_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    placement_test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PlacementTest',
            key: 'placement_test_id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    }
}, {
    timestamps: false,
    tableName: 'CQPlacementTest',
    indexes: [
        {
            name: 'uq_cq_pt_unique',
            // unique: true,
            fields: ['cumulative_question_id', 'placement_test_id']
        }
    ]
});

module.exports = CQPlacementTest;