import React from "react";
import "../styles/Simulator.css";

// For Alerts Center on right of Simulator Page
const SimulatorAlerts = ({ recs, toggleRow, expandedRow }) => {
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
                                <th>Status</th>
                                <th>Next Event</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recs.map((val, key) => (
                                <React.Fragment key={key}>
                                    <tr className="expandable-row">
                                        <td className="alert-wrapper">
                                            <div className="alert-box green-color"></div>
                                            <span>{val.tailNumber}</span>
                                        </td>
                                        <td>{val.status}</td>
                                        <td className="alert-wrapper">
                                            <div className="date-toggle-wrapper">
                                                <div>{formatDateTime(val.nextEvent)}</div>
                                                <div
                                                    onClick={() => toggleRow(key)}
                                                    className={
                                                        expandedRow === key ? "up-arrow" : "down-arrow"
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRow === key && (
                                        <tr className="expanded-content active">
                                            <td colSpan="5">{val.recString}</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SimulatorAlerts;
