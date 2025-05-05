require('dotenv').config();
const { Sequelize } = require('sequelize');  // Correctly importing Sequelize

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,  // Add port in case it’s missing
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection successfully.');
  })
  .catch(err => {
    console.error("Can't connect to the database:", err);
  });

module.exports = sequelize;  // Export sequelize instance
