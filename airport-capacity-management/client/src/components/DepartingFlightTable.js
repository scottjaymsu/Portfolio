import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/FlightTable.css';

/**
 * Departing flight table
 * States hold departing flights info
 * @param id - faa designator of airport that 
 * flights are departing from
 * @returns component 
 */
export default function DepartingFlightTable({id}) {
    // State to hold departing flights
    const [departingFlights, setDepartingFlights] = useState([]);
    // State to hold error message
    const [error, setError] = useState('');

    // Fetch departing flights by faa designator when component mounts
    useEffect(() => {
        // Fetch departing flights by airport
        axios.get(`http://localhost:5001/flightData/getDepartingFlights/${id}`)
            .then((response) => {
                const sortedFlights = response.data.sort((a, b) => new Date(a.etd) - new Date(b.etd));
                setDepartingFlights(sortedFlights);
            })
            .catch((err) => {
                setError('Error fetching departing flights');
                console.error('Error fetching departing flights:', err);
            });
    }, []);

    // Format the ETD date to a more readable format
    const formatDate = (etd) => {
      const date = new Date(etd);
      return date.toLocaleDateString('en-GB'); // format: day/month/year
    };

    // Format the ETD time to a more readable format
    const formatTime = (etd) => {
      const date = new Date(etd);
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };


    /**
     * Create table for departing flights.
     * 
     * There are 2 columns {tail number,
     * departing date/time}
     * 
     * There are n rows,
     * where n is the number of departing flights.
     */    
 
    return (
      <div className='table-container'>
        <table>
          <caption>
            Departing Flights
          </caption>
          <thead>
            <tr>
              <th>Tail Number</th>
              <th>Aircraft Type</th>
              <th>Parking Area (ft^2)</th>
              <th>Departing Date/Time</th>
            </tr>
          </thead>
          <tbody>
            {departingFlights.map((flight, index) => (
              <tr key={index}>
                <td>{flight.acid}</td>
                <td>{flight.plane_type ? flight.plane_type : 'N/A'}</td>
                <td>{flight.parkingArea ? flight.parkingArea : 'N/A'}</td>
                <td>{formatDate(flight.etd)} {formatTime(flight.etd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    
}