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

    



