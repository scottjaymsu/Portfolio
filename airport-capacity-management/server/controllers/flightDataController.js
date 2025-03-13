/**
 * Controller to query flight data that is 
 * passed to the client.
 */
const flightDB = require('../models/db');

// Controller to get flight data by airport that it is arriving to
exports.getArrivingFlights = (req, res) => {
    const airport = req.params.id;

    // {tail number, eta, departing airport, arrival airport, plane type, parking area}
    const query = `
        SELECT 
            flight_plans.acid, 
            flight_plans.eta, 
            flight_plans.departing_airport, 
            flight_plans.arrival_airport, 
            netjets_fleet.plane_type,
            aircraft_types.parkingArea
        FROM 
            flight_plans
        LEFT JOIN 
            netjets_fleet
        ON 
            flight_plans.acid = netjets_fleet.acid
        LEFT JOIN 
            aircraft_types
        ON 
            netjets_fleet.plane_type = aircraft_types.type
        WHERE 
            flight_plans.arrival_airport = ?
            AND flight_plans.eta >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        ORDER BY flight_plans.eta ASC
    `;

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

// Controller to get next departure flights times by airport
// {tail number, departing date/time, plane type, plane area (ft.^2)}
exports.getDepartingFlights = (req, res) => {
    const airport = req.params.id;

    const query = `
        SELECT 
            flight_plans.acid,
            flight_plans.etd,
            netjets_fleet.plane_type,
            aircraft_types.parkingArea
        FROM 
            flight_plans
        LEFT JOIN
            netjets_fleet
        ON 
            netjets_fleet.acid = flight_plans.acid
        LEFT JOIN 
            aircraft_types
        ON 
            netjets_fleet.plane_type = aircraft_types.type            
        WHERE 
            flight_plans.departing_airport = ?
            AND flight_plans.etd >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        ORDER BY flight_plans.etd ASC
    `;

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