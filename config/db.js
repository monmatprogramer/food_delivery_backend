const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlPool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});
module.exports = mysqlPool;
