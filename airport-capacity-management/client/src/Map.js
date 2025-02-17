import React, { useState } from "react";
import MapContainer from "./components/MapContainer";
import Sidebar from "./components/SideBar";
import NotificationCenter from "./components/NotificationCenter";
import { useNavigate } from "react-router-dom";

// Center of the U.S. Position
const ORIGINAL_CENTER = { lat: 39.8283, lng: -98.5795 };

// Original Zoom Position
const ORIGINAL_ZOOM = 5;

// Markers for our main 10 airports
// Hard Code Change Later when connect to backend
const markers = [
  {
    position: { lat: 40.8583, lng: -74.0615 },
    title: "KTEB",
    status: "Overcapacity",
  },
  {
    position: { lat: 41.0683, lng: -73.7087 },
    title: "KHPN",
    status: "Overcapacity",
  },
  {
    position: { lat: 26.6857, lng: -80.0928 },
    title: "KPBI",
    status: "Reaching Capacity",
  },
  {
    position: { lat: 36.0831, lng: -115.1482 },
    title: "KLAS",
    status: "Overcapacity",
  },
  {
    position: { lat: 42.3656, lng: -71.0096 },
    title: "KBOS",
    status: "Undercapacity",
  },
  {
    position: { lat: 43.6088, lng: -110.7376 },
    title: "KJAC",
    status: "Undercapacity",
  },
  {
    position: { lat: 41.7868, lng: -87.7522 },
    title: "KMDW",
    status: "Overcapacity",
  },
  {
    position: { lat: 33.6204, lng: -111.9153 },
    title: "KSDL",
    status: "Reaching Capacity",
  },
  {
    position: { lat: 32.8438, lng: -96.8485 },
    title: "KDAL",
    status: "Overcapacity",
  },
  {
    position: { lat: 39.6423, lng: -106.917 },
    title: "KEGE",
    status: "Undercapacity",
  },
];

const MapComponent = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  // State for map reference
  const [mapInstance, setMapInstance] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Filter locations based on search input
  const filteredLocations = markers.filter((loc) =>
    loc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetMap = () => {
    if (mapInstance) {
      mapInstance.setCenter(ORIGINAL_CENTER);
      mapInstance.setZoom(ORIGINAL_ZOOM);
    }
  };

  //
  // TODO: When the map is switched to a single implementation, this zoom location should be the off center
  // location of the airport. 
  //
  const handleLocationClick = (location) => {
    if (mapInstance) {
      mapInstance.setCenter(location.position);
      mapInstance.setZoom(12);
    }
    // Navigate to the summary page for this airport/location
    navigate(`/summary/${location.title}`);
  };

  return (
    <div>
      <NotificationCenter
        notifications={[
          "KTEB is Overcapacity! Check recommendations to provide room for incoming aircraft.",
          "KHPN is Overcapacity! Check recommendations to provide room for incoming aircraft.",
          "KLAS is Overcapacity! Check recommendations to provide room for incoming aircraft.",
          "KMDW is Overcapacity! Check recommendations to provide room for incoming aircraft.",
          "KDAL is Overcapacity! Check recommendations to provide room for incoming aircraft.",
          "KBPI is reaching capacity. On 3/3/2025, KBPI will be over capacity and action will be needed.",
          "KSDL is reaching capacity. On 3/7/2025, KSDL will be over capacity and action will be needed.",
        ]}
        visible={notificationVisible}
        toggleVisibility={() => setNotificationVisible(!notificationVisible)}
      />

      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        locations={filteredLocations}
        onLocationClick={handleLocationClick}
        resetMap={resetMap}
        visible={sidebarVisible}
        toggleVisibility={() => setSidebarVisible(!sidebarVisible)}
      />

      <MapContainer markers={markers} setMapInstance={setMapInstance} />
    </div>
  );
};

export default MapComponent;
