import React from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { Card, CardContent } from "./components/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getStatusClass } from "./utils/helpers";

import "./SummaryPage.css";

// Map Size
const containerStyle = {
  width: "100vw",
  height: "100vh",
};

// Map Center
const center = {
  lat: 40.8485,
  lng: -74.0715,
};

// Parking Lot Coordinates
const parkingLots = [
  {
    name: "Signature East",
    coordinates: [
      { lat: 40.85406, lng: -74.05682 },
      { lat: 40.85633, lng: -74.05341 },
      { lat: 40.8562, lng: -74.05326 },
      { lat: 40.85565, lng: -74.05363 },
      { lat: 40.85551, lng: -74.05321 },
      { lat: 40.85299, lng: -74.05485 },
      { lat: 40.85344, lng: -74.05628 },
    ],
    color: "#B9BE80",
    labelPosition: { lat: 40.8545, lng: -74.0555 },
  },
  {
    name: "Signature West",
    coordinates: [
      { lat: 40.85045, lng: -74.06971 },
      { lat: 40.85394, lng: -74.06631 },
      { lat: 40.85281, lng: -74.06431 },
      { lat: 40.84959, lng: -74.06871 },
    ],
    color: "#C76666",
    labelPosition: { lat: 40.85192, lng: -74.0672 },
  },
  {
    name: "Signature South",
    coordinates: [
      { lat: 40.84382, lng: -74.06566 },
      { lat: 40.84603, lng: -74.06866 },
      { lat: 40.8477, lng: -74.06602 },
      { lat: 40.84631, lng: -74.06448 },
      { lat: 40.846, lng: -74.06495 },
      { lat: 40.84548, lng: -74.06448 },
    ],
    color: "#C76666",
    labelPosition: { lat: 40.84594, lng: -74.06635 },
  },
  {
    name: "Jet",
    coordinates: [
      { lat: 40.84301, lng: -74.06491 },
      { lat: 40.84086, lng: -74.06651 },
      { lat: 40.84065, lng: -74.06305 },
      { lat: 40.84146, lng: -74.06254 },
      { lat: 40.84294, lng: -74.06211 },
    ],
    color: "#B9BE80",
    labelPosition: { lat: 40.84177, lng: -74.06397 },
  },
  {
    name: "Atlantic",
    coordinates: [
      { lat: 40.85418, lng: -74.06611 },
      { lat: 40.8584, lng: -74.06184 },
      { lat: 40.8577, lng: -74.0608 },
      { lat: 40.85495, lng: -74.06109 },
      { lat: 40.8529, lng: -74.06407 },
    ],
    color: "#B9BE80",
    labelPosition: { lat: 40.85590, lng: -74.06270 },
  },
];

// Flight Data in the table
const flightData = [
  {
    cabinSize: "Large",
    tail: "N246QS",
    type: "CL-650S",
    arrivalDay: "1/29",
    arrivalTime: "12:29 pm",
    eventDay: "1/29",
    eventTime: "9:00 pm",
  },
  {
    cabinSize: "Large",
    tail: "N22QS",
    type: "CL-650S",
    arrivalDay: "1/29",
    arrivalTime: "2:30 pm",
    eventDay: "1/30",
    eventTime: "11:00 am",
  },
  {
    cabinSize: "Large",
    tail: "N289QS",
    type: "CL-650S",
    arrivalDay: "1/29",
    arrivalTime: "4:01 pm",
    eventDay: "1/30",
    eventTime: "12:35 pm",
  },
  {
    cabinSize: "Small",
    tail: "N25QS",
    type: "CL-650S",
    arrivalDay: "1/29",
    arrivalTime: "4:20 pm",
    eventDay: "2/5",
    eventTime: "9:00 am",
  },
  {
    cabinSize: "Medium",
    tail: "N245QS",
    type: "CL-650S",
    arrivalDay: "1/29",
    arrivalTime: "4:56 pm",
    eventDay: "1/30",
    eventTime: "9:30 pm",
  },
];

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

// Data in the bar chart
const chartData = [
  { name: "12:00", Arriving: 2, Departing: 1, Parked: 3, "In MX": 4 },
  { name: "1:00", Arriving: 3, Departing: 1, Parked: 4, "In MX": 1 },
  { name: "2:00", Arriving: 4, Departing: 2, Parked: 5, "In MX": 2 },
  { name: "3:00", Arriving: 3, Departing: 1, Parked: 4, "In MX": 3 },
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
        overlayView.setMap(null);
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
  const [map, setMap] = React.useState(null);

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={mapOptions}
          center={center}
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
      </LoadScript>

      <div className="info-card">
        <Card className="card-content">
          <CardContent className="text-center flex-1">
            <h2 className="title">KTEB - Teterboro Airport</h2>
            <p className={getStatusClass("Overcapacity")}>Overcapacity</p>
          </CardContent>
        </Card>
        <Card className="card-content flex-2">
          <CardContent>
            <h3 className="subtitle">Traffic Overview</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Arriving" fill="rgb(88,120,163)" />
                <Bar dataKey="Departing" fill="rgb(228,147,67)" />
                <Bar dataKey="Parked" fill="rgb(133,181,178)" />
                <Bar dataKey="In MX" fill="rgb(209,96,94)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="card-content flex-3">
          <CardContent>
            <h3 className="subtitle">Incoming Flights</h3>
            <table className="info-table">
              <thead>
                <tr>
                  <th>Cabin Size</th>
                  <th>Tail #</th>
                  <th>Type</th>
                  <th colSpan="2">Arrival</th>
                  <th colSpan="2">Next Event</th>
                </tr>
              </thead>
              <tbody>
                {flightData.map((flight, index) => (
                  <tr key={index}>
                    <td>{flight.cabinSize}</td>
                    <td>{flight.tail}</td>
                    <td>{flight.type}</td>
                    <td>{flight.arrivalDay}</td>
                    <td>{flight.arrivalTime}</td>
                    <td>{flight.eventDay}</td>
                    <td>{flight.eventTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        <button className="see-more flex-1">see more</button>
      </div>
    </div>
  );
}
