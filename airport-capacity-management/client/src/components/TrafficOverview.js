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
    // // State to hold parked planes 
    // const [parkedPlanes, setParkedPlanes] = useState([]);
    // // State to hold planes under maintenance
    // const [planesUnder, setPlanesUnder] = useState([]);
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
                setError(err);
                console.error('Error fetching departing flights:', error);
            });
    }, [id, error]);

    // Fetch arriving flights by faa designator when component mounts
    useEffect(() => {
        // Fetch arriving flights by airport
        axios.get(`http://localhost:5001/flightData/getArrivingFlights/${id}`)
            .then((response) => {
                setArrivingFlights(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error('Error fetching arriving flights:', error);
            });
    }, [id, error]);  

    // Get data in "MM-DD" format from ISO string
    const getFormattedDate = (d) => {
        // null values
        if (!d) return '';

        const date = new Date(d);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
    };

    // Reverse sort flights by their ETA for arriving flights and ETD for departing flights
    const reverseFlightsByDate = (flights, key) => {
        return flights.sort((a, b) => {
            if (!a[key] || !b[key]) return 0;
            return new Date(b[key]) - new Date(a[key]);
        });
    };

    // Reverse sort the flights
    const sortedDepartingFlights = reverseFlightsByDate(departingFlights, 'etd');
    const sortedArrivingFlights = reverseFlightsByDate(arrivingFlights, 'eta');    
    
    // Count the number of arriving flights by date
    const countArriving = (flights) => {
        return flights.reduce((count, flight) => {
            // null eta
            if (!flight.eta) return count;

            const date = getFormattedDate(flight.eta);
            count[date] = count[date] ? count[date] + 1 : 1;
            return count;
        }, {});
    };

    // Count the number of departing flights by date    
    const countDeparting = (flights) => {
        return flights.reduce((count, flight) => {
            // null etd
            if (!flight.etd) return count;
            
            const date = getFormattedDate(flight.etd);
            count[date] = count[date] ? count[date] + 1 : 1;
            return count;
        }, {});
    };
    
     // Count the arriving and departing flights by date
    const departingCount = countDeparting(sortedDepartingFlights);
    const arrivingCount = countArriving(sortedArrivingFlights);
    
    
    
    // // Fetch parked planes by faa designator when component mounts
    // useEffect(() => {
    //     // Fetch parked planes by airport 
    //     axios.get(`http://localhost:5001/airportData/getParkedPlanes/${id}`)
    //         .then((response) => {
    //             setParkedPlanes(response.data);
 
    //         })
    //         .catch((err) => {
    //             setError('Error fetching parked planes');
    //             console.error('Error fetching parked planes:', err);
    //         });
    // }, []);

    // // Set random value for maintence (0 - # of parked planes - 2)
    // useEffect(() => {
    //     setPlanesUnder(Math.floor(Math.random() * parkedPlanes.length));        
    // }, [parkedPlanes]);  
    
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

    
    // Combine the data for the chart and table
    const dates = [...new Set([...Object.keys(departingCount), ...Object.keys(arrivingCount)])];
    const chartData = dates.map(date => ({
        category: date,
        Arriving: arrivingCount[date],
        Departing: departingCount[date]
    }));

    // // Data in the bar chart
    // const chartData = [
    //     {
    //         category : "Traffic Overview",
    //         Arriving : arrivingFlights.length,
    //         Departing : departingFlights.length
    //     }
    // ];

    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>               
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Arriving" fill="rgb(88,120,163)" />
                    <Bar dataKey="Departing" fill="rgb(228,147,67)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

