import React from 'react';
import '../styles/Simulator.css';
import axios from 'axios';

// List of all planes currently at the airport 
const SimulatorAllPlanes = ({allPlanes, selectedAirport}) => {
    const handleMaintenanceClick = async (acid) => {
        const confirm = window.confirm("Is this plane currently in maintenance?");
        if (confirm) {
            try {
                const response = await axios.get(`http://localhost:5001/simulator/addMaintenance/${acid}?airport=${selectedAirport}`);
                if (response.status === 200) {
                    console.log("Plane added to maintenance");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <div id="planes-table">
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
                    {allPlanes.map((val, key) => (
                        <tr key={key}>
                            <td className="status-wrapper">
                                <div className={`status-box ${val.status === 'Arriving' ? 'blue-color' : val.status === 'Departing' ? 'yellow-color' : val.status === 'Parked' ? 'green-color' : 'red-color'}`}
                                onClick={() => handleMaintenanceClick(val.acid)}></div>
                            </td>
                            
                            <td>{val.acid}</td> {/* Tail # */}
                            <td>{val.status}</td> {/* Status  */}
                            <td>{val.plane_type ? val.plane_type: 'Unavailable'}</td> {/*plane type */}
                            <td>
                            {val.event ? new Date(val.event).toLocaleDateString('en-us', {day: 'numeric', month: 'numeric', year: 'numeric'}) : "N/A"} {val.event ? new Date(val.event).toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false}) : ""}
                            </td> {/* next event */}
                        </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>

    );
};

export default SimulatorAllPlanes;