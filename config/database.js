const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('manageuser', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;