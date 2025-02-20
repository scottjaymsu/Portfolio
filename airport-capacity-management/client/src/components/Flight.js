import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Flight data class
 * States hold departing and arriving flights info
 * @param id - faa designator of airport
 * @returns component 
 */
export default function Flight({id}) {
    // Ref to check if component is mounted
    const mounted = React.useRef(false);

    // State to hold arriving flights
    const [arrivingFlights, setArrivingFlights] = useState([]);
    // State to hold error message
    const [error, setError] = useState('');

    // Fetch departing flights by airport when component mounts
    useEffect(() => {
        // Fetch departing flights by airport
        axios.get(`http://localhost:5000/flightData/getDepartingFlights/${id}`)
            .then((response) => {
                setDepartingFlights(response.data);
            })
            .catch((err) => {
                setError('Error fetching departing flights');
                console.error('Error fetching departing flights:', err);
            });
    }, [id]);

    // Fetch arriving flights by airport when component mounts
    useEffect(() => {
        // Fetch arriving flights by airport
        axios.get(`http://localhost:5000/flightData/getArrivingFlights/${id}`)
            .then((response) => {
                setArrivingFlights(response.data);
            })
            .catch((err) => {
                setError('Error fetching arriving flights');
                console.error('Error fetching arriving flights:', err);
            });
    }, [id]);

    return (
        <div>
            <h1>Flights at {id}</h1>
            <h2>Departing Flights</h2>
            <ul>
                {departingFlights.map((flight) => (
                    <li key={flight.acid}>{flight.acid} - {flight.etd}</li>
                ))}
            </ul>
            <h2>Arriving Flights</h2>
            <ul>
                {arrivingFlights.map((flight) => (
                    <li key={flight.acid}>{flight.acid} - {flight.eta}</li>
                ))}
            </ul>
            {error && <p>{error}</p>}
        </div>
    );