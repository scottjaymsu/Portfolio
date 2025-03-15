import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { AreaChart, Area, CartesianGrid } from "recharts";

// Helper to generate 24-hour mock data for a given date
const generateMockDataForDay = (date) => {
    const data = [];
    // show the hour in the X-axis label.
    for (let hour = 0; hour < 24; hour++) {
        const hourLabel = hour.toString().padStart(2, "0") + ":00";
        data.push({
            category: hourLabel,
            Arriving: Math.floor(Math.random() * 10),
            Departing: Math.floor(Math.random() * 10),
            Parked: Math.floor(Math.random() * 10),
        });
    }
    return data;
};

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

export default function TrafficOverview({ id }) {
    // The slider offset in days relative to today. 0 = today.
    const [dayOffset, setDayOffset] = useState(0);
    // Calculate the currently selected date
    const selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + dayOffset);
    // State to hold departing flights
    const [departingFlights, setDepartingFlights] = useState([]);
    // State to hold arriving flights
    const [arrivingFlights, setArrivingFlights] = useState([]);
    // State to hold maintenance planes
    const [maintenancePlanes, setMaintenancePlanes] = useState([]);
    // State to hold parked planes
    const [parkedPlanes, setParkedPlanes] = useState([]);
    // State to hold error message
    const [error, setError] = useState("");

    // Fetch departing flights by faa designator when component mounts
    useEffect(() => {
        // Fetch departing flights by airport
        axios
            .get(`http://localhost:5001/flightData/getDepartingFlights/${id}`)
            .then((response) => {
                setDepartingFlights(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching departing flights:", error);
            });
    }, [id, error]);

    // Fetch arriving flights by faa designator when component mounts
    useEffect(() => {
        // Fetch arriving flights by airport
        axios
            .get(`http://localhost:5001/flightData/getArrivingFlights/${id}`)
            .then((response) => {
                setArrivingFlights(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching arriving flights:", error);
            });
    }, [id, error]);

    // // Fetch parked planes by faa designator when component mounts
    // useEffect(() => {
    //     // Fetch parked planes by airport
    //     axios.get(`http://localhost:5001/airportData/getParkedPlanes/${id}`)
    //         .then((response) => {
    //             setParkedPlanes(response.data);

    //         })
    //         .catch((err) => {
    //             setError(err);
    //             console.error('Error fetching parked planes:', error);
    //         });
    // }, [id, error]);

    // Fetch maintenance planes by faa designator when component mounts
    useEffect(() => {
        axios
            .get(`http://localhost:5001/flightData/getMaintenancePlanes/${id}`)
            .then((response) => {
                setMaintenancePlanes(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching maintenance planes:", error);
            });
    }, [id, error]);

    // Navigation handlers
    const handlePrev = () => {
        if (dayOffset > -1) {
            setDayOffset((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (dayOffset < 1) {
            setDayOffset((prev) => prev + 1);
        }
    };

    const handleToday = () => {
        setDayOffset(0);
    };
    // Get data in "MM-DD" format from ISO string
    const getFormattedDate = (d) => {
        // null values
        if (!d) return "";

        const date = new Date(d);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${month}-${day}`;
    };

    // Reverse sort flights by their ETA for arriving flights and ETD for departing flights
    // Most recent flights are first
    const reverseFlightsByDate = (flights, key) => {
        return flights.sort((a, b) => {
            if (!a[key] || !b[key]) return 0;
            return new Date(b[key]) - new Date(a[key]);
        });
    };

    // Reverse sort the flights
    // Most recent flights are first
    const sortedDepartingFlights = reverseFlightsByDate(departingFlights, "etd");
    const sortedArrivingFlights = reverseFlightsByDate(arrivingFlights, "eta");

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

    // total number of parked planes
    const parkingCount = {};
    // Initialize the count for overall planes
    let count = 0;

    // iterate through arriving count (earliest dates first) and accumulate the count
    Object.keys(arrivingCount)
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((date) => {
            count += arrivingCount[date];
            parkingCount[date] = count;
        });

    let currParked = 0;
    // iterate through departing count and accumulate count
    Object.keys(departingCount)
        .sort((a, b) => new Date(a) - new Date(b))
        .forEach((date) => {
            if (parkingCount[date] - departingCount[date] >= 0) {
                currParked += departingCount[date];
                parkingCount[date] -= currParked;
            } else {
                currParked = 0;
                parkingCount[date] = 0;
            }
        });

    // // Iterate through arriving flights in
    // // reverse chronological order
    // sortedArrivingFlights.reverse().forEach(flight => {
    //     const eta = getFormattedDate(flight.eta);
    //     // null eta
    //     if (!eta) return;

    //     // if the date is different from the previous date
    //     if (eta !== prevDay) {
    //         parkingCount[eta] = parkingCount[prevDay] + 1;
    //         // update the previous date
    //         prevDay = eta;
    //     } else {
    //         parkingCount[eta] += 1;
    //     }
    // });

    // // Iterate through departing flights in
    // // reverse chronological order
    // sortedDepartingFlights.reverse().forEach(flight => {
    //     const etd = getFormattedDate(flight.etd);
    //     // null etd
    //     if (!etd) return;

    //     // if in parking count and etd stored is greater than 0
    //     if (flight.etd in parkingCount && parkingCount[flight.etd] > 0) {
    //         parkingCount[flight.etd] -= 1;
    //     }
    // });

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
    const dates = [
        ...new Set([
            ...Object.keys(arrivingCount),
            ...Object.keys(departingCount),
            ...Object.keys(parkingCount),
        ]),
    ];

    const chartData = dates.map((date) => ({
        category: date,
        Arriving: arrivingCount[date],
        Departing: departingCount[date],
        Parked: parkingCount[date],
    }));

    // Generate the 24-hour mock data for the selected day
    const mockChartData = generateMockDataForDay(selectedDate);

    // return (
    //     <div style={{ overflowX: 'auto', width: '100%' }}>
    //         <ResponsiveContainer width="400%" height={300}>
    //             <BarChart data={mockChartData}>
    //                 <XAxis dataKey="category" />
    //                 <YAxis />
    //                 <Tooltip />
    //                 <Legend />
    //                 <Bar dataKey="Arriving" fill="rgb(88,120,163)" />
    //                 <Bar dataKey="Departing" fill="rgb(228,147,67)" />
    //                 <Bar dataKey="Parked" fill="rgb(67,166,105)" />
    //             </BarChart>
    //         </ResponsiveContainer>
    //     </div>
    // );

    // Title: "Today" if current day, otherwise show the date string.
    const title = dayOffset === 0 ? "Today" : selectedDate.toDateString();

    return (
        <div>
            {/* Navigation buttons */}
            <div
                style={{
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <button
                    onClick={handlePrev}
                    disabled={dayOffset === -1}
                    className="graph-nav"
                >
                    &lt;
                </button>
                <button
                    onClick={handleToday}
                    className="graph-nav"
                >
                    Today
                </button>
                <button
                    onClick={handleNext}
                    disabled={dayOffset === 1}
                    className="graph-nav"
                >
                    &gt;
                </button></div>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <strong>{title}</strong>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={mockChartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="Departing"
                        stackId="1"
                        stroke="rgb(228,147,67)"
                        fill="rgb(228,147,67)"
                    />
                    <Area
                        type="monotone"
                        dataKey="Parked"
                        stackId="1"
                        stroke="rgb(133,181,178)"
                        fill="rgb(133,181,178)"
                    />
                    <Area
                        type="monotone"
                        dataKey="Arriving"
                        stackId="1"
                        stroke="rgb(88,120,163)"
                        fill="rgb(88,120,163)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
