const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); 
const Candidate = require('./candidate'); 

const OTPVerification = sequelize.define('OTPVerification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'candidates', 
      key: 'id',
    },
    allowNull: false,
  },
  otp_email: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  otp_phone: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  otp_email_sent_at: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
  otp_phone_sent_at: {
    type: DataTypes.DATE,
    allowNull: true, 
  },
}, {
  tableName: 'otp_verifications',
  timestamps: true,
});

// Association to Candidate model (one-to-many relation)
OTPVerification.belongsTo(Candidate, { foreignKey: 'candidate_id' });
Candidate.hasMany(OTPVerification, { foreignKey: 'candidate_id' });

module.exports = OTPVerification;
