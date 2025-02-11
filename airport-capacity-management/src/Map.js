import React, { useEffect, useRef, useState } from 'react';
import './map.css';

// Center of the U.S. Position
const ORIGINAL_CENTER = { lat: 39.8283, lng: -98.5795 };
// Original Zoom Position
const ORIGINAL_ZOOM = 5;

// For making the notification center at right
// collapse and uncollapse
function toggleNotification() {
    let notificationCenter = document.getElementById("notification-center");

    if (notificationCenter.classList.contains("visible")) {
        notificationCenter.classList.remove("visible");
    } 
    else {
        notificationCenter.classList.add("visible");
    }
}

// For the Search at the left 
// Expand and collapse the window 
function toggleSearch() {
    let sideBar = document.getElementById("side-bar");
    let locationList = document.getElementById("location-list");
   
    if(sideBar.classList.contains("visible")) {
        sideBar.classList.remove("visible")
        locationList.classList.remove("visible");
    }
    else {
        sideBar.classList.add("visible");
        locationList.classList.add("visible"); 
    }
}

// Change color of status icon 
// For locations under search 
const getStatusColor = (status) => {
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

// Markers for our main 10 airports
// Hard Code Change Later when connect to backend 
const markers = [
    { position: { lat: 40.8583, lng: -74.0615 }, title: 'KTEB' },
    { position: { lat: 41.0683, lng: -73.7087 }, title: 'KHPN' },
    { position: { lat: 26.6857, lng: -80.0928 }, title: 'KPBI' },
    { position: { lat: 36.0831, lng: -115.1482 }, title: 'KLAS' },
    { position: { lat: 42.3656, lng: -71.0096 }, title: 'KBOS' },
    { position: { lat: 43.6088, lng: -110.7376 }, title: 'KJAC' },
    { position: { lat: 41.7868, lng: -87.7522 }, title: 'KMDW' },
    { position: { lat: 33.6204, lng: -111.9153 }, title: 'KSDL' },
    { position: { lat: 32.8438, lng: -96.8485 }, title: 'KDAL' },
    { position: { lat: 39.6423, lng: -106.9170 }, title: 'KEGE' },
];

// Temp status for airports 
const tempStatus = [
    "Overcapacity",
    "Overcapacity",
    "Reaching Capacity",
    "Overcapacity",
    "Undercapacity",
    "Undercapacity",
    "Overcapacity",
    "Reaching Capacity",
    "Overcapacity",
    "Undercapacity"
];

const MapComponent = () => {
    // Store the map instance
    const mapRef = useRef(null);
    // State for search input
    const [searchTerm, setSearchTerm] = useState("");


    // Filter locations based on search input
    const filteredLocations = markers.filter((loc) =>
        loc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle clicking a location from the list
    const handleLocationClick = (location) => {
        if (mapRef.current) {
            mapRef.current.setCenter(location.position);
            mapRef.current.setZoom(12);
        }
    };
    


    useEffect(() => {
        const initializeMap = () => {
            if (!window.google || !window.google.maps) return;

            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: ORIGINAL_CENTER,
                zoom: ORIGINAL_ZOOM,
                mapId: 'cbef200dfd600c27',
                mapTypeControl: false,
                streetViewControl: false
            });

            markers.forEach((markerData) => {
                const marker = new window.google.maps.Marker({
                    position: markerData.position,
                    map: map,
                    title: markerData.title,
                    icon: {
                        path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                        fillColor: '#B9BE80',
                        fillOpacity: 1,
                        strokeColor: '#B9BE80',
                        strokeWeight: 2,
                        scale: 8,
                    },
                    animation: window.google.maps.Animation.DROP,
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<h3>${markerData.title}</h3>`,
                });

                marker.addListener('click', () => {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                    infoWindow.open(map, marker);
                });
            });

            mapRef.current = map;
        };

        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.body.appendChild(script);
        }

        
    }, []);

    return (
        <div>
                
            <div id="notification-center">
                <button id="notif-toggle" onClick={toggleNotification}>Notif</button>
                <div id="notif-list">
                    <i className="notif-wrapper">
                        KTEB is Overcapacity! Check Reccomendations to provide room for incoming aircraft.
                    </i>
                    <i className="notif-wrapper">
                        KHPN is Overcapacity! Check Reccomendations to provide room for incoming aircraft.
                    </i>
                    <i className="notif-wrapper">
                        KLAS is Overcapacity Check Reccomendations to provide room for incoming aircraft.
                    </i>
                    <i className="notif-wrapper">
                        KMDW is Overcapacity! Check Reccomendations to provide room for incoming aircraft.
                    </i>
                    <i className="notif-wrapper">
                        KDAL is Overcapacity! Check Reccomendations to provide room for incoming aircraft.
                    </i>
                    <i className="notif-wrapper">
                        KBPI is reaching capacity. On 3/3/2025 KBPI will be over capacity and action will be needed. 
                    </i>
                    <i className="notif-wrapper">
                        KSDL is reaching capacity. On 3/7/2025 KSDL will be over capacity and action will be needed.
                    </i>
    
                </div>
                
            </div>
         
            <div id="side-bar">
                <div id="search-container">
                    <button id="collapse-button" onClick={toggleSearch}>^</button>
                    <button
                        id="back-button"
                        onClick={() => {
                            if (mapRef.current) {
                                mapRef.current.setCenter(ORIGINAL_CENTER);
                                mapRef.current.setZoom(ORIGINAL_ZOOM);
                            }
                        }}
                    >
                        Zoom
                    </button>
                    <input
                        id = "map-search"
                        type="text"
                        placeholder="Search for an airport..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                </div>
                
                <ul id="location-list">
                    {filteredLocations.map((loc, index) => (
                        <li className="list-ele" key={loc.title} onClick={() => handleLocationClick(loc)}>
                            {loc.title}
                            <div className="status-icon"
                            style={{backgroundColor: getStatusColor(tempStatus[index])}}
                            >{tempStatus[index]}</div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Map */}
            <div id="map"></div>
        </div>
    );
};




export default MapComponent;
