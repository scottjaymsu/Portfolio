export const getStatusColor  = (parking_taken, total_parking) => {
  const status = parking_taken / total_parking;
  if (status == 1) {
    // Red - overcapacity
    return "#c76666";
  } else if (status >= 0.8) {
    // Orange - approaching capacity
    return "#ecac57";
  } else {
    // Green - open
    return "#b9be80";
  }
};

// Get CSS styling class for the status bubble
export const getStatusClass = (parking_taken, total_parking) => {
  const status = parking_taken / total_parking;
  if (status == 1) {
    return "status-bubble full";
  } else if (status >= 0.8) {
    return "status-bubble approaching";
  } else {
    return "status-bubble open";
  }
};
