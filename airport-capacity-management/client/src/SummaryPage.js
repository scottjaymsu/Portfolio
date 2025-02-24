import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { Card, CardContent } from "./components/card";
import { getStatusClass } from "./utils/helpers";

import "./SummaryPage.css";
import "./components/ArrivingFlightTable";
import ArrivingFlightTable from "./components/ArrivingFlightTable";
import DepartingFlightTable from "./components/DepartingFlightTable";
import TrafficOverview from "./components/TrafficOverview";

// Map Size
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// FBO Data in the table
const FBOList = [
  {
    name: "Signature Aviation - East",
    status: "Open",
  },
  {
    name: "Signature Aviation - West",
    status: "Full",
  },
  {
    name: "Signature Aviation - South",
    status: "Full",
  },
  {
    name: "Jet Aviation",
    status: "Open",
  },
  {
    name: "Atlantic Aviation",
    status: "Open",
  },
];

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

  const navigate = useNavigate();


  useEffect(() => {
    console.log(airportCode);
    //Fetch all the parking coordinates related to FBO's so that the map can overlay them for viewing
    async function fetchParkingCoordinates() {
      try {
        const response = await fetch(
          `http://localhost:5001/airports/getParkingCoordinates/${airportCode}`
        );
        const data = await response.json();
        console.log(data);
        const parkingLots = data.map((lot) => {
          const coordinates = lot.coordinates[0].map((coord) => ({
            lat: coord.x,
            lng: coord.y,
          }));
          return {
            name: lot.FBO_Name,
            coordinates: coordinates,
            color: "#B9BE80",
            labelPosition: coordinates[0],
          };
        });
        const FBOs = data.map((lot) => {
          return {
            name: lot.FBO_Name,
            status: "Open"
          };
        });
        setFBOList(FBOs);

        setParkingLots(parkingLots);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    }

    //Fetch the lat long coordinates of each airport, it doesn't center perfectly but I don't think that'll be an issue
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
          lng: long,
        });
        setAirportMetadata(data[0]);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    }

    fetchParkingCoordinates();
    fetchAirportData();

  }, [airportCode]);

  const handleSeeMore = () => {
    navigate(`/simulator/${airportCode}`);
  };

  const handleBack = () => {
    navigate("/");
  }


  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={airportCoordinates}
        zoom={15}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
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

      <div className="info-card">
        <img onClick={handleBack} className="back-button" src="/back-arrow.png" alt="Back Button"></img>
        <Card className="card-content">
          <CardContent className="text-center flex-1">
            <h2 className="title">{airportCode} - {airportMetadata.name}</h2>
            <p className={getStatusClass("Overcapacity")}>Overcapacity</p>
          </CardContent>
        </Card>
        <Card className="card-content flex-2">
          <TrafficOverview id = {airportCode} />
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
            <h3 className="subtitle">FBOs</h3>
            <table className="info-table">
              <thead>
                <tr>
                  <th>FBO</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {FBOList.map((fbo, index) => (
                  <tr key={index}>
                    <td>{fbo.name}</td>
                    <td>
                      <span className={getStatusClass(fbo.status)}>
                        {fbo.status}
                      </span>
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
