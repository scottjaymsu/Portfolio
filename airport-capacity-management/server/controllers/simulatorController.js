const db = require('../models/db');


exports.getAirportFBOs = (req, res) => {
    const { iata_code } = req.params;
    const query = 'SELECT * FROM airport_parking WHERE iata_code = ?';
  
    db.query(query, [iata_code], (err, results) => {
      if (err) {
        console.error('Error fetching airport FBOs:', err);
        res.status(500).send('Error fetching airport FBOs');
        return;
      }
      console.log('Query results:', results); // Debugging statement
      res.json(results);
    });
  };

exports.getNetjetsFleet = (req, res) => {
    const query = 'SELECT * FROM mock_netjets_fleet_data';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching NetJets fleet:', err);
            res.status(500).send('Error fetching NetJets fleet');
            return;
        }
        console.log('Query results:', results); // Debugging statement
        res.json(results);
    });
};

exports.getArrivingPlanes = (req, res) => {
  const { iata_code } = req.params;
  const query = 'SELECT * FROM flight_plans WHERE arrival_airport = ? OR departure_airport = ?';

  db.query(query, [iata_code], (err, results) => {
    if (err) {
      console.error('Error fetching arriving planes:', err);
      res.status(500).send('Error fetching arriving planes');
      return;
    }
    console.log('Query results:', results); // Debugging statement
    res.json(results);
  });
};


exports.getRecommendations = (req, res) => {
    const { iata_code } = req.params;
    const parkedQuery = 'SELECT * FROM flight_plans WHERE flight_plans.arrival_airport = ? AND flight_plans.arrived = TRUE';
    // departing planes free up space
    try {
      const parkedPlanes = db.query(parkedQuery, [iata_code]);
      const reccomendations = generateRecommendations(parkedPlanes);
      
      res.json(reccomendations);
    } catch (err) {
      console.error('Error fetching parked planes:', err);
      res.status(500).send('Error fetching parked planes');
    }

};


// Rec Engine 
const generateRecommendations = (parkedPlanes) => {
  const reccomendations = [];

  const longTerm = "Can be moved to long term parking";
  const otherFBO = "Can be relocated to ";
  const closestAirport = "Can be moved to ";

  // 
  parkedPlanes.forEach((plane) => {
    // if fbo space < capacity 
    // if airport at capacity
    console.log(plane);
  });

  // need to return tail number --  status -- next event -- rec string associated
  return reccomendations;   
};



// Main map page 
// generate strings that say no airports are at capacity
