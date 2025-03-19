/**
 * @file alertController.js
 * 
 * Controller to query data for alerts section on 
 * the simulator page. 
 */
const db = require('../models/db');

// Record = {airport code (faa designator), fbo name, primary key, priority}
exports.getAlert = (req, res) => {
    const airport = req.params.id;
    const fbo = req.params.fbo;

    const query = `
	    SELECT 
            airport_parking.Airport_Code,
            airport_parking.FBO_Name,
            airport_parking.id,
            airport_parking.Priority,
            parked_at.acid,
            netjets_fleet.flightRef,
            netjets_fleet.plane_type,
            flight_plans.status,
            flight_plans.etd
        FROM
            airport_parking
		LEFT JOIN
			parked_at
		ON
			parked_at.fbo_id = airport_parking.id
		LEFT JOIN 
			netjets_fleet
		ON 
			netjets_fleet.acid = parked_at.acid
		LEFT JOIN 
			flight_plans
		ON 
			flight_plans.flightRef = netjets_fleet.flightRef
        WHERE 
            Airport_Code = ?
        AND 
            FBO_Name = ?
    `;

    db.query(query, [airport, fbo], (err, results) => {
        if (err) {
            console.error("Error querying alert data.", err);
            return res.status(500).json({ error: 'Error querying alert data.' });
        }

        // Testing
        console.log(results);
        // Send results back as response
        res.json(results);
    });
}   