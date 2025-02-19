/**
 * Controller to query flight data that is 
 * passed to the client.
 */
const flightDB = require('../models/db');

// Controller to get flight data by airport that it is arriving to
exports.getArrivingFlights = (req, res) => {
    // Testing
    const airport = req.query.departing_airport || 'KTEB';

    // {tail number, eta, departing airport, arrival airport}
    const query = 'SELECT acid, eta, departing_airport, arrival_airport FROM flight_plans WHERE departing_airport = ?';

    flightDB.query(query, [airport], (err, results) => {
        if (err) {
            console.error("Error querying airport data.", err);
            return res.status(500).json({ error: 'Error querying airport data.' });
        }

        // Testing
        console.log(results);
        // Send results back as response
        res.json(results);
    });
}
