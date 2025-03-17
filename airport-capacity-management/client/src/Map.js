import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import MapContainer from "./components/MapContainer";
import Sidebar from "./components/SideBar";
import NotificationCenter from "./components/NotificationCenter";
import { useNavigate } from "react-router-dom";
import './styles/Map.css';

// Center of the U.S. Position
const ORIGINAL_CENTER = { lat: 39.8283, lng: -98.5795 };

// Original Zoom Position
const ORIGINAL_ZOOM = 5;

const MapComponent = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  // State for map reference
  const [mapInstance, setMapInstance] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const [markers, setMarkers] = useState([]);
  const [smallMarkers, setSmallMarkers] = useState([]);

  const hasLoaded = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const getAirportMarkers = async() => {
      try {
        const [markersResponse, smallMarkersResponse] = await Promise.all([
          axios.get("http://localhost:5001/map/getAirportMarkers"),
          axios.get("http://localhost:5001/map/getSmallAirportMarkers")
        ]);

        setMarkers(markersResponse.data);
        setSmallMarkers(smallMarkersResponse.data);
      } catch (error) {
        console.error("Error fetching airport markers: ", error);
      }
    };
    getAirportMarkers();
  }, []);

  // Filter locations based on search input
  const filteredLocations = [...markers, ...smallMarkers].filter((loc) =>
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

  const handleAirportButton = () => {
    navigate(`/batch`);
  };


  return (
    <div>
      <NotificationCenter
        notifications={[
          "KBOS is reaching capacity, check recommendations to provide room for incoming aircraft.",
          "KBOS: Check recommendations to provide room for incoming aircraft.",
          "KEGE is Undercapacity.",
          "KTEB is Undercapacity.",


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
      <div>


      </div>
      <MapContainer markers={markers} smallMarkers={smallMarkers} setMapInstance={setMapInstance} />
      <button class="data-button" onClick={handleAirportButton}>Add Airports</button>

    </div>
  );
};

export default MapComponent;
