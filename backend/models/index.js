const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Employee = require('./Employee')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Analytics = require('./Analytics')(sequelize, Sequelize);

// Associations
db.Employee.hasMany(db.Analytics, { foreignKey: 'employeeId' });
db.Analytics.belongsTo(db.Employee, { foreignKey: 'employeeId' });

module.exports = db;