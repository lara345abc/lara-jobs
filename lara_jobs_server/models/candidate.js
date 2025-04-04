const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Candidate = sequelize.define("Candidate", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unique_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pin_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM,
    values: ['CANDIDATE', 'ADMIN'],
    defaultValue: 'CANDIDATE',
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  town: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "candidates",
  timestamps: true,
});

module.exports = Candidate;
