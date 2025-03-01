const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlPool = mysql.createPool();