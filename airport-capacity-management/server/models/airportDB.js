const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

/*
Airport database connection

This file sets up the connection to our AWS database. You will need a .env file in the server directory with the database credentials to access it.
*/

const airportDB = mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

airportDB.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Get airport data by iata code 
// data = {iata code, name, capacity}
const getAirportData = (iataCode) => {
    'SELECT name, iata_code, capacity FROM airport_data WHERE iata_code = KTEB';
    
    airportDB.query(query, [iataCode], (err, results) => {
        if (err) {
        console.error("Error fetching airports...", err);
        return {error: "Error fetching airports..."};
        }
        console.log(results);
        return results;
    });


};

module.exports = airportDB;