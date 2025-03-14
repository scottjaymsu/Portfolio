export const getStatusColor = (status) => {
    switch (status) {
      case "Overcapacity":
        // Red
        return "#c76666";
      case "Reaching Capacity":
        // Orange
        return "#ecac57";
      case "Undercapacity":
        // Green
        return "#b9be80";
      default:
        return "#b9be80";
    }
  };

// Get CSS styling class for the status bubble
export const getStatusClass = (parking_taken, total_parking) => {
  const status = parking_taken / total_parking;
  if (status == 1) {
    return "status-bubble full";
  } else if (status >= 0.80) {
    return "status-bubble approaching";
  } else {
    return "status-bubble open";
  }
};