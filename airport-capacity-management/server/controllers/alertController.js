/**
 * @file alertController.js
 * 
 * Controller to query data for alerts section on 
 * the simulator page. 
 */
const db = require('../models/db');

// Record = {airport code (faa designator), fbo name, primary key, priority}
exports.getFboInfo = (req, res) => {
    const airport = req.params.id;

    const query = `
        SELECT 
            Airport_Code,
            FBO_Name,
            id,
            Priority
        FROM
            airport_parking
        WHERE 
            Airport_Code = ?
        AND 
            FBO_Name = 'Jet Aviation'
    `;

    db.query(query, [airport], (err, results) => {
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