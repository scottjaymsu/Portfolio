/**
 * @file Airport.js
 * @description This file defines the Airport 
 * component which gathers its data from NodeJS api 
 * calls.
 */


import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Airport(id) {
    // State to hold airport data
    const [airportData, setAirportData] = useState({});
    // State to hold current capacity of airport
    const [currentCapacity, setCurrentCapacity] = useState({});
    // State to hold max capacity of airport
    const [maxCapacity, setMaxCapacity] = useState({});
    // State to hold error message
    const [error, setError] = useState('');

    // Fetch airport data by FAA Designator when component mounts
    useEffect(() => {
        // Fetch name and FAA designator of airport
        axios.get('http://localhost:5001/airportData/getAirportData/${id}')
            .then((response) => {
                setAirportData(response.data);
            })
            .catch((err) => {
                setError('Error fetching airport data');
                console.error('Error fetching airport data:', err);
            });
    }, [id]);

    // Fetch current capacity of airport when component mounts
    useEffect(() => {
        // Fetch current capacity of airport
        axios.get(`http://localhost:5001/airportData/getCurrentCapacity/${id}`)
            .then((response) => {
                setCurrentCapacity(response.data);
            })
            .catch((err) => {
                setError('Error fetching current capacity');
                console.error('Error fetching current capacity:', err);
            });
    }, [id]);

    // Fetch max capacity of airport when component mounts
    useEffect(() => {
        // Fetch max capacity of airport
        axios.get(`http://localhost:5001/airportData/getOverallCapacity/${id}`)
            .then((response) => {
                setMaxCapacity(response.data);
            })
            .catch((err) => {
                setError('Error fetching max capacity');
                console.error('Error fetching max capacity:', err);
            });
    }, [id]);

    return (
        <div>
            <h1>{airportData.name} ({airportData.ident})</h1>
            <h2>Current Capacity: {currentCapacity}</h2>
            <h2>Max Capacity: {maxCapacity}</h2>
            {error && <p>{error}</p>}
        </div>
    );
}