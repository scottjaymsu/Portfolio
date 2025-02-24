import React from 'react';
import '../styles/Simulator.css';

// List of all planes currently at the airport 
const SimulatorAllPlanes = ({allPlanes}) => {
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
                                <div className={`status-box ${val.status === 'Arriving' ? 'blue-color' : val.status === 'Departing' ? 'yellow-color' : val.status === 'Parked' ? 'green-color' : 'red-color'}`}></div>
                            </td>
                            
                            <td>{val.acid}</td> {/* Tail # */}
                            <td>{val.status}</td> {/* Status  */}
                            <td>{val.plane_type ? val.plane_type: 'Unavailable'}</td> {/*plane type */}
                            <td>
                            {new Date(val.event).toLocaleDateString('en-us', {day: 'numeric', month: 'numeric', year: 'numeric'})} {new Date(val.event).toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: false})}
                            </td> {/* next event */}
                        </tr>
                    ))}
                    
                </tbody>
            </table>
        </div>

    );
};

export default SimulatorAllPlanes;