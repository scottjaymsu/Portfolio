import React from 'react';
import '../styles/Simulator.css';

// For Alerts Center on right of Simulator Page
const SimulatorAlerts = ({recs, toggleRow, expandedRow}) => {
    return (
        <div id="alerts-center">
            <div id="alerts-title">ALERTS</div>
            <div>Move Recommendations</div>
            <div id="rec-table">
                <div className='table-container'>
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
                                        <td className='alert-wrapper'>
                                            <span>{val.nextEvent}</span>
                                            <div onClick={() => toggleRow(key)} className={expandedRow === key ? 'up-arrow' : 'down-arrow'}></div>
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