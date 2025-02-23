const db = require('../models/db');
 
exports.getAirportParking = (req, res) => {
    const { Airport_Code } = req.params;
   
    // testing
    const airportcode = Airport_Code || 'KTEB';
    console.log(`Fetching parking data for airport ${airportcode}`);
    const query = 'SELECT Airport_Code, FBO_Name, Parking_Space_Taken, Total_Space FROM airport_parking WHERE Airport_Code = ?';
 
    db.query(query, [airportcode], (err, results) => {
        if (err) {
            console.error('Error fetching airport FBO parking:', err);
            res.status(500).send('Error fetching airport FBO parking');
            return;
        }
        // Testing
        console.log(results);
 
        res.json(results);
    });
}

