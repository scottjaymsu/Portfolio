import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { Card, CardContent } from "./components/card";
import { getStatusClass, getStatusColor } from "./utils/helpers";

import "./SummaryPage.css";
import "../src/styles/Scrollable.css";
import "./components/ArrivingFlightTable";
import ArrivingFlightTable from "./components/ArrivingFlightTable";
import DepartingFlightTable from "./components/DepartingFlightTable";
import TrafficOverview from "./components/TrafficOverview";

// Map Size
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// Google Map styling options
const mapOptions = {
  mapTypeId: "satellite",
  zoomControl: true,
  mapTypeControl: false,
  // Hide non relevant map features
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

// Custom Overlay for parking lot labels to display on the map
function CustomOverlay({ map, position, text }) {
  const divRef = React.useRef();

  React.useEffect(() => {
    if (map && divRef.current) {
      const overlayView = new window.google.maps.OverlayView();

      overlayView.onAdd = function () {
        const panes = overlayView.getPanes();
        panes.floatPane.appendChild(divRef.current);
      };

      overlayView.onRemove = function () {
        if (divRef.current.parentElement) {
          divRef.current.parentElement.removeChild(divRef.current);
        }
      };

      overlayView.draw = function () {
        const projection = overlayView.getProjection();
        const positionLatLng = new window.google.maps.LatLng(
          position.lat,
          position.lng
        );
        const positionPixels = projection.fromLatLngToDivPixel(positionLatLng);
        const div = divRef.current;

        if (div) {
          div.style.position = "absolute";
          div.style.left = `${positionPixels.x - div.offsetWidth / 2}px`;
          div.style.top = `${positionPixels.y - div.offsetHeight / 2}px`;
        }
      };

      overlayView.setMap(map);

      return () => {
        if (divRef.current) {
          overlayView.setMap(null);
        }

      };
    }
  }, [map, position]);

  return (
    <div
      ref={divRef}
      style={{
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "12px",
        whiteSpace: "nowrap",
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
}

// Calculate total space for the airport 
function calculateTotalSpace(fboData) {
  return fboData.reduce((acc, fbo) => {
    return acc + fbo.total_parking;
  }, 0);
}

// Calculate taken space for the airport
function calculateTakenSpace(fboData) {
  return fboData.reduce((acc, fbo) => {
    return acc + fbo.parking_taken;
  }, 0);
}

// Summary Page Component
export default function SummaryPage() {
  const airportCode = useParams().location;
  const [map, setMap] = React.useState(null);
  const [parkingLots, setParkingLots] = useState([]);
  const [airportCoordinates, setAirportCoordinates] = useState({
    lat: 40.84,
    lng: -74.07,
  });

  const [airportMetadata, setAirportMetadata] = useState([]);
  const [FBOList, setFBOList] = useState([]);
  const [currentPopulation, setCurrentPopulation] = useState(0);
  const [overallCapacity, setOverallCapacity] = useState(0);

  const navigate = useNavigate();


  useEffect(() => {
    console.log(airportCode);

    // Fetch FBO data and coordinates for map overlay and FBO list
    async function fetchParkingCoordinates() {
      try {
        const response = await fetch(
          `http://localhost:5001/airports/getParkingCoordinates/${airportCode}`
        );
        const data = await response.json();
        console.log("Parking Coordinates:", data);
        const parkingLots = data.map((lot) => {
          const coordinates = lot.coordinates[0].map((coord) => ({
            lat: coord.x,
            lng: coord.y,
          }));
          return {
            name: lot.FBO_Name,
            coordinates: coordinates,
            color: getStatusColor(lot.spots_taken,lot.Total_Space),
            labelPosition: coordinates[0],
          };
        });
        const FBOs = data.map((lot) => {
          return {
            name: lot.FBO_Name,
            parking_taken: lot.spots_taken,
            total_parking: lot.Total_Space,
            priority: lot.priority || 1, // Default priority to 1 if not provided
          };
        });
        setFBOList(FBOs);

        setParkingLots(parkingLots);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    }

    //Fetch the lat long coordinates of each airport
    async function fetchAirportData() {
      try {
        const response = await fetch(
          `http://localhost:5001/airports/getAirportData/${airportCode}`
        );
        const data = await response.json();
        const { latitude_deg, longitude_deg } = data[0];
        const lat = parseFloat(latitude_deg);
        const long = parseFloat(longitude_deg);
        setAirportCoordinates({
          lat: lat,
          lng: long - 0.011,
        });
        setAirportMetadata(data[0]);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    }

    async function fetchAirportStatus() {
      try {
        // number of planes currently at the airport
        const currentResponse = await fetch(
          `http://localhost:5001/airportData/getParkedPlanes/${airportCode}`
        );
        const currentData = await currentResponse.json();
        const currentPopulation = currentData.length;
        setCurrentPopulation(currentPopulation);
        console.log("Current Population:", currentPopulation);

        // overall capacity of the airport
        const overallResponse = await fetch(
          `http://localhost:5001/airportData/getOverallCapacity/${airportCode}`
        );
        const overallData = await overallResponse.json();
        const overallCapacity = overallData.totalCapacity; 
        setOverallCapacity(overallCapacity);
        console.log("Overall Capacity:", overallCapacity);

      } catch (error) {
        console.error("Error fetching airport capacity data:", error);
      }
    }

    fetchAirportStatus();
    fetchParkingCoordinates();
    fetchAirportData();

  }, [airportCode]);


  //
  // Navigation Handlers
  // 

  // This function handles the navigation to the simulator page when the "see more" button is clicked
  const handleSeeMore = () => {
    navigate(`/simulator/${airportCode}`);
  };

  // This function handles the navigation back to the home page when the back button is clicked
  const handleBack = () => {
    navigate("/");
  }


  const handlePriorityChange = (index, newPriority) => {
    setFBOList((prevFBOs) => {
      // copy of the FBO list
      const updatedFBOs = [...prevFBOs];
      updatedFBOs[index] = {
        ...updatedFBOs[index],
        priority: newPriority,
      };
      return updatedFBOs;
    });
  };

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={airportCoordinates}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {/* Draws the FBO outlines on the map */}
        {parkingLots.map((lot, index) => (
          <Polygon
            key={index}
            path={lot.coordinates}
            options={{
              fillColor: lot.color,
              fillOpacity: 0.5,
              strokeColor: lot.color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        ))}
        {parkingLots.map((lot, index) => (
          <CustomOverlay
            key={`overlay-${index}`}
            map={map}
            position={lot.labelPosition}
            text={lot.name}
          />
        ))}
      </GoogleMap>

      <div className="info-card scrollable-content">
        <img onClick={handleBack} className="back-button" src="/back-arrow.png" alt="Back Button"></img>
        <Card className="card-content">
          <CardContent className="text-center flex-1">
            <h2 className="title">{airportCode} - {airportMetadata.name}</h2>
            <p className={`status-bubble ${getStatusClass(currentPopulation, overallCapacity)}`}>{currentPopulation}/{overallCapacity}</p>
          </CardContent>
        </Card>
        <Card className="card-content flex-2">

          <div style={{ textAlign: 'center', top: 0 }}>
            <h2>Traffic Overview</h2>
          </div>
          <TrafficOverview id={airportCode} />
        </Card>
        <Card className="card-content flex-3">
          <CardContent>
            <ArrivingFlightTable id={airportCode} />
          </CardContent>
        </Card>
        <Card className="card-content flex-3">
          <CardContent>
            <DepartingFlightTable id={airportCode} />
          </CardContent>
        </Card>
        <Card className="card-content flex-3">
          <CardContent>
            <table className="info-table">
              <caption className="subtitle">FBOs</caption>
              <thead>
                <tr>
                  <th>FBO</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {FBOList.map((fbo, index) => (
                  <tr key={index}>
                    <td>{fbo.name}</td>
                    <td>
                      <span className={getStatusClass(fbo.parking_taken, fbo.total_parking)}>
                        {fbo.parking_taken}/{fbo.total_parking}
                      </span>
                    </td>
                    <td>
                      <select
                        value={fbo.priority}
                        onChange={(e) => handlePriorityChange(index, e.target.value)}
                      >
                        {Array.from({ length: FBOList.length }, (j, i) => i + 1).map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <button className="see-more flex-1" onClick={handleSeeMore}>see more</button>
      </div>
    </div>
  );
}
