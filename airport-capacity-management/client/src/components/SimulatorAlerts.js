import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Simulator.css";

// For Alerts Center on right of Simulator Page
const SimulatorAlerts = ({ toggleRow, expandedRow, fbo, id }) => {

    // state for alert records 
    const [alerts, setAlerts] = useState([]);

    // State to hold error message
    const [error, setError] = useState("");

    // Fetch alert records by airport code and fbo name when component mounts
    useEffect(() => {
        // Fetch alert by airport code and fbo name
        axios
            .get(`http://localhost:5001/alerts/getAlert/${id}/${fbo}`)
            .then((response) => {
                setAlerts(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching alert information:", error);
            });
    }, [id, fbo, error]);    


    const getNextEvent = (status) => {
        if (status === null || status === "ARRIVED") {
            return "Parked";
        } else if (status === "SCHEDULED") {
            return "Departing";
        } else if (status === "FLYING") {
            return "In Air";
        }
        return "Unknown"; // Default case if status doesn't match any of the expected values
    };

     // Function to handle the color-coded status box based on plane status
    const getStatusClass = (status) => {
        if (status === "ARRIVING") return "blue-color";
        if (status === "DEPARTING") return "yellow-color";
        if (status === "PARKED") return "green-color";
        return "red-color"; // Default case for unknown or unexpected status
    };

    return (
        <div id="alerts-table">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Tail Number</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Next Event</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts?.map((val, key) => (
                        <tr key={val.id || key}>
                            <td className="status-wrapper">
                                <div
                                    className={`status-box ${getStatusClass(val.status)}`}
                                ></div>
                            </td>
                            <td>{val.acid || "Unknown"}</td> {/* Tail Number */}
                            <td>{val.status || "No Status"}</td> {/* Status */}
                            <td>{val.plane_type ? val.plane_type : "Unavailable"}</td> {/* Plane Type */}
                            <td>
                                {val.etd
                                    ? new Intl.DateTimeFormat("en-US", {
                                          dateStyle: "short",
                                          timeStyle: "short",
                                          hour12: false,
                                      }).format(new Date(val.etd))
                                    : "TBD"}
                            </td> {/* Next Event Date */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SimulatorAlerts;
