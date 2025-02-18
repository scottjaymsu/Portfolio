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
