const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Company = sequelize.define("Company", {
  company_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
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
  tableName: "companies",
  timestamps: true,
});

module.exports = Company;
