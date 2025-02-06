import React, { useEffect, useRef } from 'react';
import './map.css'; 

// Center of the U.S. Position
const ORIGINAL_CENTER = { lat: 39.8283, lng: -98.5795 }; 
// Original Zoom Position
const ORIGINAL_ZOOM = 5;

const MapComponent = () => {
    // Store the map instance
    const mapRef = useRef(null); 
    // For the search box
    const searchBoxRef = useRef(null); 

    useEffect(() => {
        const initializeMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            // Centering on the US
            center: ORIGINAL_CENTER,
            zoom: ORIGINAL_ZOOM,
            mapId: 'cbef200dfd600c27',
            // Disable the Map/Satellite toggle
            mapTypeControl: false,
            // Disable Street View 
            streetViewControl: false
        });

        // Markers for our main 12 airports
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

        // Add markers to the map
        markers.forEach((markerData) => {
            const marker = new window.google.maps.Marker({
                // Customization of markers 
                // Change in the future for capacity status 
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
            
            // Starter for info window that opens for more airport info when clicking
            const infoWindow = new window.google.maps.InfoWindow({
                content: `<h3>${markerData.title}</h3>`,
            });

            
            // ✅ Click event to zoom and center the map
            marker.addListener('click', () => {
                map.setZoom(15); // Adjust zoom level (higher = more zoomed-in)
                map.setCenter(marker.getPosition()); // Center the map on the marker
                infoWindow.open(map, marker); // Info window
            });

            // Autocomplete search at top 
            const input = document.getElementById('map-search');
            const autocomplete = new window.google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry || !place.geometry.location) {
                    alert("No details for specified location");
                    return;
                }

                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                }
                else {
                    // Zooming into the searched location
                    map.setCenter(place.geometry.location);
                    map.setZoom(12); 
                }
            });
        });

        // Store the current starter map the React reference 
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
            <input
                id="map-search"
                type="text"
                placeholder="Search for a location..."
                ref={searchBoxRef}
            />

            <button
                id="back-button"
                
                onClick={() => {
                    if (mapRef.current) {
                    // Reset center 
                    mapRef.current.setCenter(ORIGINAL_CENTER);  
                    // Reset zoom
                    mapRef.current.setZoom(ORIGINAL_ZOOM);      
                    }
                }}
                >
                ⬅ Back
            </button>

            {/* 🗺️ Map */}
            <div id="map"></div>
        </div>
    );
    };

    export default MapComponent;
