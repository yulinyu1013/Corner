const mysql = require('mysql2');
require('dotenv').config();

// const conn = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER_ADMIN,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   waitForConnections: true,
// });

const conn = mysql.createPool({
  host: 'database-1.c1o1vrjh3mlc.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'cis557corner',
  database: 'Corner',
  waitForConnections: true,
});

module.exports = conn;
