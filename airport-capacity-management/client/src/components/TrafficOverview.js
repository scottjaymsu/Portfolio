import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/**
 * Component to display traffic information in bar graph 
 * x-axis displays time intervals
 * y-axis displays quantitative information for 
 * departing/arriving flights, planes in maintenance, and 
 * parked aircrafts
 * @param id - faa designator of airport that 
 * flights are departing from
 * @returns component 
 */

export default function TrafficOverview({id}) {
    // State to hold departing flights
    const [departingFlights, setDepartingFlights] = useState([]);
    // State to hold arriving flights
    const [arrivingFlights, setArrivingFlights] = useState([]);    
    // State to hold parked planes 
    const [parkedPlanes, setParkedPlanes] = useState([]);
    // State to hold planes under maintenance
    const [planesUnder, setPlanesUnder] = useState([]);
    // State to hold error message
    const [error, setError] = useState('');

    // Fetch departing flights by faa designator when component mounts
    useEffect(() => {
        // Fetch departing flights by airport
        axios.get(`http://localhost:5001/flightData/getDepartingFlights/${id}`)
            .then((response) => {
                setDepartingFlights(response.data);
            })
            .catch((err) => {
                setError('Error fetching departing flights');
                console.error('Error fetching departing flights:', err);
            });
    }, []);

    // Fetch arriving flights by faa designator when component mounts
    useEffect(() => {
        // Fetch arriving flights by airport
        axios.get(`http://localhost:5001/flightData/getArrivingFlights/${id}`)
            .then((response) => {
                setArrivingFlights(response.data);
            })
            .catch((err) => {
                setError('Error fetching arriving flights');
                console.error('Error fetching arriving flights:', err);
            });
    }, []);  
    
    // Fetch parked planes by faa designator when component mounts
    useEffect(() => {
        // Fetch parked planes by airport 
        axios.get(`http://localhost:5001/airportData/getParkedPlanes/${id}`)
            .then((response) => {
                setParkedPlanes(response.data);
 
            })
            .catch((err) => {
                setError('Error fetching parked planes');
                console.error('Error fetching parked planes:', err);
            });
    }, []);

    // Set random value for maintence (0 - # of parked planes - 2)
    useEffect(() => {
        setPlanesUnder(Math.floor(Math.random() * parkedPlanes.length));        
    }, [parkedPlanes]);  
    
    /**
     * Create bar chart to display quantitive info
     * info = 
     * {
     *      # of arriving flights,
     *      # of departing flights,
     *      # of parked planes,
     *      # of planes under maintenance
     * }
     */

    // Data in the bar chart
    const chartData = [
        {
            category : "Traffic Overview",
            Arriving : arrivingFlights.length,
            Departing : departingFlights.length,
            Parked : parkedPlanes.length,
            Maintenance : planesUnder
        }
    ];

    return (
        <div>
            <table style={{width: '100%', marginBottom: '20px', borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th colSpan={4} style={{textAlign: 'center', padding: '10px', backgroundColor: '#1e3a8a', fontSize: '18px', fontWeight: 'bold'}}>
                            Traffic Overview
                        </th>
                    </tr>
                </thead>
            </table>

            <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData}>               
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Arriving" fill="rgb(88,120,163)" />
                    <Bar dataKey="Departing" fill="rgb(228,147,67)" />
                    <Bar dataKey="Parked" fill="rgb(99, 188, 182)" />
                    <Bar dataKey="Maintenance" fill="rgb(209,96,94)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

