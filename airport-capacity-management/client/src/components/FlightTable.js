import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/FlightTable.css';

/**
 * Flight table
 * States hold arriving or departing flights info
 * @param id - faa designator of airport that flights are arriving or departing from
 * @param flightType - type of flight (arriving or departing)
 * @returns component
 */
function FlightTable({ id, flightType }) {
    const timeInterval = 3000000; // 5 minutes - refresh interval
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');

    // Fetch arriving or departing flights based on the flightType
    const fetchFlights = useCallback(() => {
        const url = flightType === 'arriving' 
            ? `http://localhost:5001/flightData/getArrivingFlights/${id}`
            : `http://localhost:5001/flightData/getDepartingFlights/${id}`;

        axios.get(url)
            .then((response) => {
                console.log(`Fetched ${flightType} flights:`, response.data);
                // Format the date and time of the flights 
                const sortedFlights = response.data.sort((a, b) => new Date(a[flightType === 'arriving' ? 'eta' : 'etd']) - new Date(b[flightType === 'arriving' ? 'eta' : 'etd']));
                setFlights(sortedFlights);
            })
            .catch((err) => {
                setError(`Error fetching ${flightType} flights`);
                console.error(`Error fetching ${flightType} flights:`, err);
            });
    }, [id, flightType]);

    // Fetch arriving or departing flights when component mounts
    useEffect(() => {
        fetchFlights();

        // Refresh every interval of time
        const interval = setInterval(fetchFlights, timeInterval);

        return () => clearInterval(interval);
    }, [fetchFlights]);

    // Format the date to a more readable format
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return dateStr ? date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : "N/A";
    };

    // Format the time to a more readable format
    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return dateStr ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : "";
    };

    // Key for the date and time wording based on the flightType
    const dateTimeKey = flightType === 'arriving' ? 'eta' : 'etd';

    return (
        <div className='table-container'>
            <table>
                {/* Title based on flight type */}
                <caption>{flightType === 'arriving' ? 'Arriving Flights' : 'Departing Flights'}</caption>
                <thead>
                    <tr>
                        <th>Tail Number</th>
                        <th>Aircraft Type</th>
                        <th>Parking Area (ft²)</th>
                        <th>{flightType === 'arriving' ? 'Arrival' : 'Departure'} Date/Time</th>
                    </tr>
                </thead>

                <tbody className='flight-table-container'>
                    {flights.map((flight, index) => (
                        <tr key={index}>
                            <td>{flight.acid}</td>
                            <td>{flight.plane_type ? flight.plane_type : 'N/A'}</td>
                            <td>{flight.parkingArea ? flight.parkingArea : 'N/A'}</td>
                            <td>{formatDate(flight[dateTimeKey])} {formatTime(flight[dateTimeKey])}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FlightTable;
