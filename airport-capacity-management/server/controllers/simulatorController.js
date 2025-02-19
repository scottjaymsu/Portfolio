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

// exports.getNetjetsFleet = (req, res) => {
//     const query = 'SELECT * FROM mock_netjets_fleet_data';

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching NetJets fleet:', err);
//             res.status(500).send('Error fetching NetJets fleet');
//             return;
//         }
//         console.log('Query results:', results); // Debugging statement
//         res.json(results);
//     });
// };

exports.getArrivingPlanes = (req, res) => {
  const { iata_code } = req.params;
  const query = 'SELECT flight_plans.acid, flight_plans.etd, flight_plans.eta FROM flight_plans WHERE flight_plans.arrival_airport = kteb AND flight_plans.arrived = TRUE';

  db.query(query, [iata_code, iata_code], (err, results) => {
    if (err) {
      console.error('Error fetching arriving planes:', err);
      res.status(500).send('Error fetching arriving planes');
      return;
    }
    console.log('Query results:', results); // Debugging statement
    res.json(results);
  });
};


exports.getRecommendations = async (req, res) => {
  const { iata_code } = req.params;
  const parkedQuery = 'SELECT flight_plans.acid, flight_plans.etd, flight_plans.eta FROM flight_plans WHERE flight_plans.arrival_airport = ? AND flight_plans.arrived = TRUE';

  try {
    const parkedPlanes = await new Promise((resolve, reject) => {
      db.query(parkedQuery, ['k'+iata_code], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    console.log('Parked planes:', parkedPlanes); // Debugging statement

    const recommendations = generateRecommendations(parkedPlanes);
    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching parked planes:', err);
    res.status(500).send('Error fetching parked planes');
  }
};


// Rec Engine 
const generateRecommendations = (parkedPlanes) => {
  const recommendations = [];
  const currentTime = new Date();

  const longTerm = "can be moved to long term parking";
  const otherFBO = "Can be relocated to ";
  const closestAirport = "Can be moved to ";

  if (Array.isArray(parkedPlanes) && parkedPlanes.length > 0) {
    parkedPlanes.forEach((plane) => {
      const etdDate = new Date(plane.etd);
      const formattedDate = `${etdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}, ${etdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

      // Difference in time: If event more than 24hrs in advance, could be moved
      const hoursDifference = (etdDate - currentTime) / (1000 * 60 * 60);
      if (hoursDifference >= 24 || etdDate < currentTime) {
        
        const recommendation = {
          tailNumber: plane.acid,
          status: "Parked",
          nextEvent: formattedDate,
          recString: `${longTerm}` // Example recommendation string
        };
        console.log(plane);

        recommendations.push(recommendation);
      }
      
    });
  } else {
    const recommendation = {
      tailNumber: "Null",
      status: "Null",
      nextEvent: "Null",
      recString: "No Recommendations at this time"
    };

    recommendations.push(recommendation);
  }

  return recommendations;   
};



// Main map page 
// generate strings that say no airports are at capacity
