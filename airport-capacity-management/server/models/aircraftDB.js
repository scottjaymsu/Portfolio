const mysql = require('mysql2');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

// Set up connection to database
const aircraftDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  localInfile: true
});

aircraftDB.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  }
  console.log('Connected to MySQL');
});

// Create the Aircraft table query
const createTable = `CREATE TABLE IF NOT EXISTS 
Aircraft (
  type VARCHAR(255) NOT NULL,
  parkingArea FLOAT NOT NULL
)`;

aircraftDB.query(createTable, (err, result) => {
  if (err) {
    console.error('Error creating Aircraft table:', err);
  }
  console.log('Aircraft table created successfully');
});

// Query to get columns from the Aircraft table
const getColumns = `SHOW COLUMNS FROM Aircraft`;

aircraftDB.query(getColumns, (err, result) => {
  if (err) {
    console.error('Error getting columns from Aircraft table:', err);
  }
  console.log('Columns from Aircraft table:', result);
});

// Clear table before inserting data
const clearTable = `TRUNCATE TABLE Aircraft`;
aircraftDB.query(clearTable, (err, result) => {
  if (err) {
    console.error('Error clearing table:', err);
  }
  console.log('Table cleared successfully');
});

// Add column information from /server/files/aircraft_data.csv to the Aircraft table
const insertData = (data) => {
  const insertQuery = `INSERT INTO Aircraft (type, parkingArea) VALUES ?`;
  aircraftDB.query(insertQuery, [data], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
    } else {
      console.log('Data inserted successfully');
    }
  });
};

// Read the CSV file and insert data into the Aircraft table
const filePath = path.join(__dirname, '../files/aircraft_data.csv');
const results = [];
fs.createReadStream(filePath).pipe(csv())
  .on('data', (data) => {
    // Remove commas before converting to float
    const parkingArea = parseFloat(data.Parking_Area_ft2.replace(/,/g, ''));
    // Map the CSV columns to the table columns
    results.push([data.FAA_Designator, parkingArea]);
  })
  .on('end', () => {
    insertData(results);

    // Query to get all data from the Aircraft table
    const selectAll = `SELECT * FROM Aircraft`;
    aircraftDB.query(selectAll, (err, result) => {
      if (err) {
        console.error('Error getting data from Aircraft table:', err);
      }
      console.log('Data from Aircraft table:', result);
    });

    // Close the connection
    aircraftDB.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
      }
      console.log('Connection closed');
    });
  });
module.exports = aircraftDB;