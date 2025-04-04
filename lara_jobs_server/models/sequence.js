const { Model, DataTypes } = require('sequelize');
const { createDatabaseIfNotExists } = require('../config/dbConfig');

const initializeSequelize = async () => {
  const sequelize = await createDatabaseIfNotExists(); 

  class Sequence extends Model {}

  Sequence.init(
    {
      date: {
        type: DataTypes.STRING, // Format as YYYYMMDD
        allowNull: false,
        unique: true, // Only one sequence per day
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'Sequence',
      tableName: 'sequences',
      timestamps: false,
    }
  );
};

module.exports = { initializeSequelize, Sequence };
