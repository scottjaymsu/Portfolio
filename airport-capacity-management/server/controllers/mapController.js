const db = require('../models/db');

//  Find out if airports are under or over capacity -- Not sure if this was done for frontend yet
exports.getCurrentAirportStatus = async (req, res) => {
    const { iata_code } = req.params;

    const query = '';
    try { 
        const currStatus = await new Promise((resolve, reject) => {
            db.query(query, ['k'+iata_code], (err, results) => {
              if (err) {
                return reject(err);
              }
              resolve(results);
            });
        });

        const allStatus = currStatusStringGen(currStatus);
        res.json(allStatus);

    } catch (err) {
        console.error('Error fetching current status:', err);
        res.status(500).send('Error fetching current status');
    }
};

const currStatusStringGen = (status) => {
    const allStatus = [];
    const over = " is currently over capacity.";
    const under = " is currently under capacity.";
    status.forEach((airport) => {
        const s = {
            statStr: airport.ident + (airport.current_load > airport.capacity ? over : under),
        };
        allStatus.push(s);
    });
        
    return allStatus;
};

    


//This query essentially grabs the data related to all the fbo capacities at each airport and groups them all together as one. It then
//determines a capacity status based on if the current planes at the airport (gotten froma flight plans table) is over or under the total
//fbo capacity. I put reaching capacity as 90% of the total capacity, it can be changed later. Also returns some metadata related to long and lat
exports.getAirportMarkers = async (req, res) => {
    const query = `SELECT ad.ident, ad.latitude_deg, ad.longitude_deg,
    CASE WHEN (SUM(ap.Total_Space) - SUM(ap.Total_Space/10)) > COUNT(DISTINCT fp.acid) THEN 'Undercapacity'
    WHEN SUM(ap.Total_Space) < COUNT(DISTINCT fp.acid) THEN 'Overcapacity'
    ELSE 'Reaching Capacity'
    END AS capacity_status
    FROM airport_data ad JOIN airport_parking ap ON ad.ident = ap.Airport_Code
    LEFT JOIN flight_plans fp ON fp.arrival_airport = ad.ident AND fp.status = 'ARRIVED'
    AND fp.flightRef = ( SELECT MAX(flightRef) FROM flight_plans AS sub_table WHERE sub_table.acid = fp.acid)
    GROUP BY ad.ident; `
    
    db.query(query, [], (err, results) => {
        if (err) {
            console.error("Error fetching airport data...", err);
            res.status(500).json({error: "Error fetching airport data..."});
        }
        else {
            const formattedResults = results.map((row) => ({
                position: {
                    lat: parseFloat(row.latitude_deg),
                    lng: parseFloat(row.longitude_deg)
                },
                title: row.ident,
                status: row.capacity_status
            }))
            res.json(formattedResults);
        }
    });
};