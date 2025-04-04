const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabaseIfNotExists = async () => {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Check if the database exists, if not, create it
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();

    console.log(`Database '${DB_NAME}' checked/created successfully`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

// Create a Sequelize instance after ensuring the database exists
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

module.exports = { sequelize, createDatabaseIfNotExists };