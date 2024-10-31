// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const mysqlSequelize = new Sequelize(
  process.env.MYSQL_DB_NAME,
  process.env.MYSQL_DB_USER,
  process.env.MYSQL_DB_PASSWORD,
  {
    host: process.env.MYSQL_DB_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_DB_PORT || 3306,
    logging: false,
  }
);

const postgresSequelize = new Sequelize(
  process.env.POSTGRES_DB_NAME,
  process.env.POSTGRES_DB_USER,
  process.env.POSTGRES_DB_PASSWORD,
  {
    host: process.env.POSTGRES_DB_HOST,
    dialect: 'postgres',
    port: process.env.POSTGRES_DB_PORT || 5432,
    logging: false,
  }
);

module.exports = {
  mysqlSequelize,
  postgresSequelize,
};




// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       //useNewUrlParser: true,
//       //useUnifiedTopology: true,
//     });
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
