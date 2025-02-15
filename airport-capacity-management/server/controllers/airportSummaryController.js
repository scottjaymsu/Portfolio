const db = require('../models/db');

exports.getParkingCoordinates = (req, res) => {
    const {airport_code} = req.params;

    const query = "SELECT * FROM airport_parking WHERE Airport_Code = ? AND coordinates IS NOT NULL;";
    
    db.query(query, [airport_code], (err, results) => {
        if (err) {
            console.error("Error fetching departing airport parking...", err);
            res.status(500).json({error: "Error fetching airport parking..."});
        }
        else {
            res.json(results);
        }
    });
}

exports.getAirportData = (req, res) => {
    const {airport_code} = req.params;

    const query = "SELECT * FROM airport_data WHERE ident = ?;";
    
    db.query(query, [airport_code], (err, results) => {
        if (err) {
            console.error("Error fetching airport data...", err);
            res.status(500).json({error: "Error fetching airport data..."});
        }
        else {
            res.json(results);
        }
    });
}
  