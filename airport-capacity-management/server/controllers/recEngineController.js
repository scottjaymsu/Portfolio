const db = require('../models/db');

exports.upcomingDepartingFlights = (req, res) => {
    const {iata_code} = req.params;
    let {airline} = req.params;

    if (!airline) {
        airline = '%%';
    }
    else {
        airline = `%${airline}%`
    }
    
    const query = "SELECT * FROM flights WHERE departure_iata = ? AND airline LIKE ? ORDER BY departure_time";
    
    db.query(query, [iata_code, airline], (err, results) => {
        if (err) {
            console.error("Error fetching departing flights...", err);
            res.status(500).json({error: "Error fetching departing flights..."});
        }
        else {
            res.json(results);
        }
    });
};

//This currently grabs ALL NetJets planes in our flight_messages table for "dummy data". We do not have access to know what airplanes
//are at what airport as of this moment
exports.getPlanesAtAirport = (req, res) => {
    const {iata_code} = req.params;
    let {airline} = req.params;

    if (!airline) {
        airline = '%%';
    }
    else {
        airline = `%${airline}%`
    }

    const query = `SELECT mock.tail_number, ICAO_code, status, departure_standardized_time FROM mock_netjets_fleet_data mock JOIN flights ON flights.tail_number = mock.tail_number WHERE flights.departure_iata = ?
    AND airline LIKE ?`;
    
    db.query(query, [iata_code, airline], (err, results) => {
        if (err) {
            console.error("Error fetching planes at airport...", err);
            res.status(500).json({error: "Error fetching planes at airport..."});
        }
        else {
            res.json(results);
        }
    });
};


exports.getAllPlanes = (req, res) => {
    const query = `SELECT * FROM mock_netjets_fleet_data mock JOIN aircraft_fleet ON mock.tail_number = aircraft_fleet.tail_number;`;
    
    db.query(query, [], (err, results) => {
        if (err) {
            console.error("Error fetching all planes in fleet...", err);
            res.status(500).json({error: "Error fetching all planes in fleet..."});
        }
        else {
            res.json(results);
        }
    });
};

//Getting all the metadata related to a plane by it's tail number. Limited to one because the batch data they gave us to 
//be able to spin up planes has overlapping tail numbers (it contains info about planes at airports, so some can be shown twice)
//For mock purposes this doesn't matter.
exports.getPlaneInformation = (req, res) => {
    const {tail_number} = req.params;
    const query = `SELECT * FROM aircraft_fleet WHERE tail_number = ? LIMIT 1;`;
    
    db.query(query, [tail_number], (err, results) => {
        if (err) {
            console.error("Error fetching plane by tail number...", err);
            res.status(500).json({error: "Error fetching plane by tail number..."});
        }
        else {
            res.json(results);
        }
    });
};

//Only uses our mock fbo data for now
exports.getAirportFBOs = (req, res) => {
    const {iata_code} = req.params;
    const query = `SELECT * FROM fbos WHERE airport_icao = ?;`;
    
    db.query(query, [iata_code], (err, results) => {
        if (err) {
            console.error("Error fetching fbos...", err);
            res.status(500).json({error: "Error fetching fbos..."});
        }
        else {
            res.json(results);
        }
    });
};

//Only uses our mock fbo data for now
exports.getFBOInformation = (req, res) => {
    const {id} = req.params;
    const query = `SELECT * FROM fbos WHERE id = ?;`;
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching fbos...", err);
            res.status(500).json({error: "Error fetching fbos..."});
        }
        else {
            res.json(results);
        }
    });
};

exports.getAirportInformation = (req, res) => {
    const {iata_code} = req.params;
    const query = `SELECT * FROM airports WHERE iata_code = ?;`;
    
    db.query(query, [iata_code], (err, results) => {
        if (err) {
            console.error("Error fetching airports...", err);
            res.status(500).json({error: "Error fetching airports..."});
        }
        else {
            res.json(results);
        }
    });
};

