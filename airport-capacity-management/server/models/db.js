const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

/*
This file sets up the connection to our AWS database. You will need a .env file in the server directory with the database credentials to access it.
*/

const db = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = db;