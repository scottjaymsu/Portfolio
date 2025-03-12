import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/FlightTable.css';

/**
 * Arriving flight table
 * States hold arriving flights info
 * @param id - faa designator of airport flights
 * flights are arriving to
 * @returns component 
 */
export default function ArrivingFlightTable({id}) {
    // INT for refresh
    const timeInterval = 3000000; // 5 minutes 
    // State to hold arriving flights
    const [arrivingFlights, setArrivingFlights] = useState([]);
    // State to hold error message
    const [error, setError] = useState('');

    const fetchArrivingFlights = useCallback (() => {
      // Fetch arriving flights by airport
      axios.get(`http://localhost:5001/flightData/getArrivingFlights/${id}`)
      .then((response) => {
          const sortedFlights = response.data.sort((a, b) => new Date(a.eta) - new Date(b.eta));
          setArrivingFlights(sortedFlights);
      })
      .catch((err) => {
          setError('Error fetching arriving flights');
          console.error('Error fetching arriving flights:', err);
      });
    }, [id]);

    // Fetch arriving flights by faa designator when component mounts
    useEffect(() => {
      fetchArrivingFlights();
      const interval = setInterval(fetchArrivingFlights, timeInterval);

      return () => clearInterval(interval); 
    }, [fetchArrivingFlights]);

    // Format the ETA date to a more readable format
    const formatDate = (eta) => {
      const date = new Date(eta);
      return eta ? date.toLocaleDateString('en-GB') : "N/A"; // format: day/month/year
    };

    // Format the ETA time to a more readable format
    const formatTime = (eta) => {
      const date = new Date(eta);
      return eta ? date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ""; // format: hour:minute
    };

    /**
     * Create table for arriving flights.
     * 
     * There are 4 columns {tail number,
     * aircraft type, parking area, 
     * arrival date/time}
     * 
     * There are n rows,
     * where n is the number of incoming flights.
     */    
 
    return (
    <div className = "table-container">
      <table>
        <caption>
          Arriving Flights
        </caption>
        <thead>
          <tr>
            <th>Tail Number</th>
            <th>Aircraft Type</th>
            <th>Parking Area (ft²)</th>
            <th>Arrival Date/Time</th>
          </tr>
        </thead>
   
        <tbody className="flight-table-container">
          {arrivingFlights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.acid}</td>
              <td>{flight.plane_type ? flight.plane_type : 'N/A'}</td>
              <td>{flight.parkingArea ? flight.parkingArea : 'N/A'}</td>
              <td>{formatDate(flight.eta)} {formatTime(flight.eta)}</td>
            </tr>
          ))}
        </tbody>
        
        
      </table>
    </div>
  );

}