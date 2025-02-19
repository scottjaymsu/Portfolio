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

/**
 * Run querys for data used for reccomendations
 */
exports.getRecommendations = async (req, res) => {
  const { iata_code } = req.params;
  const parkedQuery = 'SELECT flight_plans.acid, flight_plans.etd, flight_plans.eta FROM flight_plans WHERE flight_plans.arrival_airport = ? AND flight_plans.arrived = TRUE';
  const currentAirportCoordQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon FROM airport_data WHERE ident = ?';
  const allAirportCoordQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon, ident FROM airport_data WHERE ident != ?';

  // airports withing a certain range
  const closeAirportsQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon, ident FROM airport_data WHERE ident != ? AND latitude_deg BETWEEN (? - ?) AND (? + ?) AND longitude_deg BETWEEN (? - ?) AND (? + ?)';

  // Combine Parked at query with getting the current FBO - reccomend moving to different FBO
  try {
    const parkedPlanes = await new Promise((resolve, reject) => {
      db.query(parkedQuery, ['k'+iata_code], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    // Get our airport coordinates
    const currentAirportCoord = await new Promise((resolve, reject) => {
      db.query(currentAirportCoordQuery, ['k'+iata_code], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });

    // Getting the ranges
    const [rangeLat, rangeLon] = generateDistance(currentAirportCoord);

    // Finding Airports withing 100KM
    const closeAirports = await new Promise((resolve, reject) => {
      db.query(closeAirportsQuery, ['k'+iata_code, currentAirportCoord.lat, rangeLat, currentAirportCoord.lat, rangeLat, currentAirportCoord.lon, rangeLon, currentAirportCoord.lon, rangeLon], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    const sortedAirports = sortAirports(closeAirports, currentAirportCoord.lat, currentAirportCoord.lon);
    console.log('Current airport:', currentAirportCoord); // Debugging statement

    console.log('Closest airports sorted:', sortedAirports); // Debugging statement

    console.log('Parked planes:', parkedPlanes); // Debugging statement

    const recommendations = generateRecommendations(parkedPlanes, sortedAirports);
    res.json(recommendations);
  } catch (err) {
    console.error('Error fetching parked planes:', err);
    res.status(500).send('Error fetching parked planes');
  }
};



// REC Engine For Outputting Strings 
const generateRecommendations = (parkedPlanes, sortedAirports) => {
  const recommendations = [];
  const currentTime = new Date();
  closestAirport = sortedAirports[0].ident; // Closest airport 

  const overCapacity = "Airport is currently Over Capacity";
  const underCapacity = "Airport is currently Under Capacity";
  const noMovement = "No Movement Required";

  const longTerm = "can be moved to long term parking";
  const otherFBO = "Can be relocated to ";
  const close = "Closest Airport can be reloacted to: K";

  if (Array.isArray(parkedPlanes) && parkedPlanes.length > 0) {
    parkedPlanes.forEach((plane) => {
      const etdDate = new Date(plane.etd);
      const formattedDate = `${etdDate.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}, ${etdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

      // Difference in time: If event more than 24hrs in advance, could be moved
      const hoursDifference = (etdDate - currentTime) / (1000 * 60 * 60);
      if (hoursDifference >= 24 || etdDate < currentTime) {
        // want to organize so 
        const recommendation = {
          tailNumber: plane.acid,
          status: "Parked",
          nextEvent: formattedDate,
          recString: `${underCapacity}`+`${close}` + `${closestAirport}`
          //`${longTerm}` // Example recommendation string
        };
        console.log(plane);

        recommendations.push(recommendation);
      }
      
    });
  } else {
    // Return a single reccomendation if none are parked 
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

// Get the distance range for running query for close airports 
const generateDistance = (currentAirport) => {
  const maxDistance = 50; // Distance KM
  // Approximate range
  const rangeLat = maxDistance / 111; // 1 deg lat apporox 111KM
  const rangeLon = maxDistance / (111 * Math.cos(currentAirport.lat * Math.PI / 180)); 
  // +/- this distance for query to get airports winin a 100km range 

  return [rangeLat, rangeLon];
};

// Haversine Distance Formula
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth Radius KM
  const toRad = (deg) => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}


// Finding the closest airport sorting closest to farthest 
const sortAirports = (airports, currLat, currLon) => {
  return airports
  .map(airport => ({
      ...airport,
      distance: haversineDistance(currLat, currLon, airport.lat, airport.lon)
  }))
  .sort((a, b) => a.distance - b.distance);
};




// Main map page 
// generate strings that say no airports are at capacity
