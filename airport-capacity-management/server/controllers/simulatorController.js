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

