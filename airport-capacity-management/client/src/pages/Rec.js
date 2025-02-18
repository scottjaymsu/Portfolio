// Reccomendations Starter


// Determine current status of airplanes at airport
// Assuming we take in a data like
const DetermineStatus = (props) => {
    const Parked = [];

    for (let i = 0; i < props.length; i++) {
        // if status is parked add to Parked
        
    }
    // Return all parked planes 
    return Parked
}

// Get the closest airport to the current airport
const GetClosestAirport = (props) => {
    // Get all airports
    const Airports = [];
    for (let i = 0; i < props.length; i++) {
        // if airport is closest add to Airports
    }
    // Return closest airport
    return Airports[0];
}

// Check if other FBO at same airport has space
const CheckOtherFBO = (props) => {
    // Get all FBOs at same airport
    const FBOs = [];
    for (let i = 0; i < props.length; i++) {
        // if FBO has space add to FBOs
        // if spots filled < capcity 
    }
    // Return all FBOs with space
    return FBOs;
}


// The actal string that goes in the dropdown for the specific plane
// So return tailNumber, status, nextEvent, details: "the string generated in this function"
const GenerateRecString = (planes) => {
    // Generate string of recommendations
    let rec = "Recommendations: ";
    for (let i = 0; i < planes.length; i++) {
        // if space available at other FBO
        // if should be moved to long term parking

        // POTENTIAL STRINGS 
        // Plane {tailNumber} can be relocated to {FBO}
        // Plane {tailNumber} can be moved to long term parking
        // Plane {tailNumber} can be moved to {closestAirport}
    }
    return rec;
} 

// Full by x time —- for rec
// make this calculation 

// manually add if in mx
// manually add if long term parking
// manually add what fbo its at?