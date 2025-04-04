const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');
const Topic = require('./Topic');

const Subject = sequelize.define('Subject', {
    subject_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true
});



module.exports = Subject;