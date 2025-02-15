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
export const getStatusClass = (status) => {
  switch (status) {
    case "Open":
      return "status-bubble open";
    case "Full":
      return "status-bubble full";
    case "Overcapacity":
      return "status-bubble-lg full";
    default:
      return "status-bubble";
  }
};