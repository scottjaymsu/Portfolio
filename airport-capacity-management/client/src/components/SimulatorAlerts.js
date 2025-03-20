import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Simulator.css";

// For Alerts Center on right of Simulator Page
const SimulatorAlerts = ({ fbo, id }) => {
    // State for alert records
    const [alerts, setAlerts] = useState([]);
    // State to hold error message
    const [error, setError] = useState("");
    // State to hold fbo data
    const [fboData, setFboData] = useState([]);

    // Fetch alert records by airport code and FBO name when component mounts
    useEffect(() => {
        // Fetch alert by airport code and FBO name
        axios
            .get(`http://localhost:5001/alerts/getAlert/${id}/${fbo}`)
            .then((response) => {
                // Remove planes that are departing or in maintenance from recommendations
                const filteredAlerts = response.data.filter(
                    (alert) =>
                        alert.status !== "SCHEDULED" && alert.status !== "MAINTENANCE"
                );
                setAlerts(filteredAlerts);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching alert information:", err);
            });
    }, [id, fbo, error]);

    // Fetch all fbos for this airport
    useEffect(() => {
        axios
            .get(`http://localhost:5001/alerts/getFBOs/${id}`)
            .then((response) => {   
                setFboData(response.data);
            })
            .catch((err) => {
                setError(err);
                console.error("Error fetching FBO data:", err);
            });
    }, [id, error]);

    // Priorty of fbo input
    const fboPriority = fboData.find((fboItem) => fboItem.FBO_Name === fbo)?.Priority;

    // FBO for move recommendation
    let fboRec = null;

    for (const fboItem of fboData) {
    // Check if the FBO has available parking and priority is larger than fboPriority
    if (fboItem.parked_planes_count < fboItem.Total_Space && fboItem.Priority > fboPriority) {
        fboRec = fboItem.FBO_Name;
        // Break after finding the first valid FBO
        break; 
    }
    }

    // Format the date and time to prevent null timestamps
    function formatDateTime(date) {
        const newDate = new Date(date);

        if (newDate.getFullYear() === 1969) {
            return "N/A";
        }

        return (
            newDate.toLocaleDateString("en-us", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
            }) +
            " " +
            newDate.toLocaleTimeString("en-us", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
        );
    }

    return (
        <div id="alerts-center">
            <div id="alerts-title">ALERTS</div>
            <div>Move Recommendations</div>
            <div id="rec-table">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tail Number</th>
                                <th>Jet Type</th>
                                <th>Status</th>
                                <th>Next Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.length > 0 ? (
                                alerts.map((alert) => (
                                    <React.Fragment key={alert.id}>
                                        <tr className="expandable-row">
                                            <td className="alert-wrapper">
                                                <div className="alert-box green-color"></div>
                                                <span>{alert.acid || "Unknown"}</span>
                                            </td>
                                            <td>{alert.plane_type || "Unknown"}</td>
                                            <td>{alert.status || "N/A"}</td>
                                            <td>{alert.etd ? formatDateTime(alert.etd) : "N/A"}</td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center" }}>No recommendations available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SimulatorAlerts;