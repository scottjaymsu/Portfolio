const db = require('../models/db');


// Get FBOs from airport_parking table and their capacities 
exports.getAirportFBOs = (req, res) => {
    const { airportCode } = req.params;
    const query = 'SELECT Airport_Code, FBO_Name, Parking_Space_Taken, Total_Space FROM airport_parking WHERE Airport_Code = ?';
  
    db.query(query, [airportCode], (err, results) => {
      if (err) {
        console.error('Error fetching airport FBOs:', err);
        res.status(500).send('Error fetching airport FBOs');
        return;
      }
    //   console.log('Query results:', results); 
      res.json(results);
    });
  };

// Get NetJets fleet from netjets_fleet table
exports.getNetjetsFleet = (req, res) => {
    const sizeMapping = {
        'E55P': 'Light',
        'C56X': 'Mid-Size',
        'C680': 'Mid-Size',
        'C68A': 'Mid-Size',
        'C700': 'Super Mid-Size',
        'CL35': 'Super Mid-Size',
        'CL60': 'Large',
        'GL5T': 'Long Range Large Jet',
        'GLEX': 'Long Range Large Jet',
        'GL7T': 'Long Range Large Jet'
    }
    const spotsMapping = {
        'E55P': 1,
        'C56X': 1,
        'C680': 1,
        'C68A': 1,
        'C700': 1,
        'CL35': 1,
        'CL60': 2,
        'GL5T': 2,
        'GLEX': 2,
        'GL7T': 2
    };

    // May make in future only airplanes not involved with the selected airport
    // selecting the tail number, type of plane, and curr location calculation
    const query = `
        SELECT netjets_fleet.acid, netjets_fleet.plane_type,
        CASE
            WHEN flight_plans.departed = TRUE AND flight_plans.arrived = TRUE THEN flight_plans.arrival_airport
            WHEN flight_plans.departed = TRUE AND flight_plans.arrived = FALSE THEN 'In Flight'
            WHEN flight_plans.departed = FALSE AND flight_plans.arrived = FALSE THEN flight_plans.departing_airport
            ELSE 'Unknown'
        END AS current_location
        FROM netjets_fleet
        LEFT JOIN flight_plans on netjets_fleet.flightRef = flight_plans.flightRef
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching NetJets fleet:', err);
            res.status(500).send('Error fetching NetJets fleet');
            return;
        }

        const fleetWithSize = results.map(plane => ({
            ...plane, 
            size: sizeMapping[plane.plane_type] || 'Unknown',
            numberSpots: spotsMapping[plane.plane_type] || 1
        }));
        // console.log('Netjets Fleet results:', results); // Debugging statement

        res.json(fleetWithSize);
    });
};




exports.getAllPlanes = async (req, res) => {
    const { airportCode } = req.params;

    try {
        // 1, 1 
        const parkedPlanes = await new Promise((resolve, reject) => {
            const query = `
                SELECT flight_plans.acid, flight_plans.eta AS event, netjets_fleet.plane_type, 'Parked' AS status
                FROM flight_plans 
                JOIN netjets_fleet ON flight_plans.acid = netjets_fleet.acid 
                WHERE flight_plans.arrival_airport = ? AND flight_plans.arrived = TRUE AND flight_plans.departed = TRUE
            `;
            db.query(query, [airportCode], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        // 1, null (departing)
        const departingPlanes = await new Promise((resolve, reject) => {
            const query = `
                SELECT flight_plans.acid, flight_plans.eta AS event, netjets_fleet.plane_type, 'Departing' AS status
                FROM flight_plans 
                JOIN netjets_fleet ON flight_plans.acid = netjets_fleet.acid
                WHERE flight_plans.departing_airport = ? 
                AND flight_plans.departed = TRUE
                AND flight_plans.arrived = FALSE
            `;
            db.query(query, [airportCode], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        
        // 1, null arriving
        const arrivingPlanes = await new Promise((resolve, reject) => {
            const query = `
                SELECT flight_plans.acid, flight_plans.eta as event, netjets_fleet.plane_type, 'Arriving' AS status
                FROM flight_plans 
                JOIN netjets_fleet ON flight_plans.acid = netjets_fleet.acid
                WHERE flight_plans.arrival_airport = ? 
                AND flight_plans.departed = TRUE
                AND flight_plans.arrived = FALSE
            `;
            db.query(query, [airportCode], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // 0, null planned parked 
        const plannedPlanes = await new Promise((resolve, reject) => {
            const query = `
                SELECT flight_plans.acid, flight_plans.etd AS event, netjets_fleet.plane_type, 'Parked' AS status
                FROM flight_plans 
                JOIN netjets_fleet ON flight_plans.acid = netjets_fleet.acid
                WHERE flight_plans.departing_airport = ? AND flight_plans.departed = FALSE
            `;
            db.query(query, [airportCode], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        let allPlanes = [
            ...parkedPlanes,
            ...departingPlanes,
            ...arrivingPlanes,
            ...plannedPlanes
        ];

        // 
        allPlanes = allPlanes.sort((a, b) => new Date(a.event) - new Date(b.event));

        res.json(allPlanes);
    } catch (err) {
        console.error('Error fetching planes:', err);
        res.status(500).send('Error fetching planes');
    }
};

 
/**
 * Run querys for data used for reccomendations
 */
exports.getRecommendations = async (req, res) => {
    const { airportCode } = req.params;
    // The plane has completed its flight (1, 1) 
    const parkedQuery = 'SELECT flight_plans.acid, flight_plans.etd, flight_plans.eta FROM flight_plans WHERE flight_plans.arrival_airport = ? AND flight_plans.arrived = TRUE';
    const currentAirportCoordQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon FROM airport_data WHERE ident = ?';
    const allAirportCoordQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon, ident FROM airport_data WHERE ident != ?';

    // airports withing a certain range
    const closeAirportsQuery = 'SELECT latitude_deg AS lat, longitude_deg AS lon, ident FROM airport_data WHERE ident != ? AND latitude_deg BETWEEN (? - ?) AND (? + ?) AND longitude_deg BETWEEN (? - ?) AND (? + ?)';

    // Combine Parked at query with getting the current FBO - reccomend moving to different FBO
    try {
        const parkedPlanes = await new Promise((resolve, reject) => {
        db.query(parkedQuery, [airportCode], (err, results) => {
            if (err) {
            return reject(err);
            }
            resolve(results);
        });
        });

        // Get our airport coordinates
        const currentAirportCoord = await new Promise((resolve, reject) => {
        db.query(currentAirportCoordQuery, [airportCode], (err, results) => {
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
        db.query(closeAirportsQuery, [airportCode, currentAirportCoord.lat, rangeLat, currentAirportCoord.lat, rangeLat, currentAirportCoord.lon, rangeLon, currentAirportCoord.lon, rangeLon], (err, results) => {
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

        const sortedParkedPlanes = parkedPlanes.sort((a, b) => new Date(b.etd) - new Date(a.eta));
        const recommendations = generateRecommendations(sortedParkedPlanes, sortedAirports);

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
